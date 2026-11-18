/**
 * Geometry + layout helpers for the 3D glass-shard hero.
 * All shard coordinates are normalised (0..1) inside the glass "plate".
 * Shared vertices are what make the shards fit together like a cracked pane.
 */
import * as THREE from 'three';

export type Pt = [number, number];

/* ── shared crack vertices ── */
const V_TOP_A: Pt = [0.22, 0];
const V_TOP_B: Pt = [0.515, 0];
const V_TOP_C: Pt = [0.84, 0];
const V_BOT_A: Pt = [0.34, 1];
const V_BOT_B: Pt = [0.865, 1];
const V_MID_A: Pt = [0.385, 0.72];
const V_MID_B: Pt = [0.48, 0.62];
const V_MID_C: Pt = [0.716, 0.49]; // the "centre" of the crack star

/** The five shards that tile the plate. */
export const SHARD_POLYGONS: Pt[][] = [
  [[0, 0], V_TOP_A, V_MID_B, V_MID_A, V_BOT_A, [0, 1]],
  [V_TOP_A, V_TOP_B, V_MID_C, V_MID_B],
  [V_TOP_B, V_TOP_C, V_MID_C],
  [V_TOP_C, [1, 0], [1, 1], V_BOT_B, V_MID_C],
  [V_MID_A, V_MID_B, V_MID_C, V_BOT_B, V_BOT_A],
];

/** Vertices on the central crack that gently "breathe" while idle. */
export const BREATHING_VERTICES: Pt[] = [V_MID_A, V_MID_B, V_MID_C];

/** Spring constants for dragged shards. */
export const SPRING = { stiffness: 85, damping: 14, maxOffsetRatio: 0.12 };

export interface Spring {
  position: number;
  velocity: number;
}

/** Semi-implicit spring integrator, sub-stepped for stability. */
export function stepSpring(s: Spring, target: number, dt: number) {
  let remaining = Math.min(Math.max(dt, 0), 0.05);
  while (remaining > 0) {
    const h = Math.min(remaining, 1 / 120);
    s.velocity += ((target - s.position) * SPRING.stiffness - s.velocity * SPRING.damping) * h;
    s.position += s.velocity * h;
    remaining -= h;
  }
  if (Math.abs(s.position - target) < 1e-4 && Math.abs(s.velocity) < 1e-4) {
    s.position = target;
    s.velocity = 0;
  }
}

/** Limit how far a shard can be dragged from home. */
export const clampOffset = (v: number, size: number) => {
  const m = size * SPRING.maxOffsetRatio;
  return Math.max(-m, Math.min(m, v));
};

/** Where the glass plate sits inside the hero section (CSS px). */
export function plateLayout(w: number, h: number) {
  const mobile = w < 768;
  const left = mobile ? Math.min(Math.max(w * 0.05, 16), 22) : w * 0.055;
  const top = Math.max(h * 0.085, mobile ? 84 : 96);
  const height = mobile ? h * 0.5 : h - top - h * 0.085;
  return { left, top, width: w - left * 2, height, mobile };
}

/** Inset a polygon by `d` so neighbouring shards leave a hairline gap. */
export function insetPolygon(pts: Pt[], d: number): Pt[] {
  const n = pts.length;
  const area = pts.reduce((sum, p, i) => {
    const q = pts[(i + 1) % n];
    return sum + (p[0] * q[1] - q[0] * p[1]);
  }, 0);
  const sign = area > 0 ? 1 : -1;

  // offset every edge inward
  const edges = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    let nx = -(q[1] - p[1]);
    let ny = q[0] - p[0];
    const len = Math.hypot(nx, ny) || 1;
    nx = (nx / len) * sign * d;
    ny = (ny / len) * sign * d;
    return [
      [p[0] + nx, p[1] + ny],
      [q[0] + nx, q[1] + ny],
    ] as [Pt, Pt];
  });

  // intersect consecutive offset edges to get the new corners
  return edges.map((e, i) => {
    const [a, b] = edges[(i - 1 + n) % n];
    const [c] = e;
    const dx1 = b[0] - a[0], dy1 = b[1] - a[1];
    const dx2 = e[1][0] - c[0], dy2 = e[1][1] - c[1];
    const det = dx1 * dy2 - dy1 * dx2;
    if (Math.abs(det) < 1e-9) return c;
    const t = ((c[0] - a[0]) * dy2 - (c[1] - a[1]) * dx2) / det;
    return [a[0] + dx1 * t, a[1] + dy1 * t] as Pt;
  });
}

/** Polygon → THREE.Shape with every corner rounded by `r`. */
export function roundedShape(pts: Pt[], r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const v1: Pt = [prev[0] - p[0], prev[1] - p[1]];
    const v2: Pt = [next[0] - p[0], next[1] - p[1]];
    const l1 = Math.hypot(...v1);
    const l2 = Math.hypot(...v2);
    const rad = Math.min(r, l1 * 0.4, l2 * 0.4);
    const a: Pt = [p[0] + (v1[0] / l1) * rad, p[1] + (v1[1] / l1) * rad];
    const b: Pt = [p[0] + (v2[0] / l2) * rad, p[1] + (v2[1] / l2) * rad];
    if (i === 0) shape.moveTo(a[0], a[1]);
    else shape.lineTo(a[0], a[1]);
    shape.quadraticCurveTo(p[0], p[1], b[0], b[1]);
  }
  shape.closePath();
  return shape;
}

/** WebGL feature check (falls back to a flat CSS card when missing). */
export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
