// @ts-nocheck
/**
 * Venom button engine: a scoped port of https://exteestudio.github.io/venom-button/
 *
 * The original is a full-screen page with one button. This version renders ONE button into a small
 * transparent canvas (button + PAD px on every side for the tendrils), so several can live in a page.
 * Left out on purpose: the Tune panel, the drop/paste-SVG hint, and the 3D hand cursor with its finger wraps
 * (tendrils latch onto the real pointer instead). Everything else (ray-marched goo, verlet tendrils,
 * lunge/snap/recoil, silk bridges, surface ripples, chrome label, press squash) is the original code.
 *
 * Physics and shader code is kept close to the source, hence the ts-nocheck above.
 */

const NP = 14;       // points per tendril
const MAXR = 6;      // surface ripples
const MAXBR = 9;     // silk bridges
const SUB = 1 / 240; // physics substep
const ITER = 3;
const PEAK_Z = 11;   // how far above the slab the pointer anchor floats
const LIFT_H = 14;   // hover lift of the slab, px
const BEVEL = 3;
const LABEL_PX = 120;
const LABEL_H = 256;
export const VENOM_PAD = 170; // transparent margin around the pill, px

const P = {
  reach: 120, awareness: 220, maxStrands: 6, snapStretch: 1.6, maxLen: 160,
  creep: 0.25, slither: 1.0, whip: 1.0, magnet: 1.6, thickness: 1.0, pull: 1.0, gravity: 900,
};

const GLOW = {
  primary: [1.0, 0.07, 0.22, 0.3],
  secondary: [0.85, 0.88, 1.0, 0.1],
};

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const ease = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const rand = (a, b) => a + Math.random() * (b - a);
function spring(o, k, kv, target, w, z, dt) {
  o[kv] += (w * w * (target - o[k]) - 2 * z * w * o[kv]) * dt;
  o[k] += o[kv] * dt;
}

export function createVenomEngine(host, hit, opts) {
  const reduced = !!opts.reducedMotion;
  const LABEL_CSS = opts.labelSize || 16;
  const HH = opts.halfHeight || 30;
  const SIDE = opts.sidePad || 30;
  let variant = opts.variant || 'primary';
  let destroyed = false;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'absolute', left: '0', top: '0', transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', display: 'block',
  });
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  host.appendChild(canvas);

  const FLOATBUF = !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
  let MAXS = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < 900 ? 6 : 18;

  // ───────────── state ─────────────
  const strands = [];
  const ripples = [];
  const cur = { x: -1e4, y: -1e4, cx: -1e4, cy: -1e4, present: false, down: false, mouse: false };
  const btn = { cx: 0, cy: 0, hw: 150, hh: HH, lbw: 72, lbh: 18, top: 14, sink: 5, dome: 1.2, lift: 0, liftV: 0, press: 0, pressV: 0, pressTarget: 0, intro: reduced ? 1 : 0, introV: 0 };
  let CURZ = 25;
  let time = reduced ? 3 : 0, lastSnap = -1, lastSpawn = -1, lastMicro = -1, nextProbe = 2.6, awareNow = 0;
  let labelAmt = 0, labelTarget = 0, labelInkW = 0, LABEL_W = 1024;
  let W = 1, H = 1, DPR = 1, CW = 1, CH = 1, quality = 1;

  // ───────────── shaders ─────────────
  const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

  const FRAG_SCENE = `#version 300 es
precision highp float;
precision highp int;
#define MAXS ${MAXS}
#define NP ${NP}
#define MAXR ${MAXR}
#define MAXBR ${MAXBR}
#define K0 2.5
#define K1 6.0
${FLOATBUF ? '' : '#define ENC8 1'}

uniform vec2 uRes;
uniform float uDpr;
uniform vec4 uBtn;     // cx, cy, half width, half height
uniform vec4 uBtnZ;    // top, sink, dome
uniform vec4 uBtnZ2;   // lift off the floor, bevel radius
uniform int uNS;
uniform vec4 uPts[MAXS * NP];
uniform vec4 uBox[MAXS];
uniform vec4 uAnc[MAXS];
uniform vec4 uAncD[MAXS];
uniform int uNBr;
uniform vec4 uBr[MAXBR * 3];
uniform vec4 uRip[MAXR];
uniform float uZTop;

out vec4 outG;

uint gMask[MAXS];
bool gBr[MAXBR];

float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }

vec2 button2D(vec2 p) {
  vec2 q = p - uBtn.xy;
  float d = length(vec2(max(abs(q.x) - (uBtn.z - uBtn.w), 0.0), q.y)) - uBtn.w;
  if (d > 110.0) return vec2(d, 0.0);
  float inner = clamp(-d / uBtn.w, 0.0, 1.0);
  float disp = uBtnZ.z * (1.0 - (1.0 - inner) * (1.0 - inner));
  float body = smoothstep(1.0, -14.0, d);
  float lift = 0.0;
  for (int i = 0; i < MAXS; i++) {
    if (i >= uNS) break;
    vec4 an = uAnc[i];
    if (an.z <= 0.0) continue;
    vec4 ad = uAncD[i];
    vec2 dp = p - an.xy;
    float al = dot(dp, ad.xy), ac = dp.x * ad.y - dp.y * ad.x;
    float sl = an.w * (1.0 + ad.z), a0 = an.w * ad.z * 0.7;
    lift += an.z * exp(-ac * ac / (2.0 * an.w * an.w) - (al - a0) * (al - a0) / (2.0 * sl * sl));
  }
  for (int i = 0; i < MAXR; i++) {
    vec4 r = uRip[i];
    if (r.w <= 0.0) continue;
    float sg = 12.0 + r.z * 40.0, rd = length(p - r.xy);
    lift += r.w * 0.6 * exp(-rd * rd / (2.0 * sg * sg)) * exp(-r.z * 5.0);
  }
  disp += lift * body;
  return vec2(d, disp);
}

float sdButton(vec2 bd, float z) {
  float hh = 0.5 * (uBtnZ.x + uBtnZ.y), zc = 0.5 * (uBtnZ.x - uBtnZ.y) + uBtnZ2.x;
  float re = min(uBtnZ2.y, hh);
  vec2 w = vec2(bd.x + re, abs(z - zc) - hh + re);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - re - bd.y;
}
float sdSeg(vec3 p, vec4 a, vec4 b) {
  vec3 pa = p - a.xyz, ba = b.xyz - a.xyz;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  return length(pa - ba * h) - mix(a.w, b.w, h);
}

float map(vec3 p, vec2 bd, out float dB, out float dS) {
  dB = sdButton(bd, p.z);
  float ds = 1e5;
  for (int s = 0; s < MAXS; s++) {
    if (s >= uNS) break;
    uint m = gMask[s];
    if (m == 0u) continue;
    float dd = 1e5;
    for (int j = 0; j < NP - 1; j++) {
      if ((m & (1u << uint(j))) == 0u) continue;
      dd = min(dd, sdSeg(p, uPts[s * NP + j], uPts[s * NP + j + 1]));
    }
    ds = smin(ds, dd, K0);
  }
  for (int b = 0; b < MAXBR; b++) {
    if (b >= uNBr) break;
    if (!gBr[b]) continue;
    vec4 a = uBr[b * 3], m = uBr[b * 3 + 1], c = uBr[b * 3 + 2];
    ds = smin(ds, min(sdSeg(p, a, m), sdSeg(p, m, c)), K0 * 0.6);
  }
  dS = ds;
  return smin(dB, ds, K1);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;

  for (int s = 0; s < MAXS; s++) {
    gMask[s] = 0u;
    if (s >= uNS) continue;
    vec4 bb = uBox[s];
    if (p.x < bb.x || p.y < bb.y || p.x > bb.z || p.y > bb.w) continue;
    uint m = 0u;
    for (int j = 0; j < NP - 1; j++) {
      vec4 a = uPts[s * NP + j], b = uPts[s * NP + j + 1];
      vec2 pa = p - a.xy, ba = b.xy - a.xy;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
      if (length(pa - ba * h) - max(a.w, b.w) < K1 + 2.0) m |= (1u << uint(j));
    }
    gMask[s] = m;
  }
  for (int b = 0; b < MAXBR; b++) {
    gBr[b] = false;
    if (b >= uNBr) continue;
    vec2 lo = min(min(uBr[b * 3].xy, uBr[b * 3 + 1].xy), uBr[b * 3 + 2].xy) - K0 - 3.0;
    vec2 hi = max(max(uBr[b * 3].xy, uBr[b * 3 + 1].xy), uBr[b * 3 + 2].xy) + K0 + 3.0;
    gBr[b] = all(greaterThan(p, lo)) && all(lessThan(p, hi));
  }

  vec2 bd = button2D(p);
  float z = uZTop, minD = 1e5, dB, dS;
  bool hit = false;
  for (int i = 0; i < 64; i++) {
    float d = map(vec3(p, z), bd, dB, dS);
    minD = min(minD, d);
    if (d < 0.02) { hit = true; break; }
    z -= max(d * 0.8, 0.01);
    if (z < 0.0) break;
  }
  if (!hit) {
#ifdef ENC8
    outG = vec4(clamp(minD / 4.0, 0.0, 1.0), 0.0, 0.0, 0.0);
#else
    outG = vec4(minD, 0.0, 0.0, 0.0);
#endif
    return;
  }

  vec3 pos = vec3(p, z);
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.3;
  float t0, t1;
  vec3 n = k.xyy * map(pos + k.xyy * e, button2D(pos.xy + k.xy * e), t0, t1)
         + k.yyx * map(pos + k.yyx * e, button2D(pos.xy + k.yy * e), t0, t1)
         + k.yxy * map(pos + k.yxy * e, button2D(pos.xy + k.yx * e), t0, t1)
         + k.xxx * map(pos + k.xxx * e, button2D(pos.xy + k.xx * e), t0, t1);
  n = normalize(n);
  float mat = 1.0 + smoothstep(-1.5, 1.5, dB - dS);
#ifdef ENC8
  outG = vec4(n.xy * 0.5 + 0.5, z / 128.0, mat * 0.25);
#else
  outG = vec4(n.xy, z, mat);
#endif
}`;

  const FRAG_SHADE = `#version 300 es
precision highp float;
${FLOATBUF ? '' : '#define ENC8 1'}
uniform sampler2D uG;
uniform sampler2D uLabel;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec4 uLabelBox;
uniform vec2 uLabelTx;
uniform float uLabelAmt;
uniform float uLabelLod;
uniform float uZMax;
uniform float uLift;
uniform vec4 uBtnP;
uniform vec2 uWin;
uniform vec4 uGlow;
out vec4 outC;

vec3 KEY;

vec4 dec(vec4 g) {
#ifdef ENC8
  if (g.a < 0.1) return vec4(g.r * 4.0, 0.0, 0.0, 0.0);
  return vec4(g.rg * 2.0 - 1.0, g.b * 128.0, g.a * 4.0);
#else
  return g;
#endif
}
float decH(vec4 g) {
#ifdef ENC8
  return g.b * 128.0;
#else
  return g.b;
#endif
}
vec2 uvOf(vec2 p) { return vec2(p.x * uDpr / uRes.x, 1.0 - p.y * uDpr / uRes.y); }
vec4 gAt(ivec2 c) { return dec(texelFetch(uG, clamp(c, ivec2(0), ivec2(uRes) - 1), 0)); }
float hAt(vec2 p, float lod) { return decH(textureLod(uG, uvOf(p), lod)); }
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

float softShadow(vec2 p, float h0) {
  vec2 L2 = normalize(KEY.xy);
  float tanE = KEY.z / length(KEY.xy);
  float res = 1.0, s = 1.0;
  for (int i = 0; i < 28; i++) {
    float zr = h0 + s * tanE;
    if (zr > uZMax) break;
    float hgt = hAt(p + L2 * s, log2(1.0 + s * 0.08 * uDpr));
    res = min(res, (1.5 - 0.7 * uLift) * (zr - hgt) / s);
    if (res < -0.2) break;
    s += 0.8 + s * 0.14;
  }
  res = clamp(res, 0.0, 1.0);
  return res * res * (3.0 - 2.0 * res);
}
float occlusion(vec2 p, float h) {
  vec2 uv = uvOf(p);
  float o = 0.0;
  o += 0.50 * clamp((decH(textureLod(uG, uv, log2(6.0 * uDpr))) - h) / 9.0, 0.0, 1.0);
  o += 0.32 * clamp((decH(textureLod(uG, uv, log2(20.0 * uDpr))) - h) / 26.0, 0.0, 1.0);
  o += 0.26 * clamp((decH(textureLod(uG, uv, log2(60.0 * uDpr))) - h) / 60.0, 0.0, 1.0);
  return clamp(1.0 - o, 0.0, 1.0);
}

float softbox(vec3 R, vec3 c, vec2 size, float edge) {
  float cd = dot(R, c);
  if (cd <= 0.0) return 0.0;
  vec3 t1 = normalize(cross(c, vec3(0.0, 0.0, 1.0)));
  vec3 t2 = cross(t1, c);
  vec2 q = abs(vec2(dot(R, t1), dot(R, t2)) / cd) / size;
  return (1.0 - smoothstep(edge, 1.0, q.x)) * (1.0 - smoothstep(edge, 1.0, q.y)) * (0.85 + 0.15 * (1.0 - q.y));
}
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}
vec3 room(vec3 R) {
  vec3 c = normalize(vec3(-0.34, -0.42, 0.84));
  float cd = dot(R, c);
  if (cd <= 0.2) return vec3(0.0);
  vec3 t1 = normalize(cross(c, vec3(0.0, 0.0, 1.0)));
  vec3 t2 = cross(t1, c);
  vec2 w = vec2(dot(R, t1), dot(R, t2)) / cd / vec2(0.34, 0.28);
  float wallMask = 1.0 - smoothstep(1.3, 2.3, length(w * vec2(0.8, 1.0)));
  vec3 col = vec3(0.92, 0.78, 0.6) * 0.3 * wallMask;
  float shelf = smoothstep(-2.3, -2.2, w.y) * (1.0 - smoothstep(-1.35, -1.25, w.y));
  col = mix(col, vec3(0.3, 0.18, 0.1) * 0.5, shelf * wallMask);
  vec2 lp = w - vec2(1.75, -0.55);
  col += vec3(1.0, 0.7, 0.4) * 5.0 * exp(-dot(lp, lp) / 0.05);
  vec2 aw = abs(w);
  float glass = (1.0 - smoothstep(0.94, 1.0, aw.x)) * (1.0 - smoothstep(0.94, 1.0, aw.y));
  if (glass > 0.0) {
    float v = w.y * 0.5 + 0.5;
    vec3 sky = mix(vec3(1.0, 0.92, 0.8), vec3(0.6, 0.76, 1.0), smoothstep(0.2, 1.0, v)) * 16.0;
    float line = 0.3 + 0.16 * vn(vec2(w.x * 4.0, 3.1)) + 0.07 * vn(vec2(w.x * 11.0, 7.3));
    float tree = 1.0 - smoothstep(line - 0.03, line + 0.03, v);
    vec3 green = mix(vec3(0.16, 0.3, 0.12), vec3(0.32, 0.45, 0.2), vn(w * 9.0)) * 3.0;
    vec3 view = mix(sky, green, tree);
    float mull = max(1.0 - smoothstep(0.025, 0.05, aw.x), 1.0 - smoothstep(0.025, 0.05, abs(w.y - 0.1)));
    view = mix(view, vec3(0.85, 0.8, 0.72) * 0.6, mull);
    col = mix(col, view, glass);
  }
  return col;
}

vec3 env(vec3 R) {
  vec2 rd = normalize(R.xy + vec2(1e-5));
  float keySide = 0.5 + 0.5 * dot(rd, normalize(KEY.xy));
  if (R.z < 0.0) return mix(vec3(0.14) * keySide, vec3(0.0015), smoothstep(0.0, -0.22, R.z));
  vec3 c = vec3(0.0015);
  c += room(R);
  c += vec3(1.0) * 7.0 * softbox(R, normalize(vec3(-0.96, 0.08, 0.2)), vec2(0.75, 0.035), 0.7);
  c += vec3(1.0) * 5.0 * softbox(R, normalize(vec3(0.95, -0.12, 0.24)), vec2(0.75, 0.035), 0.7);
  c += vec3(1.0) * 5.0 * softbox(R, normalize(vec3(0.45, 0.55, 0.75)), vec2(0.07, 0.07), 0.5);
  c += vec3(0.1) * softbox(R, normalize(vec3(0.12, 0.25, 1.0)), vec2(0.8, 0.55), 0.2);
  float wall = 1.0 - smoothstep(0.0, 0.1, R.z);
  c += vec3(0.28) * wall * wall * keySide * keySide * keySide;
  return c;
}

vec3 shadeLabel(vec2 lu, float sh, float ao) {
  vec2 tx = uLabelTx;
  float mx = textureLod(uLabel, lu + vec2(tx.x, 0.0), uLabelLod).a - textureLod(uLabel, lu - vec2(tx.x, 0.0), uLabelLod).a;
  float my = textureLod(uLabel, lu + vec2(0.0, tx.y), uLabelLod).a - textureLod(uLabel, lu - vec2(0.0, tx.y), uLabelLod).a;
  vec3 N = normalize(vec3(-mx * 1.1, -my * 1.1, 1.0));
  vec3 R = reflect(vec3(0.0, 0.0, -1.0), N);
  vec3 silver = vec3(0.9, 0.91, 0.94);
  float t = clamp((lu.y - 0.32) / 0.36, 0.0, 1.0);
  float grad = t < 0.48 ? mix(1.12, 0.74, smoothstep(0.0, 0.48, t))
                        : mix(0.6, 0.95, smoothstep(0.5, 1.0, t));
  vec3 col = silver * grad * (0.82 + 0.18 * sh);
  col += env(R) * silver * 0.3;
  float edge = clamp(length(vec2(mx, my)) * 1.6, 0.0, 1.0);
  float facing = dot(normalize(vec2(mx, my) + 1e-5), normalize(KEY.xy));
  col *= 1.0 - 0.25 * edge * smoothstep(0.0, 0.8, -facing);
  col += vec3(1.0) * 0.55 * edge * smoothstep(0.1, 0.9, facing);
  vec3 Hh = normalize(KEY + vec3(0.0, 0.0, 1.0));
  float NdH = max(dot(N, Hh), 0.0), a2 = 0.01;
  col += vec3(1.0) * a2 / (3.14159 * pow(NdH * NdH * (a2 - 1.0) + 1.0, 2.0)) * 0.05 * sh;
  return col * mix(0.85, 1.0, ao);
}

vec3 faceWindow(vec2 b) {
  vec2 w = vec2((b.x - uWin.x + b.y * 0.08) / uWin.y, (b.y + 0.3) / 1.15);
  float fade = 1.0 - smoothstep(0.2, 1.05, length(w * vec2(0.85, 0.8)));
  if (fade <= 0.0) return vec3(0.0);
  float v = 0.5 - 0.5 * w.y;
  vec3 sky = mix(vec3(0.95, 0.88, 0.8), vec3(0.66, 0.78, 0.96), smoothstep(0.2, 1.0, v));
  float line = 0.36 + 0.1 * vn(vec2(w.x * 1.6, 2.0));
  float tree = 1.0 - smoothstep(line - 0.2, line + 0.2, v);
  vec3 view = mix(sky, vec3(0.24, 0.36, 0.18) * 0.65, tree * 0.85);
  float sash = 1.0 - smoothstep(0.04, 0.26, abs(w.y + 0.1));
  float stile = 1.0 - smoothstep(0.05, 0.3, abs(w.x));
  view *= 1.0 - 0.5 * max(sash, stile * 0.6);
  return view * 0.14 * fade;
}

vec3 shadeGoo(vec2 p, vec4 g) {
  vec3 N = vec3(g.xy, sqrt(max(1e-4, 1.0 - dot(g.xy, g.xy))));
  float strandness = clamp(g.w - 1.0, 0.0, 1.0);
  vec3 V = vec3(0.0, 0.0, 1.0);
  float NdV = clamp(N.z, 0.03, 1.0);
  vec3 R = reflect(-V, N);
  float F = 0.04 + 0.96 * pow(1.0 - NdV, 5.0);
  float sh = softShadow(p, g.z + 0.6);
  float ao = occlusion(p, g.z);

  vec3 dN = vec3(N.xy, 0.0) * 0.07 + vec3(0.012, 0.008, 0.0);
  vec3 spec = vec3(env(normalize(R + dN)).r, env(R).g, env(normalize(R - dN)).b) * F * mix(0.5, 1.0, min(sh, ao));
  vec3 Hh = normalize(KEY + V);
  float NdH = max(dot(N, Hh), 0.0), a2 = 0.0025;
  float D = a2 / (3.14159 * pow(NdH * NdH * (a2 - 1.0) + 1.0, 2.0));
  spec += vec3(0.9, 0.95, 1.0) * D * F * 0.55 * sh;

  float matte = (1.0 - strandness) * 0.92;
  float ar2 = 0.16;
  float Dr = ar2 / (3.14159 * pow(NdH * NdH * (ar2 - 1.0) + 1.0, 2.0));
  vec3 cRoom = normalize(vec3(-0.34, -0.42, 0.84));
  vec3 rough = vec3(1.0) * Dr * F * 0.06 * sh
             + vec3(0.95, 0.9, 0.84) * pow(max(dot(R, cRoom), 0.0), 10.0) * F * 0.9;
  spec = mix(spec, rough, matte);

  vec3 diff = vec3(0.0007) * (1.8 * max(dot(N, KEY), 0.0) * sh + 0.9 * ao);
  vec3 col = diff + spec;

  vec2 bq = (p - uBtnP.xy) / uBtnP.zw + N.xy * 1.6;
  vec2 dsp = normalize(bq - vec2(uWin.x, -0.3) + 1e-4) * 0.02;
  vec3 win = vec3(faceWindow(bq + dsp).r, faceWindow(bq).g, faceWindow(bq - dsp).b);
  col += win * matte * mix(0.6, 1.0, ao);

  float bevel = 1.0 - smoothstep(0.3, 0.86, N.z);
  vec2 nd = normalize(N.xy + 1e-5);
  float rimL = pow(max(dot(nd, vec2(-0.6, -0.8)), 0.0), 2.0);
  float rimR = pow(max(dot(nd, vec2(0.8, 0.6)), 0.0), 3.0) * 0.55;
  vec2 cq = (p - uBtnP.xy) / uBtnP.zw;
  float glint = pow(0.5 + 0.5 * cos(atan(cq.y, cq.x) - uTime * 0.9), 28.0);
  vec3 rimC = vec3(0.82, 0.9, 1.0) * rimL + vec3(1.0, 0.94, 0.86) * rimR + vec3(1.0) * glint * 1.4;
  col += rimC * bevel * 0.5 * (1.0 - strandness) * mix(0.7, 1.0, sh);

  if (uLabelAmt > 0.0) {
    vec2 lu = (p - uLabelBox.xy) / (2.0 * uLabelBox.zw) + 0.5;
    if (lu.x > 0.0 && lu.y > 0.0 && lu.x < 1.0 && lu.y < 1.0) {
      float m = textureLod(uLabel, lu, uLabelLod).a * (1.0 - smoothstep(0.15, 0.5, strandness)) * uLabelAmt;
      if (m > 0.002) col = mix(col, shadeLabel(lu, sh, ao), m);
    }
  }
  return col;
}

float sdPill(vec2 q, vec2 b) { return length(vec2(max(abs(q.x) - (b.x - b.y), 0.0), q.y)) - b.y; }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

void main() {
  KEY = normalize(vec3(-0.45, -0.56, 0.74));
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec4 g = gAt(c);
  vec3 col = vec3(0.0);
  float a = 0.0;
  if (g.w < 0.5) {
    float cov = clamp(0.5 - g.x * uDpr, 0.0, 1.0);
    if (cov > 0.0) {
      vec4 n0 = gAt(c + ivec2(1, 0)), n1 = gAt(c - ivec2(1, 0)), n2 = gAt(c + ivec2(0, 1)), n3 = gAt(c - ivec2(0, 1));
      vec4 gn = n0.w > 0.5 ? n0 : n1.w > 0.5 ? n1 : n2.w > 0.5 ? n2 : n3.w > 0.5 ? n3 : vec4(0.0);
      col = gn.w > 0.5 ? shadeGoo(p, gn) : vec3(0.012);
      a = cov;
    }
  } else {
    col = shadeGoo(p, g);
    a = 1.0;
  }
  col = pow(aces(col * 0.95), vec3(1.0 / 2.2));
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  // soft coloured glow around the pill, composited under the goo (premultiplied alpha)
  float gd = max(sdPill(p - uBtnP.xy, uBtnP.zw), 0.0);
  float ga = uGlow.a * (exp(-gd / 14.0) * 0.7 + exp(-gd / 46.0) * 0.3);
  vec3 outRgb = col * a + uGlow.rgb * ga * (1.0 - a);
  float outA = a + ga * (1.0 - a);
  outC = vec4(outRgb, outA);
}`;

  const FRAG_FXAA = `#version 300 es
precision highp float;
uniform sampler2D uC;
uniform vec2 uRes;
out vec4 outC;
float luma(vec4 c) { return dot(c.rgb, vec3(0.299, 0.587, 0.114)) + c.a * 0.5; }
void main() {
  vec2 px = 1.0 / uRes, uv = gl_FragCoord.xy * px;
  vec4 cM = texture(uC, uv);
  float lNW = luma(texture(uC, uv + vec2(-1.0, -1.0) * px)), lNE = luma(texture(uC, uv + vec2(1.0, -1.0) * px));
  float lSW = luma(texture(uC, uv + vec2(-1.0, 1.0) * px)), lSE = luma(texture(uC, uv + vec2(1.0, 1.0) * px));
  float lM = luma(cM);
  float lMin = min(lM, min(min(lNW, lNE), min(lSW, lSE))), lMax = max(lM, max(max(lNW, lNE), max(lSW, lSE)));
  if (lMax - lMin < max(0.03, lMax * 0.08)) { outC = cM; return; }
  vec2 dir = vec2(-((lNW + lNE) - (lSW + lSE)), (lNW + lSW) - (lNE + lSE));
  float reduce = max((lNW + lNE + lSW + lSE) * 0.03125, 1.0 / 128.0);
  dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + reduce), -8.0, 8.0) * px;
  vec4 A = 0.5 * (texture(uC, uv - dir / 6.0) + texture(uC, uv + dir / 6.0));
  vec4 B = A * 0.5 + 0.25 * (texture(uC, uv - dir * 0.5) + texture(uC, uv + dir * 0.5));
  float lB = luma(B);
  outC = (lB < lMin || lB > lMax) ? A : B;
}`;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src.trim());
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error('venom shader: ' + gl.getShaderInfoLog(sh));
    return sh;
  }
  function program(fs, names) {
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    const u = {};
    for (const n of names) u[n] = gl.getUniformLocation(prog, n);
    return { prog, u };
  }

  let p1, p2, p3;
  try {
    p1 = program(FRAG_SCENE, ['uRes', 'uDpr', 'uBtn', 'uBtnZ', 'uBtnZ2', 'uNS', 'uPts', 'uBox', 'uAnc', 'uAncD', 'uNBr', 'uBr', 'uRip', 'uZTop']);
    p2 = program(FRAG_SHADE, ['uG', 'uLabel', 'uRes', 'uDpr', 'uTime', 'uLabelBox', 'uLabelTx', 'uLabelAmt', 'uLabelLod', 'uZMax', 'uLift', 'uBtnP', 'uWin', 'uGlow']);
    p3 = program(FRAG_FXAA, ['uC', 'uRes']);
  } catch (err) {
    console.warn(err);
    host.removeChild(canvas);
    return null;
  }

  const vao = gl.createVertexArray();
  let gTex = null, cTex = null;
  const fbo = gl.createFramebuffer(), cFbo = gl.createFramebuffer();
  function makeBuffers() {
    if (gTex) gl.deleteTexture(gTex);
    gTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, gTex);
    const levels = Math.floor(Math.log2(Math.max(W, H))) + 1;
    gl.texStorage2D(gl.TEXTURE_2D, levels, FLOATBUF ? gl.RGBA16F : gl.RGBA8, W, H);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gTex, 0);
    if (cTex) gl.deleteTexture(cTex);
    cTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, cTex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, W, H);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, cFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // ───────────── label (text → mask texture) ─────────────
  const labelCanvas = document.createElement('canvas');
  const lctx = labelCanvas.getContext('2d');
  const labelTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, labelTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  labelCanvas.width = LABEL_W; labelCanvas.height = LABEL_H;
  let labelText = '';

  function drawLabel() {
    const font = `700 ${LABEL_PX}px "Geist", system-ui, sans-serif`;
    lctx.font = font;
    const m0 = lctx.measureText(labelText);
    const ink = m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight;
    LABEL_W = clamp(Math.ceil((ink + 80) / 16) * 16, 512, 4096);
    labelCanvas.width = LABEL_W; labelCanvas.height = LABEL_H; // resizing resets the context state
    lctx.font = font;
    lctx.fillStyle = 'white';
    lctx.textAlign = 'center';
    lctx.textBaseline = 'alphabetic';
    const m = lctx.measureText(labelText);
    lctx.fillText(labelText, LABEL_W / 2, LABEL_H / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
    labelInkW = ink;
    gl.bindTexture(gl.TEXTURE_2D, labelTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, labelCanvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    layout();
  }
  async function setLabel(text) {
    labelText = text;
    labelInkW = 0;
    layout();
    try {
      await Promise.race([
        document.fonts.load(`700 ${LABEL_PX}px "Geist"`, text),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
    } catch { /* fall back to the system font */ }
    if (destroyed) return;
    drawLabel();
    labelAmt = 0; labelTarget = 1;
    // if Geist arrives late, redraw so the pill hugs the real glyph widths
    document.fonts.ready.then(() => { if (!destroyed) drawLabel(); });
  }

  // ───────────── geometry ─────────────
  function geo() {
    const e = btn.intro, pr = btn.press;
    return {
      cx: btn.cx, cy: btn.cy,
      hw: btn.hh * 0.5 + (btn.hw - btn.hh * 0.5) * e + 2.5 * pr,
      hh: btn.hh * (0.55 + 0.45 * e) + 1 * pr,
      top: Math.max(1, btn.top * e * (1 - 0.3 * pr)),
    };
  }
  function pillEdge(x, y, g, inset = 0) {
    const a = g.hw - g.hh;
    const ax = clamp(x - g.cx, -a, a);
    let dx = x - g.cx - ax, dy = y - g.cy;
    let L = Math.hypot(dx, dy);
    if (L < 1e-3) { dx = 0; dy = -1; L = 1e-3; } else { dx /= L; dy /= L; }
    const R = g.hh - inset;
    return { x: g.cx + ax + dx * R, y: g.cy + dy * R, nx: dx, ny: dy, d: L - g.hh };
  }
  function anchorFor(px, py, lat, g) {
    const e = pillEdge(px, py, g);
    return pillEdge(e.x - e.ny * lat - e.nx * 4, e.y + e.nx * lat - e.ny * 4, g, 10);
  }
  function addRipple(x, y, amp) {
    if (reduced) return;
    ripples.push({ x, y, age: 0, amp });
    if (ripples.length > MAXR) ripples.shift();
  }

  function layout() {
    const sc = LABEL_CSS / LABEL_PX;
    const est = Math.max(60, labelText.length * 0.62 * LABEL_PX);
    btn.hh = HH;
    btn.hw = ((labelInkW || est) * sc) / 2 + SIDE;
    btn.lbw = (LABEL_W * sc) / 2;
    btn.lbh = (LABEL_H * sc) / 2;
    CW = 2 * Math.ceil(btn.hw + VENOM_PAD);
    CH = 2 * Math.ceil(btn.hh + VENOM_PAD);
    btn.cx = CW / 2; btn.cy = CH / 2;
    canvas.style.width = CW + 'px';
    canvas.style.height = CH + 'px';
    resizeGL();
    opts.onLayout?.(btn.hw * 2, btn.hh * 2);
  }
  function resizeGL() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
    const nw = Math.max(1, Math.round(CW * dpr)), nh = Math.max(1, Math.round(CH * dpr));
    DPR = nw / CW;
    if (nw === W && nh === H && gTex) return;
    W = nw; H = nh;
    canvas.width = W; canvas.height = H;
    makeBuffers();
  }

  // ───────────── tendrils ─────────────
  function newStrand(kind, g, ax, ay) {
    const s = {
      kind, state: 'grow', pin: 'anchor',
      lx: (ax - g.cx) / g.hw, ly: (ay - g.cy) / g.hh,
      pos: new Float32Array(NP * 3), prev: new Float32Array(NP * 3), rad: new Float32Array(NP).fill(2),
      u: 0, ud: 0, uKick: true,
      rest: 1, vol: 0, stretch: 1, pinch: 0, len: 0,
      neckS: rand(0.42, 0.62), side: Math.random() < 0.5 ? -1 : 1, wig: rand(0.5, 1.2), phase: rand(0, 100),
      snapMul: rand(0.85, 1.15), lenMul: rand(0.88, 1.12),
      lat: 0, life: 0, ttl: 0, probe: null, mound: 0, dead: false, retract: 0, elong: 0, dirX: 0, dirY: -1,
    };
    const z = Math.max(2, g.top - 4) + btn.lift * LIFT_H;
    const e = pillEdge(ax, ay, g);
    for (let i = 0; i < NP; i++) {
      const o = i * 3;
      s.pos[o] = s.prev[o] = ax + e.nx * i * 0.4;
      s.pos[o + 1] = s.prev[o + 1] = ay + e.ny * i * 0.4;
      s.pos[o + 2] = s.prev[o + 2] = z;
    }
    return s;
  }
  function spawnReach(g) {
    if (strands.length >= MAXS - 1) return;
    const k = strands.filter((s) => s.kind === 'reach' && s.pin === 'anchor' && s.state !== 'recoil').length;
    const lat = [0, 30, -30, 58, -58, 82, -82][k % 7] + rand(-6, 6);
    const a = anchorFor(cur.x, cur.y, lat, g);
    const s = newStrand('reach', g, a.x, a.y);
    s.lat = lat;
    s.vol = Math.PI * 1.25 * 1.25 * 170;
    strands.push(s);
  }
  function spawnMicro(g) {
    if (strands.length >= MAXS - 6) return;
    const lat = rand(-1, 1) * 75;
    const a = anchorFor(cur.x, cur.y, lat, g);
    const s = newStrand('micro', g, a.x, a.y);
    s.lat = lat;
    s.probe = { len: rand(0.5, 1.2), z: rand(1, 5), ph: rand(0, 6.28) };
    s.ttl = rand(0.7, 1.9);
    s.vol = Math.PI * 0.55 * 0.55 * 40;
    strands.push(s);
  }
  function outlineAt(t, g) {
    const a = g.hw - g.hh, straight = 2 * a, cap = Math.PI * g.hh, per = 2 * straight + 2 * cap;
    let s = (((t % 1) + 1) % 1) * per;
    if (s < straight) return pillEdge(g.cx - a + s, g.cy - g.hh - 1, g);
    s -= straight;
    if (s < cap) { const th = -Math.PI / 2 + s / g.hh; return pillEdge(g.cx + a + Math.cos(th) * g.hh * 2, g.cy + Math.sin(th) * g.hh * 2, g); }
    s -= cap;
    if (s < straight) return pillEdge(g.cx + a - s, g.cy + g.hh + 1, g);
    s -= straight;
    const th = Math.PI / 2 + s / g.hh;
    return pillEdge(g.cx - a + Math.cos(th) * g.hh * 2, g.cy + Math.sin(th) * g.hh * 2, g);
  }
  let lastProbeT = Math.random();
  function spawnProbe(g) {
    const dir = Math.random() < 0.5 ? -1 : 1, n = Math.random() < 0.5 ? 2 : 3;
    const t = lastProbeT + rand(0.25, 0.75);
    lastProbeT = t;
    const base = outlineAt(t, g);
    for (let i = 0; i < n && strands.length < MAXS - 2; i++) {
      const lat = (i - (n - 1) / 2) * 13 + rand(-3, 3);
      const a = pillEdge(base.x - base.ny * lat, base.y + base.nx * lat, g, 8);
      const s = newStrand('probe', g, a.x, a.y);
      s.probe = { nx: a.nx, ny: a.ny, dist: rand(11, 20), z: rand(2, 6), dir, delay: i * 0.07 };
      s.ttl = rand(0.8, 1.0);
      s.vol = Math.PI * 0.8 * 0.8 * 40;
      strands.push(s);
    }
  }

  const cum = new Float32Array(NP), tmpP = new Float32Array(NP * 3), tmpV = new Float32Array(NP * 3);
  function truncate(s, Lnew) {
    const pos = s.pos, prev = s.prev;
    cum[0] = 0;
    for (let i = 1; i < NP; i++) {
      const a = (i - 1) * 3, b = i * 3;
      cum[i] = cum[i - 1] + Math.hypot(pos[b] - pos[a], pos[b + 1] - pos[a + 1], pos[b + 2] - pos[a + 2]);
    }
    if (cum[NP - 1] < 1e-3 || Lnew >= cum[NP - 1]) return;
    let k = 0;
    for (let j = 0; j < NP; j++) {
      const target = (Lnew * j) / (NP - 1);
      while (k < NP - 2 && cum[k + 1] < target) k++;
      const t = clamp((target - cum[k]) / Math.max(cum[k + 1] - cum[k], 1e-6), 0, 1);
      for (let c = 0; c < 3; c++) {
        tmpP[j * 3 + c] = pos[k * 3 + c] * (1 - t) + pos[(k + 1) * 3 + c] * t;
        tmpV[j * 3 + c] = prev[k * 3 + c] * (1 - t) + prev[(k + 1) * 3 + c] * t;
      }
    }
    pos.set(tmpP); prev.set(tmpV);
  }
  function resample(src, a, b) {
    const out = new Float32Array(NP * 3);
    for (let j = 0; j < NP; j++) {
      const f = a + ((b - a) * j) / (NP - 1);
      const i0 = clamp(Math.floor(f), 0, NP - 2), t = f - i0;
      for (let c = 0; c < 3; c++) out[j * 3 + c] = src[i0 * 3 + c] * (1 - t) + src[(i0 + 1) * 3 + c] * t;
    }
    return out;
  }
  function split(s, g) {
    const k = s.neckS * (NP - 1);
    const base = { ...s, kind: 'piece', state: 'recoil', pin: 'anchor', pinch: 0,
      pos: resample(s.pos, 0, k), prev: resample(s.prev, 0, k), rad: new Float32Array(NP), vol: s.vol * s.neckS };
    const tip = { ...s, kind: 'piece', state: 'recoil', pin: 'cursor', pinch: 0, mound: 0,
      pos: resample(s.pos, NP - 1, k), prev: resample(s.prev, NP - 1, k), rad: new Float32Array(NP), vol: s.vol * (1 - s.neckS) };
    base.len = s.len * s.neckS; base.rest = base.len / (NP - 1);
    tip.len = s.len * (1 - s.neckS); tip.rest = tip.len / (NP - 1);
    base.retract = tip.retract = 0;
    const idx = strands.indexOf(s);
    strands[idx] = base;
    if (strands.length < MAXS) strands.push(tip);
    addRipple(g.cx + s.lx * g.hw, g.cy + s.ly * g.hh, 0.8);
    lastSnap = time;
  }
  function releaseAll(absorb) {
    for (const s of strands) {
      if (s.kind === 'reach' && (s.state === 'grow' || s.state === 'attached')) {
        if (absorb || s.state === 'grow') { s.state = 'recoil'; s.kind = 'piece'; }
        else if (!s.pinch) s.pinch = 1e-4;
      }
    }
  }

  function stepStrand(s, dt, g) {
    s.life += dt;
    const R = s.pin === 'anchor'
      ? [g.cx + s.lx * g.hw, g.cy + s.ly * g.hh, Math.max(2, g.top - 4) + btn.lift * LIFT_H]
      : [cur.x, cur.y, CURZ];

    let T = null;
    if (s.kind === 'reach' && (s.state === 'grow' || s.state === 'attached')) {
      T = [cur.x, cur.y, CURZ];
      if (s.state === 'attached') {
        const an = anchorFor(cur.x, cur.y, s.lat, g), k = 1 - Math.exp(-dt * 1.4);
        s.lx += ((an.x - g.cx) / g.hw - s.lx) * k;
        s.ly += ((an.y - g.cy) / g.hh - s.ly) * k;
      }
    } else if (s.kind === 'micro' && s.state !== 'recoil') {
      const an = anchorFor(cur.x, cur.y, s.lat, g), k = 1 - Math.exp(-dt * 2);
      s.lx += ((an.x - g.cx) / g.hw - s.lx) * k;
      s.ly += ((an.y - g.cy) / g.hh - s.ly) * k;
      const e2 = pillEdge(R[0], R[1], g);
      const tx = cur.x - R[0], ty = cur.y - R[1];
      const tl = Math.hypot(tx, ty) || 1;
      let dx = e2.nx * 0.25 + (tx / tl) * 0.75, dy = e2.ny * 0.25 + (ty / tl) * 0.75;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl; dy /= dl;
      const len = (10 + 38 * awareNow) * s.probe.len, sway = Math.sin(time * 3 + s.probe.ph) * 4;
      T = [R[0] + dx * len - dy * sway, R[1] + dy * len + dx * sway, R[2] + s.probe.z * awareNow];
      if (s.life > s.ttl || awareNow < 0.08) { s.state = 'recoil'; T = null; }
    } else if (s.kind === 'probe' && s.state !== 'recoil') {
      const pr = s.probe, f = clamp((s.life - pr.delay) / s.ttl, 0, 1), wave = Math.sin(Math.PI * f);
      const glide = pr.dir * (f - 0.3) * 24, out = 3 + pr.dist * wave;
      T = [R[0] + pr.nx * out - pr.ny * glide, R[1] + pr.ny * out + pr.nx * glide, R[2] + pr.z * wave];
      if (s.life > s.ttl + pr.delay) { s.state = 'recoil'; T = null; }
    }

    let tip = null;
    if (T) {
      const L0 = Math.hypot(T[0] - R[0], T[1] - R[1], T[2] - R[2]);
      if (s.state === 'grow') {
        const f = 3.8 * P.whip * (0.75 + 0.25 * P.magnet), z = 0.5, r = -0.2;
        const k1 = z / (Math.PI * f), k2 = 1 / ((2 * Math.PI * f) ** 2), k3 = (r * z) / (2 * Math.PI * f);
        const xd = s.uKick ? 1 / dt : 0; s.uKick = false;
        const k2s = Math.max(k2, (dt * dt) / 2 + (dt * k1) / 2, dt * k1);
        s.u += dt * s.ud;
        s.ud += (dt * (1 + k3 * xd - s.u - k1 * s.ud)) / k2s;
        const u = s.u, uc = clamp(u, 0, 1);
        const L2 = Math.hypot(T[0] - R[0], T[1] - R[1]) || 1;
        const nx = -(T[1] - R[1]) / L2, ny = (T[0] - R[0]) / L2;
        const lat = s.side * s.wig * Math.sin(Math.PI * uc) * Math.min(L2 * 0.3, 38);
        tip = [R[0] + (T[0] - R[0]) * u + nx * lat, R[1] + (T[1] - R[1]) * u + ny * lat,
               R[2] + (T[2] - R[2]) * uc + 22 * Math.sin(Math.PI * uc)];
        s.rest = (Math.max(4, L0 * Math.max(u, 0.03)) * 1.05) / (NP - 1);
        if (u > 0.85 && Math.abs(s.ud) < 1.6) s.state = 'attached';
      } else {
        tip = T;
        let Lr = s.rest * (NP - 1);
        if (L0 < Lr * 1.03) Lr += (L0 * 1.03 - Lr) * (1 - Math.exp(-dt * 3.5));
        else Lr += (L0 - Lr) * (1 - Math.exp(-dt * P.creep));
        s.rest = Lr / (NP - 1);
        s.stretch = L0 / Math.max(Lr, 1);
        if (s.kind === 'reach' && !s.pinch && (s.stretch > P.snapStretch * s.snapMul || L0 > P.maxLen * s.lenMul)) s.pinch = 1e-4;
      }
    } else if (s.state === 'recoil') {
      s.retract += dt;
      const Ln = Math.max(0, s.len * Math.exp(-dt * 9) - (s.pin === 'cursor' ? 160 : 110) * dt);
      truncate(s, Ln);
      s.rest = Ln / (NP - 1);
    }

    if (s.pinch > 0) {
      s.pinch += dt / 0.1;
      if (s.pinch >= 1) { split(s, g); return; }
    }

    const pos = s.pos, prev = s.prev;
    const damp = s.state === 'recoil' ? 0.94 : 0.975;
    const lastO = (NP - 1) * 3;
    const ex = pos[lastO] - R[0], ey = pos[lastO + 1] - R[1], el = Math.hypot(ex, ey) || 1;
    const px = -ey / el, py = ex / el;
    const slack = clamp(1.35 - s.stretch, 0.15, 1);
    const amp = (reduced || s.state === 'recoil' ? 0 : 700) * P.slither * slack * (s.state === 'grow' ? 0.4 : 1);
    const gdt = P.gravity * dt * dt;
    const mag = (s.kind === 'reach' || s.kind === 'micro') && s.state !== 'recoil' && cur.present ? P.magnet * 900 * dt * dt : 0;
    for (let i = 1; i < NP; i++) {
      const o = i * 3, sp = i / (NP - 1);
      const vx = (pos[o] - prev[o]) * damp, vy = (pos[o + 1] - prev[o + 1]) * damp, vz = (pos[o + 2] - prev[o + 2]) * damp;
      prev[o] = pos[o]; prev[o + 1] = pos[o + 1]; prev[o + 2] = pos[o + 2];
      const env = Math.sin(Math.PI * sp);
      const wave = Math.sin(sp * 8.5 - time * 7.5 + s.phase) * env * amp * dt * dt;
      pos[o] += vx + px * wave;
      pos[o + 1] += vy + py * wave;
      pos[o + 2] += vz - gdt + Math.cos(sp * 6 - time * 5 + s.phase) * env * amp * 0.25 * dt * dt;
      if (mag) {
        const mx = cur.x - pos[o], my = cur.y - pos[o + 1], ml = Math.hypot(mx, my) || 1;
        pos[o] += (mx / ml) * mag * env; pos[o + 1] += (my / ml) * mag * env;
      }
    }

    const rest = Math.max(s.rest, 0.05);
    for (let it = 0; it < ITER; it++) {
      pos[0] = R[0]; pos[1] = R[1]; pos[2] = R[2];
      if (tip) { pos[lastO] = tip[0]; pos[lastO + 1] = tip[1]; pos[lastO + 2] = tip[2]; }
      for (let i = 0; i < NP - 1; i++) {
        const a = i * 3, b = a + 3;
        let dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1], dz = pos[b + 2] - pos[a + 2];
        const d = Math.hypot(dx, dy, dz) || 1e-6;
        const wa = i === 0 ? 0 : 1, wb = i + 1 === NP - 1 && tip ? 0 : 1, ws = wa + wb;
        if (!ws) continue;
        const diff = ((d - rest) / d) * 0.95;
        dx *= diff; dy *= diff; dz *= diff;
        if (wa) { const f = wa / ws; pos[a] += dx * f; pos[a + 1] += dy * f; pos[a + 2] += dz * f; }
        if (wb) { const f = wb / ws; pos[b] -= dx * f; pos[b + 1] -= dy * f; pos[b + 2] -= dz * f; }
      }
      for (let i = 0; i < NP - 2; i++) {
        const a = i * 3, b = a + 6;
        let dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1], dz = pos[b + 2] - pos[a + 2];
        const d = Math.hypot(dx, dy, dz) || 1e-6, min = rest * 1.55;
        if (d >= min) continue;
        const wa = i === 0 ? 0 : 1, wb = i + 2 === NP - 1 && tip ? 0 : 1, ws = wa + wb;
        if (!ws) continue;
        const diff = ((d - min) / d) * 0.25;
        dx *= diff; dy *= diff; dz *= diff;
        if (wa) { const f = wa / ws; pos[a] += dx * f; pos[a + 1] += dy * f; pos[a + 2] += dz * f; }
        if (wb) { const f = wb / ws; pos[b] -= dx * f; pos[b + 1] -= dy * f; pos[b + 2] -= dz * f; }
      }
    }
    for (let i = 1; i < NP; i++) {
      const o = i * 3, rmin = s.rad[i] * 0.7;
      if (pos[o + 2] < rmin) {
        pos[o + 2] = rmin;
        prev[o] += (pos[o] - prev[o]) * 0.3;
        prev[o + 1] += (pos[o + 1] - prev[o + 1]) * 0.3;
      }
    }

    let L = 0;
    for (let i = 0; i < NP - 1; i++) {
      const a = i * 3, b = a + 3;
      L += Math.hypot(pos[b] - pos[a], pos[b + 1] - pos[a + 1], pos[b + 2] - pos[a + 2]);
    }
    s.len = L;
    const rMean = clamp(Math.sqrt(s.vol / (Math.PI * Math.max(L, 2))), 0.55, s.state === 'recoil' ? 5 : 7.5) * P.thickness;
    const held = s.state === 'attached';
    const neck = held ? clamp((s.stretch - 1.15) / 1.2, 0, 0.7) : 0;
    const nk = neck * (1 - s.pinch) + s.pinch * 0.96;
    const bead = held ? clamp((s.stretch - 1.5) / 0.8, 0, 1) : 0;
    const beadFreq = L / (9 * Math.max(rMean, 0.6));
    const capGrow = s.state === 'recoil' ? Math.min(0.8, s.retract * 3) : 0;
    for (let i = 0; i < NP; i++) {
      const sp = i / (NP - 1);
      let r = rMean * (s.pin === 'cursor' ? 0.6 : 1 + 0.55 * Math.exp(-sp / 0.08));
      if (s.kind === 'reach' || s.kind === 'micro' || s.kind === 'probe') r *= 1 - 0.62 * ease(0.5, 1, sp);
      else r *= 1 + (0.5 + capGrow) * Math.exp(-(1 - sp) / 0.07);
      r *= 1 - nk * Math.exp(-(((sp - s.neckS) / 0.16) ** 2));
      r *= 1 + bead * 0.3 * Math.sin(sp * Math.PI * 2 * beadFreq + s.phase);
      s.rad[i] = Math.max(r, 0.35);
    }

    let moundT = 0, elongT = 0;
    if (s.pin === 'anchor') {
      if (s.state === 'grow') { moundT = 7; elongT = 0.9; }
      else if (s.state === 'attached') { moundT = 6 + 6 * clamp(s.stretch - 1, 0, 1.4); elongT = 1.0 + 1.6 * clamp(s.stretch - 0.8, 0, 1.4); }
      if (s.kind === 'micro') { moundT *= 0.35; elongT *= 0.6; }
      if (s.kind === 'probe') { moundT *= 0.12; elongT *= 0.4; }
    }
    s.mound += (moundT * 0.55 * P.pull - s.mound) * (1 - Math.exp(-dt * (moundT > s.mound ? 10 : 5)));
    s.elong += (elongT - s.elong) * (1 - Math.exp(-dt * 8));
    const dxm = pos[9] - pos[0], dym = pos[10] - pos[1], dm = Math.hypot(dxm, dym);
    if (dm > 1) { s.dirX = dxm / dm; s.dirY = dym / dm; }

    if (s.state === 'recoil' && (s.rest * (NP - 1) < 12 || L < 5)) {
      s.dead = true;
      if (s.pin === 'anchor' && s.kind !== 'micro') addRipple(R[0], R[1], 0.5);
    }
  }

  function step(dt) {
    if (!reduced) time += dt;
    spring(btn, 'intro', 'introV', 1, 9, 0.85, dt);
    spring(btn, 'press', 'pressV', btn.pressTarget, 30, 0.75, dt);
    labelAmt += (labelTarget - labelAmt) * (1 - Math.exp(-dt * (time > 0.6 ? 4 : 0)));
    const g = geo();

    const present = cur.present && btn.intro > 0.6;
    const e = pillEdge(cur.x, cur.y, g);
    const inside = present && e.d < -4;
    awareNow = present && !inside ? ease(P.awareness, 18, e.d) : 0;

    spring(btn, 'lift', 'liftV', inside ? 1 : 0, 11, 0.95, dt);
    CURZ = g.top + btn.lift * LIFT_H + PEAK_Z;

    if (!reduced) {
      const active = strands.filter((s) => s.kind === 'reach' && (s.state === 'grow' || s.state === 'attached')).length;
      if (!present) releaseAll(false);
      else if (inside) releaseAll(true);
      else {
        const want = e.d < P.reach ? Math.min(P.maxStrands, Math.round(Math.min(2, P.maxStrands) + Math.max(0, P.maxStrands - 2) * ease(P.reach, P.reach * 0.4, e.d))) : 0;
        if (active < want && time - lastSpawn > rand(0.03, 0.06) && time - lastSnap > 0.15) { spawnReach(g); lastSpawn = time; }
        const micro = strands.filter((s) => s.kind === 'micro' && s.state !== 'recoil').length;
        if (micro < Math.round(9 * ease(0.1, 0.8, awareNow)) && time - lastMicro > rand(0.03, 0.07)) { spawnMicro(g); lastMicro = time; }
      }
      if (!inside && awareNow < 0.02 && time > nextProbe && btn.intro > 0.95) {
        if (strands.every((s) => s.kind === 'probe' || s.state === 'recoil')) spawnProbe(g);
        nextProbe = time + rand(1.8, 2.3);
      }
    }

    for (let i = 0; i < strands.length; i++) stepStrand(strands[i], dt, g);
    for (let i = strands.length - 1; i >= 0; i--) if (strands[i].dead) strands.splice(i, 1);

    for (const r of ripples) r.age += dt;
    while (ripples.length && ripples[0].age > 1.6) ripples.shift();
  }

  // ───────────── render ─────────────
  const ptsBuf = new Float32Array(MAXS * NP * 4), boxBuf = new Float32Array(MAXS * 4), ancBuf = new Float32Array(MAXS * 4);
  const ancDBuf = new Float32Array(MAXS * 4), brBuf = new Float32Array(MAXBR * 12), ripBuf = new Float32Array(MAXR * 4);
  const K1 = 6;

  function render() {
    const g = geo();
    let zTop = g.top + btn.dome + btn.lift * LIFT_H + 4;
    let maxMound = 0;

    const ns = Math.min(strands.length, MAXS);
    for (let i = 0; i < ns; i++) {
      const s = strands[i];
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, rMax = 0;
      for (let j = 0; j < NP; j++) {
        const o = (i * NP + j) * 4, x = s.pos[j * 3], y = s.pos[j * 3 + 1], z = s.pos[j * 3 + 2], r = s.rad[j];
        ptsBuf[o] = x; ptsBuf[o + 1] = y; ptsBuf[o + 2] = z; ptsBuf[o + 3] = r;
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        rMax = Math.max(rMax, r); zTop = Math.max(zTop, z + r + K1 * 0.3);
      }
      const pad = rMax + K1 + 3;
      boxBuf.set([x0 - pad, y0 - pad, x1 + pad, y1 + pad], i * 4);
      const ax = s.pin === 'anchor' ? g.cx + s.lx * g.hw : 0, ay = s.pin === 'anchor' ? g.cy + s.ly * g.hh : 0;
      const m = s.pin === 'anchor' ? s.mound : 0;
      maxMound = Math.max(maxMound, m);
      ancBuf.set([ax, ay, m, 17], i * 4);
      ancDBuf.set([s.dirX, s.dirY, s.elong, 0], i * 4);
    }
    zTop += maxMound;

    const held = strands.filter((s) => s.kind === 'reach' && s.state === 'attached').sort((a, b) => a.lat - b.lat);
    let nbr = 0;
    for (let i = 0; i + 1 < held.length && nbr < MAXBR; i++) {
      const A = held[i], B = held[i + 1];
      const grow = clamp((Math.min(A.life, B.life) - 0.3) * 4, 0, 1);
      const taut = clamp(2.3 - Math.max(A.stretch, B.stretch), 0.25, 1);
      for (const sp of [0.22, 0.42, 0.62]) {
        if (nbr >= MAXBR) break;
        const j = Math.round(sp * (NP - 1)) * 3;
        const ax = A.pos[j], ay = A.pos[j + 1], az = A.pos[j + 2], bx = B.pos[j], by = B.pos[j + 1], bz = B.pos[j + 2];
        const dist = Math.hypot(bx - ax, by - ay);
        const r = 0.22 * P.thickness * clamp(1.6 - dist / 70, 0, 1) * grow * taut;
        if (r < 0.2) continue;
        const rx = (A.pos[0] + B.pos[0]) / 2, ry = (A.pos[1] + B.pos[1]) / 2;
        let mx = (ax + bx) / 2, my = (ay + by) / 2;
        const dl = Math.hypot(rx - mx, ry - my) || 1, sag = dist * 0.22;
        mx += ((rx - mx) / dl) * sag; my += ((ry - my) / dl) * sag;
        brBuf.set([ax, ay, az, r, mx, my, (az + bz) / 2 - dist * 0.05, r * 0.75, bx, by, bz, r], nbr * 12);
        nbr++;
      }
    }

    ripBuf.fill(0);
    ripples.forEach((r, i) => ripBuf.set([r.x, r.y, r.age, r.amp], i * 4));

    const lb = [g.cx, g.cy + 1, btn.lbw, btn.lbh];
    const t2 = reduced ? 3 : time;

    // pass 1: ray-march the goo into the G-buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, W, H);
    gl.useProgram(p1.prog);
    gl.bindVertexArray(vao);
    const u1 = p1.u;
    gl.uniform2f(u1.uRes, W, H);
    gl.uniform1f(u1.uDpr, DPR);
    gl.uniform4f(u1.uBtn, g.cx, g.cy, g.hw, g.hh);
    gl.uniform4f(u1.uBtnZ, g.top, btn.sink * Math.min(1, btn.intro), btn.dome * Math.min(1, btn.intro), 0);
    gl.uniform4f(u1.uBtnZ2, btn.lift * LIFT_H, BEVEL, 0, 0);
    gl.uniform1i(u1.uNS, ns);
    gl.uniform4fv(u1.uPts, ptsBuf);
    gl.uniform4fv(u1.uBox, boxBuf);
    gl.uniform4fv(u1.uAnc, ancBuf);
    gl.uniform4fv(u1.uAncD, ancDBuf);
    gl.uniform1i(u1.uNBr, nbr);
    gl.uniform4fv(u1.uBr, brBuf);
    gl.uniform4fv(u1.uRip, ripBuf);
    gl.uniform1f(u1.uZTop, zTop);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, gTex);
    gl.generateMipmap(gl.TEXTURE_2D);

    // pass 2: studio shading, label, glow
    gl.bindFramebuffer(gl.FRAMEBUFFER, cFbo);
    gl.viewport(0, 0, W, H);
    gl.useProgram(p2.prog);
    const u2 = p2.u;
    gl.uniform1i(u2.uG, 0);
    gl.uniform1i(u2.uLabel, 1);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, labelTex);
    gl.uniform2f(u2.uRes, W, H);
    gl.uniform1f(u2.uDpr, DPR);
    gl.uniform1f(u2.uTime, t2);
    gl.uniform4f(u2.uLabelBox, lb[0], lb[1], lb[2], lb[3]);
    gl.uniform2f(u2.uLabelTx, 2.5 / LABEL_W, 2.5 / LABEL_H);
    gl.uniform1f(u2.uLabelAmt, labelAmt);
    gl.uniform1f(u2.uLabelLod, Math.max(0, Math.log2(LABEL_W / (2 * lb[2] * DPR)) - 0.6));
    gl.uniform1f(u2.uZMax, zTop);
    gl.uniform1f(u2.uLift, btn.lift);
    gl.uniform4f(u2.uBtnP, g.cx, g.cy, g.hw, g.hh);
    const inkHalf = (labelInkW * LABEL_CSS) / LABEL_PX / 2;
    gl.uniform2f(u2.uWin, -(inkHalf + 16) / g.hw, 15 / g.hw);
    const gc = GLOW[variant] || GLOW.primary;
    gl.uniform4f(u2.uGlow, gc[0], gc[1], gc[2], gc[3] * (1 + 0.6 * btn.lift));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // pass 3: FXAA to the (transparent) screen canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.useProgram(p3.prog);
    gl.uniform1i(p3.u.uC, 4);
    gl.uniform2f(p3.u.uRes, W, H);
    gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, cTex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // ───────────── input ─────────────
  function insidePill(x, y) { return pillEdge(x, y, geo()).d < 0; }
  const toLocal = () => {
    const r = canvas.getBoundingClientRect();
    cur.x = cur.cx - r.left; cur.y = cur.cy - r.top;
  };
  const onMove = (e) => {
    cur.cx = e.clientX; cur.cy = e.clientY;
    cur.mouse = e.pointerType === 'mouse' || e.pointerType === 'pen';
    cur.present = cur.mouse || cur.down;
  };
  const onLeave = () => { cur.present = false; };
  const onDown = (e) => { cur.down = true; cur.cx = e.clientX; cur.cy = e.clientY; cur.present = true; };
  const onUp = (e) => {
    cur.down = false;
    if (e.pointerType === 'touch') cur.present = false;
    if (btn.pressTarget) press(false, cur.x, cur.y);
  };
  function press(on, x, y) {
    btn.pressTarget = on ? 1 : 0;
    if (!on) {
      addRipple(x, y, 1.6);
      for (const s of strands) if (s.state === 'attached') s.rest *= 0.82;
    }
  }
  const onHitDown = (e) => { cur.cx = e.clientX; cur.cy = e.clientY; toLocal(); if (insidePill(cur.x, cur.y)) press(true); };
  const onKeyDown = (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) press(true); };
  const onKeyUp = (e) => { if (e.key === 'Enter' || e.key === ' ') press(false, btn.cx, btn.cy); };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('blur', onLeave);
  document.documentElement.addEventListener('pointerleave', onLeave);
  hit.addEventListener('pointerdown', onHitDown);
  hit.addEventListener('keydown', onKeyDown);
  hit.addEventListener('keyup', onKeyUp);

  let visible = true;
  const io = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; }, { rootMargin: '120px' });
  io.observe(hit);

  const onLost = (e) => { e.preventDefault(); destroy(); opts.onFail?.(); };
  canvas.addEventListener('webglcontextlost', onLost);

  // ───────────── loop ─────────────
  let last = performance.now(), acc = 0, raf = 0, frameEma = 1 / 60, slowFor = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    let dt = (now - last) / 1000; last = now;
    if (dt > 0.1) dt = 0.1;
    frameEma += (dt - frameEma) * 0.05;
    toLocal();
    acc += dt;
    let n = 0;
    while (acc >= SUB && n < 40) { step(SUB); acc -= SUB; n++; }
    if (n === 40) acc = 0;
    render();
    // adaptive resolution if the GPU struggles
    if (frameEma > 1 / 40 && dt < 0.09) slowFor += dt; else slowFor = 0;
    if (slowFor > 2 && quality > 0.7) { quality -= 0.1; slowFor = 0; resizeGL(); }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('blur', onLeave);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    hit.removeEventListener('pointerdown', onHitDown);
    hit.removeEventListener('keydown', onKeyDown);
    hit.removeEventListener('keyup', onKeyUp);
    canvas.removeEventListener('webglcontextlost', onLost);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
  }

  layout();
  raf = requestAnimationFrame(frame);

  return {
    setLabel,
    setVariant(v) { variant = v; },
    destroy,
  };
}
