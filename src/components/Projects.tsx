import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import type { Project } from '../data/portfolioData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
  onSelectProject: (p: Project) => void;
}

const CONFIG = {
  FOV: 42,
  CAM_Z: 9,
  CARD_W: 3.4,
  SPACING: 0.13,
  RAIL_SPAN: 1.7,
  FLY_SPAN: 0.35,
  HOLD: 0.12,
  RAIL: [
    [0, 3, -60],
    [-10, 2, -34],
    [-12, 0.5, -14],
    [-7, -0.4, -1],
    [0, -0.8, 3.2],
    [7, -0.4, -1],
    [12, 0.6, -12],
    [9, 1.6, -26],
    [2, 2.2, -34],
  ] as [number, number, number][],
  RAIL_MOBILE: [
    [0, 3, -50],
    [-4, 1.5, -26],
    [-3.5, 0, -8],
    [0, -0.6, 2.5],
    [3.5, 0, -8],
    [4, 1.5, -24],
    [1, 2.4, -32],
  ] as [number, number, number][],
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function getTotalSpan(count: number) {
  return CONFIG.RAIL_SPAN + CONFIG.FLY_SPAN + (count - 1) * CONFIG.SPACING + CONFIG.HOLD;
}

function getCardProgress(scrollNorm: number, index: number, total: number) {
  const r = clamp01(scrollNorm) * getTotalSpan(total) - index * CONFIG.SPACING;
  return {
    rail: clamp01(r / CONFIG.RAIL_SPAN),
    fly: clamp01((r - CONFIG.RAIL_SPAN) / CONFIG.FLY_SPAN),
    opacity: r <= 0 ? 0 : Math.min(1, r / 0.12),
  };
}

function computeGridCells(count: number, width: number, height: number, fov: number, camZ: number) {
  const vFovRad = (fov / 2) * (Math.PI / 180);
  const viewH = 2 * camZ * Math.tan(vFovRad);
  const aspect = width / height;
  const viewW = viewH * aspect;
  const cols = aspect < 0.8 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  // Reserve only as much room as the heading really needs (about 250px from the top), so the cards can grow.
  const topFrac = Math.min(0.42, Math.max(0.27, 250 / Math.max(height, 1)));
  const topReserved = viewH * topFrac;
  const availH = viewH - topReserved - viewH * 0.02;
  const gap = Math.min(viewW, viewH) * 0.016;
  const cardAspect = 16 / 9;
  let cellW = Math.min((viewW * 0.97 - gap * (cols - 1)) / cols, ((availH - gap * (rows - 1)) / rows) * cardAspect);
  cellW = Math.max(cellW, 0.5);
  const cellH = cellW / cardAspect;
  const totalGridW = cols * cellW + (cols - 1) * gap;
  const totalGridH = rows * cellH + (rows - 1) * gap;
  const startY = viewH / 2 - topReserved - (availH - totalGridH) / 2;

  const cells = Array.from({ length: count }, (_, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    const itemsInThisRow = Math.min(cols, count - r * cols);
    const rowW = itemsInThisRow * cellW + (itemsInThisRow - 1) * gap;
    return {
      x: -rowW / 2 + cellW / 2 + c * (cellW + gap),
      y: startY - cellH / 2 - r * (cellH + gap),
      side: itemsInThisRow > 1 && c === 0 ? -1 : itemsInThisRow > 1 && c === itemsInThisRow - 1 ? 1 : 0,
      vert: r === 0 ? 1 : r === rows - 1 ? -1 : 0,
    };
  });

  return { cells, cellW, cellH, cols, rows };
}

const ASPECT_16_9 = 16 / 9;

const VERT_SHADER = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const FRAG_SHADER = `
  uniform sampler2D map;
  uniform vec2 uvScale;
  uniform vec2 uvOffset;
  uniform float uOpacity;
  uniform float uHover;
  uniform float uReady;
  varying vec2 vUv;
  float rbox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main() {
    vec2 uv = vUv;
    if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
    vec2 p = (uv - 0.5) * vec2(${ASPECT_16_9.toFixed(4)}, 1.0);
    float d = rbox(p, vec2(${(ASPECT_16_9 / 2).toFixed(4)}, 0.5), 0.07);
    float mask = 1.0 - smoothstep(-0.003, 0.003, d);
    if (mask < 0.01) discard;
    vec3 tex = texture2D(map, uv * uvScale + uvOffset).rgb;
    vec3 col = mix(vec3(0.05, 0.035, 0.045), tex, uReady);
    col *= 0.82 + 0.28 * uHover;
    // soft glass reflections
    col += vec3(1.0) * 0.07 * smoothstep(0.55, 1.0, uv.y) * (1.0 - uv.x * 0.6);
    col += vec3(1.0, 0.12, 0.2) * 0.18 * uHover * smoothstep(0.45, 0.0, uv.y);
    // liquid glass rim
    float rim = smoothstep(-0.022, -0.004, d);
    vec3 rimCol = mix(vec3(0.75, 0.75, 0.8), vec3(1.0, 0.3, 0.38), uHover);
    col = mix(col, rimCol, rim * (0.35 + 0.35 * uHover));
    gl_FragColor = vec4(col, mask * uOpacity);
  }
`;

function getThumbnails(p: Project): string[] {
  if (!p.poster) return [];
  const m = p.poster.match(/^(.*)-1\.(jpg|jpeg|png|webp)$/i);
  return m ? [1, 2, 3].map((n) => `${m[1]}-${n}.${m[2]}`) : [p.poster];
}

function shouldPlayVideo(inView: boolean, farPast: boolean, active: boolean, isSectionVisible: boolean) {
  return isSectionVisible && (active ? !farPast : inView);
}

function ProjectVideoFallback({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const v = videoRef.current;
    if (!el || !v || !project.videoUrl) return;

    let inView = false;
    let failed = false;
    const tryPlay = () => {
      if (!inView || failed || document.hidden) return;
      v.preload = 'auto';
      v.muted = true;
      v.play().catch(() => { });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) tryPlay();
        else v.pause();
      },
      { rootMargin: '250px' }
    );
    io.observe(el);

    const onVis = () => {
      if (document.hidden) v.pause();
      else tryPlay();
    };
    const onErr = () => {
      failed = true;
      setReady(false);
    };

    v.addEventListener('error', onErr);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('pointerdown', tryPlay);

    return () => {
      io.disconnect();
      v.pause();
      v.removeEventListener('error', onErr);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('pointerdown', tryPlay);
    };
  }, [project.videoUrl]);

  return (
    <div ref={ref} className="project-video-fallback" data-video-ready={ready}>
      <img src={project.poster} alt="" loading="lazy" />
      {project.videoUrl && (
        <video
          ref={videoRef}
          src={encodeURI(project.videoUrl)}
          poster={project.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setReady(true)}
          aria-label={project.title}
        />
      )}
    </div>
  );
}

function useScrollReveal(containerRef: React.RefObject<HTMLElement | null>, selector: string) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => { };

    const setup = () => {
      cleanup();
      if (media.matches) return;
      const targets = Array.from(el.querySelectorAll(selector)) as HTMLElement[];
      const prev = targets.map((t) => t.dataset.revealVisible);
      const ctx = gsap.context(() => {
        gsap.set(targets, { opacity: 0, y: 20, filter: 'blur(12px)' });
      }, el);

      let io: IntersectionObserver | null = null;
      ctx.add(() => {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const target = entry.target as HTMLElement;
              const isVis = entry.isIntersecting;
              if (target.dataset.revealVisible !== String(isVis)) {
                target.dataset.revealVisible = String(isVis);
                gsap.to(target, {
                  opacity: +isVis,
                  y: isVis ? 0 : 20,
                  filter: isVis ? 'blur(0px)' : 'blur(12px)',
                  duration: isVis ? 0.8 : 0.65,
                  delay: isVis ? Math.min((targets.indexOf(target) % 5) * 0.055, 0.22) : 0,
                  ease: 'power3.out',
                  overwrite: 'auto',
                });
              }
            });
          },
          { threshold: 0, rootMargin: '-4% 0px -4% 0px' }
        );
        targets.forEach((t) => io?.observe(t));
      });

      cleanup = () => {
        io?.disconnect();
        gsap.killTweensOf(targets);
        ctx.revert();
        targets.forEach((t, idx) => {
          if (prev[idx] === undefined) delete t.dataset.revealVisible;
          else t.dataset.revealVisible = prev[idx];
        });
      };
    };

    setup();
    media.addEventListener('change', setup);
    return () => {
      cleanup();
      media.removeEventListener('change', setup);
    };
  }, [containerRef, selector]);
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelectProject);
  onSelectRef.current = onSelectProject;

  const [fallbackMode, setFallbackMode] = useState(false);

  useScrollReveal(containerRef, '[data-project-heading] > *, [data-project-fallback]');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFallbackMode(true);
      return;
    }
    const container = containerRef.current;
    const canvasWrap = canvasWrapRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !canvasWrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setFallbackMode(true);
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setClearColor(0, 0);
    canvasWrap.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CONFIG.FOV, 1, 0.1, 200);
    camera.position.set(0, 0, CONFIG.CAM_Z);

    const railPoints = (isMobile ? CONFIG.RAIL_MOBILE : CONFIG.RAIL).map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const spline = new THREE.CatmullRomCurve3(railPoints, false, 'centripetal');

    const samplePts: THREE.Vector3[] = [];
    const sampleTangs: THREE.Vector3[] = [];
    for (let i = 0; i <= 400; i++) {
      samplePts.push(spline.getPointAt(i / 400));
      sampleTangs.push(spline.getTangentAt(i / 400));
    }

    const sampleSpline = (tNorm: number, outPos: THREE.Vector3, outTang: THREE.Vector3) => {
      const scaled = Math.max(0, Math.min(1, tNorm)) * 400;
      const idx = Math.min(Math.floor(scaled), 399);
      const frac = scaled - idx;
      outPos.lerpVectors(samplePts[idx], samplePts[idx + 1], frac);
      outTang.lerpVectors(sampleTangs[idx], sampleTangs[idx + 1], frac).normalize();
    };

    const cardGeom = new THREE.PlaneGeometry(ASPECT_16_9, 1, 24, 14);
    const texLoader = new THREE.TextureLoader();
    const fallbackTex = new THREE.DataTexture(new Uint8Array([10, 8, 10, 255]), 1, 1);
    fallbackTex.needsUpdate = true;

    const fitUv = (mat: THREE.ShaderMaterial, w: number, h: number) => {
      const r = w / h;
      if (r > ASPECT_16_9) {
        const s = ASPECT_16_9 / r;
        mat.uniforms.uvScale.value.set(s, 1);
        mat.uniforms.uvOffset.value.set((1 - s) / 2, 0);
      } else {
        const s = r / ASPECT_16_9;
        mat.uniforms.uvScale.value.set(1, s);
        mat.uniforms.uvOffset.value.set(0, (1 - s) / 2);
      }
    };

    const cards = PORTFOLIO_PROJECTS.map((proj, idx) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT_SHADER,
        fragmentShader: FRAG_SHADER,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: {
          map: { value: fallbackTex },
          uvScale: { value: new THREE.Vector2(1, 1) },
          uvOffset: { value: new THREE.Vector2(0, 0) },
          uOpacity: { value: 0 },
          uHover: { value: 0 },
          uReady: { value: 0 },
        },
      });

      const mesh = new THREE.Mesh(cardGeom, mat);
      mesh.userData.index = idx;
      scene.add(mesh);

      const state = {
        project: proj,
        mesh,
        mat,
        thumbs: [] as THREE.Texture[],
        thumbIdx: 0,
        video: null as HTMLVideoElement | null,
        videoTex: null as THREE.VideoTexture | null,
        playing: false,
        hover: 0,
        failed: false,
        pending: false,
        retryAt: 0,
        farTime: 0,
        wanted: false,
        cleanupVideo: () => { },
      };

      getThumbnails(proj).forEach((url, tIdx) => {
        texLoader.load(url, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          state.thumbs[tIdx] = tex;
          if (!state.videoTex && tIdx === 0) {
            mat.uniforms.map.value = tex;
            fitUv(mat, tex.image.width, tex.image.height);
            mat.uniforms.uReady.value = 1;
          }
        });
      });

      if (proj.videoUrl) {
        const video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = false;
        video.preload = 'metadata';
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.src = encodeURI(proj.videoUrl);

        const onData = () => {
          if (state.failed || state.videoTex) return;
          const vt = new THREE.VideoTexture(video);
          vt.minFilter = THREE.LinearFilter;
          vt.generateMipmaps = false;
          state.videoTex = vt;
          fitUv(mat, video.videoWidth || 16, video.videoHeight || 9);
        };

        const onPlay = () => {
          if (!state.videoTex) onData();
          if (state.videoTex) {
            mat.uniforms.map.value = state.videoTex;
            mat.uniforms.uReady.value = 1;
          }
          state.playing = true;
        };

        const onError = () => {
          state.failed = true;
          state.playing = false;
          state.pending = false;
          if (state.thumbs[0]) {
            mat.uniforms.map.value = state.thumbs[0];
            fitUv(mat, state.thumbs[0].image.width, state.thumbs[0].image.height);
          }
        };

        video.addEventListener('loadeddata', onData);
        video.addEventListener('playing', onPlay);
        video.addEventListener('error', onError);

        state.cleanupVideo = () => {
          video.removeEventListener('loadeddata', onData);
          video.removeEventListener('playing', onPlay);
          video.removeEventListener('error', onError);
        };
        state.video = video;
      }

      return state;
    });

    let viewW = 1;
    let viewH = 1;
    let gridInfo: ReturnType<typeof computeGridCells> | null = null;

    const onResize = () => {
      viewW = canvasWrap.clientWidth;
      viewH = canvasWrap.clientHeight;
      renderer.setSize(viewW, viewH, false);
      camera.aspect = viewW / viewH;
      camera.updateProjectionMatrix();
      gridInfo = computeGridCells(cards.length, viewW, viewH, CONFIG.FOV, CONFIG.CAM_Z);
    };

    onResize();
    window.addEventListener('resize', onResize);

    let scrollTarget = 0;
    let scrollCurrent = 0;
    let isSectionIntersecting = false;
    // Declared before any handler that references it (was declared later in the original).
    let frustumCheckTimer = 0;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      scrollTarget = scrollRange > 0 ? Math.max(0, Math.min(1, -rect.top / scrollRange)) : 0;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const stopAllVideos = () => {
      cards.forEach((c) => {
        c.wanted = false;
        c.video?.pause();
        c.playing = false;
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isSectionIntersecting = entry.isIntersecting;
        if (!isSectionIntersecting) stopAllVideos();
      },
      { rootMargin: '250px' }
    );
    io.observe(canvasWrap);

    const playVideo = (c: (typeof cards)[0], now: number) => {
      if (!c.video || c.failed || c.pending || c.playing || !c.wanted || now < c.retryAt || document.hidden) return;
      c.pending = true;
      c.video.muted = true;
      c.video.preload = 'auto';
      c.video
        .play()
        .then(() => {
          c.pending = false;
          if (!c.wanted || document.hidden) {
            c.video?.pause();
            c.playing = false;
          } else {
            c.playing = true;
          }
        })
        .catch(() => {
          c.pending = false;
          c.playing = false;
          c.retryAt = performance.now() + 3000;
        });
    };

    const wakeVideos = () => {
      cards.forEach((c) => {
        c.retryAt = 0;
        playVideo(c, performance.now());
      });
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopAllVideos();
      else frustumCheckTimer = 0;
    };

    document.addEventListener('pointerdown', wakeVideos);
    document.addEventListener('visibilitychange', onVisibilityChange);

    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2(9, 9);
    let hoverIndex = -1;
    let ptrX = 0;
    let ptrY = 0;
    let downX = 0;
    let downY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvasWrap.getBoundingClientRect();
      ptrX = e.clientX - rect.left;
      ptrY = e.clientY - rect.top;
      mouseNdc.set((ptrX / rect.width) * 2 - 1, -(ptrY / rect.height) * 2 + 1);
    };

    const onPointerLeave = () => {
      mouseNdc.set(9, 9);
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
      onPointerMove(e);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 8) return;
      onPointerMove(e);
      checkRaycast();
      if (hoverIndex >= 0) {
        onSelectRef.current(cards[hoverIndex].project);
      }
    };

    const checkRaycast = () => {
      raycaster.setFromCamera(mouseNdc, camera);
      const hits = raycaster.intersectObjects(
        cards.filter((c) => c.mat.uniforms.uOpacity.value > 0.3).map((c) => c.mesh)
      );
      hoverIndex = hits.length ? hits[0].object.userData.index : -1;
    };

    canvasWrap.addEventListener('pointermove', onPointerMove);
    canvasWrap.addEventListener('pointerleave', onPointerLeave);
    canvasWrap.addEventListener('pointerdown', onPointerDown);
    canvasWrap.addEventListener('pointerup', onPointerUp);

    const ptPos = new THREE.Vector3();
    const ptTang = new THREE.Vector3();
    const flatTang = new THREE.Vector3();
    const normVec = new THREE.Vector3();
    const upVec = new THREE.Vector3(0, 1, 0);
    const rotMat = new THREE.Matrix4();
    const baseQuat = new THREE.Quaternion();
    const identityQuat = new THREE.Quaternion();
    const bankQuat = new THREE.Quaternion();
    const gridPos = new THREE.Vector3();
    const ctrlPos = new THREE.Vector3();
    const railEndPos = new THREE.Vector3();
    const tempVec = new THREE.Vector3();
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    const reusableSphere = new THREE.Sphere(); // reused to avoid per-card allocations

    let lastTime = performance.now();
    let animId = 0;
    let cycleTime = 0;

    const renderLoop = (timeNow: number) => {
      animId = requestAnimationFrame(renderLoop);
      const dt = Math.min((timeNow - lastTime) / 1000, 0.05);
      lastTime = timeNow;

      if (!isSectionIntersecting || document.hidden) return;

      scrollCurrent += (scrollTarget - scrollCurrent) * (1 - Math.exp(-7 * dt));
      if (Math.abs(scrollTarget - scrollCurrent) < 1e-5) scrollCurrent = scrollTarget;
      cycleTime += dt;

      if (!gridInfo) return;

      cards.forEach((c, idx) => {
        const prog = getCardProgress(scrollCurrent, idx, cards.length);
        sampleSpline(prog.rail, ptPos, ptTang);

        flatTang.set(ptTang.x, 0, ptTang.z);
        if (flatTang.lengthSq() < 1e-4) flatTang.set(1, 0, 0);
        flatTang.normalize();
        normVec.crossVectors(flatTang, upVec).normalize();
        if (normVec.z < 0) normVec.negate();

        rotMat.makeBasis(tempVec.crossVectors(upVec, normVec).normalize(), upVec, normVec);
        baseQuat.setFromRotationMatrix(rotMat);

        const cardScale = CONFIG.CARD_W / ASPECT_16_9;
        const cell = gridInfo!.cells[idx];

        if (prog.fly <= 0) {
          c.mesh.position.copy(ptPos);
          c.mesh.quaternion.copy(baseQuat);
          c.mesh.scale.setScalar(cardScale);
        } else {
          sampleSpline(1, railEndPos, ptTang);
          gridPos.set(cell.x, cell.y, 0);
          ctrlPos.set(cell.x + cell.side * gridInfo!.cellW * 0.9, cell.y + cell.vert * gridInfo!.cellH * 1.6, 1.2);

          const tEased = easeInOutCubic(prog.fly);
          const invT = 1 - tEased;

          c.mesh.position.set(
            invT * invT * railEndPos.x + 2 * invT * tEased * ctrlPos.x + tEased * tEased * gridPos.x,
            invT * invT * railEndPos.y + 2 * invT * tEased * ctrlPos.y + tEased * tEased * gridPos.y,
            invT * invT * railEndPos.z + 2 * invT * tEased * ctrlPos.z + tEased * tEased * gridPos.z
          );

          identityQuat.identity();
          c.mesh.quaternion.copy(baseQuat).slerp(identityQuat, tEased);
          bankQuat.setFromAxisAngle(tempVec.set(0, 0, 1), Math.sin(Math.PI * tEased) * 0.18 * (cell.side || cell.vert || 1));
          c.mesh.quaternion.multiply(bankQuat);
          c.mesh.scale.setScalar(THREE.MathUtils.lerp(cardScale, gridInfo!.cellH, tEased));
        }

        c.mesh.renderOrder = Math.round(c.mesh.position.z * 100);
        c.hover += ((idx === hoverIndex ? 1 : 0) - c.hover) * (1 - Math.exp(-10 * dt));
        c.mat.uniforms.uHover.value = c.hover;
        c.mesh.scale.multiplyScalar(1 + c.hover * 0.05);
        c.mat.uniforms.uOpacity.value = prog.opacity;
        c.mesh.visible = prog.opacity > 0.001;

        if (!c.videoTex && c.thumbs.length > 1) {
          const tIdx = Math.floor((cycleTime + idx * 0.7) / 2.4) % 3;
          if (tIdx !== c.thumbIdx && c.thumbs[tIdx]) {
            c.thumbIdx = tIdx;
            c.mat.uniforms.map.value = c.thumbs[tIdx];
          }
        }
      });

      scene.updateMatrixWorld(true);
      checkRaycast();
      canvasWrap.style.cursor = hoverIndex >= 0 ? 'pointer' : '';

      if (tooltip) {
        if (hoverIndex >= 0) {
          const hoveredProj = cards[hoverIndex].project;
          if (tooltip.dataset.id !== hoveredProj.id) {
            tooltip.dataset.id = hoveredProj.id;
            (tooltip.querySelector('[data-t]') as HTMLElement).textContent = hoveredProj.title;
            (tooltip.querySelector('[data-s]') as HTMLElement).textContent = hoveredProj.subtitle;
            (tooltip.querySelector('[data-c]') as HTMLElement).textContent = hoveredProj.category;
          }
          tooltip.style.opacity = '1';
          const maxLeft = viewW - tooltip.offsetWidth - 8;
          const maxTop = viewH - tooltip.offsetHeight - 8;
          tooltip.style.transform = `translate(${Math.max(8, Math.min(ptrX + 18, maxLeft))}px, ${Math.max(8, Math.min(ptrY + 18, maxTop))}px)`;
        } else {
          tooltip.style.opacity = '0';
        }
      }

      frustumCheckTimer -= dt;
      if (frustumCheckTimer <= 0) {
        frustumCheckTimer = 0.25;
        projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(projScreenMatrix);

        cards.forEach((c) => {
          if (!c.video || c.failed) return;
          const cardRadius = Math.hypot(ASPECT_16_9, 1) * c.mesh.scale.x * 0.5;
          reusableSphere.center.copy(c.mesh.position);
          reusableSphere.radius = cardRadius * 1.4;
          const inFrustum = c.mat.uniforms.uOpacity.value > 0.01 && frustum.intersectsSphere(reusableSphere);
          reusableSphere.radius = cardRadius * 2;
          const tooFar = !frustum.intersectsSphere(reusableSphere) || c.mat.uniforms.uOpacity.value < 0.001;
          c.farTime = tooFar ? c.farTime + 0.25 : 0;
          c.wanted = shouldPlayVideo(inFrustum, c.farTime > 1, c.playing || c.pending, isSectionIntersecting);
          if (c.wanted) {
            playVideo(c, timeNow);
          } else if (c.playing || c.pending) {
            c.video.pause();
            c.playing = false;
          }
        });
      }

      renderer.render(scene, camera);
      canvasWrap.setAttribute('data-scene-ready', '1');
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', wakeVideos);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvasWrap.removeEventListener('pointermove', onPointerMove);
      canvasWrap.removeEventListener('pointerleave', onPointerLeave);
      canvasWrap.removeEventListener('pointerdown', onPointerDown);
      canvasWrap.removeEventListener('pointerup', onPointerUp);

      cards.forEach((c) => {
        c.mat.dispose();
        c.thumbs.forEach((t) => t?.dispose());
        c.videoTex?.dispose();
        c.cleanupVideo();
        if (c.video) {
          c.video.pause();
          c.video.removeAttribute('src');
          c.video.load();
        }
      });
      cardGeom.dispose();
      fallbackTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const headerContent = (
    <div data-project-heading className="flex flex-col items-center text-center">
      <span className="text-[#a31515] font-bold uppercase text-xs md:text-sm tracking-[0.2em] mb-2">
        Featured Works
      </span>
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase text-white">
        PROJECTS.
      </h2>
      <div className="w-16 md:w-20 h-1.5 bg-[#a31515] mt-3 rounded-full" />
      <p className="text-xs md:text-sm text-gray-400 mt-3 max-w-lg font-medium">
        Scroll to navigate through the 3D showcase • Click any project to explore details, code &amp; live demo
      </p>
    </div>
  );

  return fallbackMode ? (
    <section id="projects" ref={containerRef} className="relative w-full text-gray-100 py-28 px-4 md:px-10 border-t border-white/5">
      {headerContent}
      <div className="max-w-7xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PORTFOLIO_PROJECTS.map((proj) => (
          <button
            key={proj.id}
            data-project-fallback
            onClick={() => onSelectProject(proj)}
            className="glass glass-panel-card h-auto p-0 block whitespace-normal rounded-2xl overflow-hidden text-left group hover:scale-[1.02] transition-transform duration-300"
          >
            <ProjectVideoFallback project={proj} />
            <div className="p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-red-400 font-bold">
                {proj.category}
              </span>
              <h3 className="text-xl font-black text-white mt-1">{proj.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{proj.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  ) : (
    <section id="projects" ref={containerRef} className="relative w-full text-gray-100 border-t border-white/5" style={{ height: '420vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-x-0 top-16 md:top-20 z-20 px-4 pointer-events-none">
          {headerContent}
        </div>
        <div ref={canvasWrapRef} className="absolute inset-0 z-10" data-no-ripple aria-label="Featured projects" role="region" />
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute left-0 top-0 z-30 glass rounded-2xl px-4 py-3 transition-opacity duration-200 max-w-[18rem] border border-red-500/40 shadow-2xl shadow-red-950/50"
          style={{ opacity: 0 }}
        >
          <span data-c className="block text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold" />
          <span data-t className="block text-base font-black text-white leading-tight mt-0.5" />
          <span data-s className="block text-xs text-gray-400 mt-0.5" />
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-red-400">
            <span>Click to explore</span>
            <span>&rarr;</span>
          </div>
        </div>
      </div>
    </section>
  );
};
