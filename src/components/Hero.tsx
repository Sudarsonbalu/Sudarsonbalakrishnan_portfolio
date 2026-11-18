import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { VenomButton } from './VenomButton';
import { HERO } from '../data/portfolioData';
import {
  BREATHING_VERTICES,
  SHARD_POLYGONS,
  type Spring,
  clampOffset,
  hasWebGL,
  insetPolygon,
  plateLayout,
  roundedShape,
  stepSpring,
  type Pt,
} from './heroShards';

/** Portrait that is "seen through" the glass (also the CSS fallback image). */
const IMG_HERO_RED = HERO.image;

/** Horizontal position (0..1) of the subject inside the 16:9 hero image (right corner). */
const SUBJECT_X = 0.82;

/* ───────────────────────── Reveal-on-scroll for the hero copy ───────────────────────── */
function useRevealOnScroll(rootRef: React.RefObject<HTMLElement>, selector: string) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let teardown = () => {};

    const setup = () => {
      teardown();
      if (mq.matches) return;
      const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
      const initial = els.map((el) => el.dataset.revealVisible);
      let io: IntersectionObserver | undefined;
      const ctx = gsap.context(() => {
        gsap.set(els, { opacity: 0, y: 20, filter: 'blur(12px)' });
      }, root);
      ctx.add(() => {
        io = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              const el = entry.target as HTMLElement;
              const visible = entry.isIntersecting;
              if (el.dataset.revealVisible === String(visible)) return;
              el.dataset.revealVisible = String(visible);
              gsap.to(el, {
                opacity: visible ? 1 : 0,
                y: visible ? 0 : 20,
                filter: visible ? 'blur(0px)' : 'blur(12px)',
                duration: visible ? 0.8 : 0.65,
                delay: visible ? Math.min((els.indexOf(el) % 5) * 0.055, 0.22) : 0,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            }),
          { threshold: 0 }
        );
        els.forEach((el) => io?.observe(el));
      });
      teardown = () => {
        io?.disconnect();
        gsap.killTweensOf(els);
        ctx.revert();
        els.forEach((el, i) => {
          if (initial[i] === undefined) delete el.dataset.revealVisible;
          else el.dataset.revealVisible = initial[i];
        });
      };
    };

    setup();
    mq.addEventListener('change', setup);
    return () => {
      teardown();
      mq.removeEventListener('change', setup);
    };
  }, [rootRef, selector]);
}

/* ───────────────────────── Per-shard runtime state ───────────────────────── */
interface ShardState {
  mesh: THREE.Mesh;
  edge: THREE.LineSegments;
  mat: THREE.MeshPhysicalMaterial;
  center: THREE.Vector2;
  dir: THREE.Vector3; // direction the shard flies when the page scrolls
  spin: THREE.Vector3; // tumble when scrolled away
  lift: number; // hover lift 0..1
  phase: number; // idle bobbing phase
  x: Spring;
  y: Spring;
  targetX: number;
  targetY: number;
}

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null); // <section>
  const stageRef = useRef<HTMLDivElement>(null); // WebGL mount
  const copyRef = useRef<HTMLDivElement>(null); // headline + CTAs
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [mobile, setMobile] = useState(false);

  useRevealOnScroll(
    sectionRef as React.RefObject<HTMLElement>,
    '[data-hero-copy] > span, [data-hero-copy] > h1, [data-hero-copy] > div, [data-hero-copy] > p'
  );

  useEffect(() => setWebgl(hasWebGL()), []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* ───────────────────────── Three.js scene ───────────────────────── */
  useEffect(() => {
    if (!webgl) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    const css = getComputedStyle(document.documentElement);
    const reflectionColor = new THREE.Color(css.getPropertyValue('--glass-reflection').trim() || '#8b1118');
    const highlightColor = new THREE.Color(css.getPropertyValue('--glass-highlight').trim() || '#d94a52');

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    stage.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';

    /* scene, environment, camera */
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    roomEnv.dispose();
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.22;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    /** Everything glass lives in this group (tilts toward the cursor). */
    const plate = new THREE.Group();
    scene.add(plate);

    /* lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.08));
    const key = new THREE.DirectionalLight(0xffeee8, 0.7);
    key.position.set(-4, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(highlightColor, 0.45);
    rim.position.set(5, -3, 2);
    scene.add(rim);
    const cursorLight = new THREE.PointLight(reflectionColor, 0, 6, 1.6);
    cursorLight.position.set(0, 0, 1.5);
    scene.add(cursorLight);

    /* portrait texture is used as the glass' emissive colour = "image inside glass" */
    let textureReady = false;
    const portrait = new THREE.TextureLoader().load(IMG_HERO_RED, () => (textureReady = true));
    portrait.colorSpace = THREE.SRGBColorSpace;
    portrait.anisotropy = 8;

    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x14141b,
      roughness: 0.36,
      metalness: 0,
      specularIntensity: 0.35,
      specularColor: highlightColor,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      iridescence: 0.55,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [100, 400],
      emissive: 0xffffff,
      emissiveMap: portrait,
      emissiveIntensity: 0.92,
      envMapIntensity: 0.28,
    });

    /* tint the iridescent fresnel red so the rainbow film reads as crimson */
    const tintIridescence = (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.redReflection = { value: reflectionColor };
      shader.fragmentShader = 'uniform vec3 redReflection;\n' + shader.fragmentShader;
      const chunk = THREE.ShaderChunk.lights_fragment_begin.replace(
        'material.iridescenceFresnel = mix(',
        `iridescenceFresnelDielectric = redReflection * dot(iridescenceFresnelDielectric, vec3(0.333333));
         iridescenceFresnelMetallic = redReflection * dot(iridescenceFresnelMetallic, vec3(0.333333));
         material.iridescenceFresnel = mix(`
      );
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', chunk);
    };

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: reflectionColor,
      transparent: true,
      opacity: 0.2,
    });

    /* ── build / rebuild the shards ── */
    let shards: ShardState[] = [];
    let plateW = 1; // world-unit size of the plate
    let plateH = 1;
    let isMobile = false;

    const buildShards = () => {
      const previous = shards;
      shards.forEach((s) => {
        plate.remove(s.mesh);
        s.mesh.geometry.dispose();
        s.edge.geometry.dispose();
        s.mat.dispose();
      });
      shards = [];

      const t = reduceMotion ? 0 : performance.now() / 1000;
      const minSide = Math.min(plateW, plateH);

      SHARD_POLYGONS.forEach((poly, idx) => {
        // wobble the shared crack vertices a touch so the glass feels alive
        const world: Pt[] = poly.map((p) => {
          let [px, py] = p;
          const b = BREATHING_VERTICES.indexOf(p);
          if (b >= 0) {
            px += Math.sin(t * 0.5 + b * 2.1) * 0.006;
            py += Math.cos(t * 0.4 + b * 1.3) * 0.006;
          }
          if (isMobile) [px, py] = [py, px]; // portrait plate on phones
          return [(px - 0.5) * plateW, (0.5 - py) * plateH];
        });

        const shape = roundedShape(insetPolygon(world, minSide * 0.012), minSide * 0.035);
        const depth = minSide * 0.045;
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelThickness: depth * 0.35,
          bevelSize: depth * 0.3,
          bevelSegments: 3,
          curveSegments: 8,
        });
        geo.translate(0, 0, -depth);

        /* map the portrait across the whole plate (cover-fit at 16:9) */
        const pos = geo.attributes.position;
        const uv = geo.attributes.uv;
        const imgAspect = 16 / 9;
        const plateAspect = plateW / plateH;
        let sx = 1;
        let sy = 1;
        if (plateAspect > imgAspect) sy = imgAspect / plateAspect;
        else sx = plateAspect / imgAspect;
        // slide the visible window so the subject stays positioned toward the right corner when the plate is narrower than 16:9
        const shift = sx < 1 ? Math.min(0.9, Math.max(0, (SUBJECT_X - 0.5) / (1 - sx))) : 0;
        // Shift image slightly down (0.75 instead of 0.5) so hair and head have generous headroom
        const vShift = (1 - sy) * 0.75;
        for (let i = 0; i < pos.count; i++) {
          const u = (pos.getX(i) / plateW + 0.5) * sx + (1 - sx) * 0.5 + shift * (1 - sx) * 0.5;
          const v = (pos.getY(i) / plateH + 0.5) * sy + vShift;
          uv.setXY(i, Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, v)));
        }
        uv.needsUpdate = true;

        const mat = baseMaterial.clone();
        mat.onBeforeCompile = tintIridescence;
        mat.customProgramCacheKey = () => 'muted-red-iridescence';

        const mesh = new THREE.Mesh(geo, mat);
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), edgeMaterial);
        mesh.add(edge);

        const centroid = world.reduce<Pt>(
          (acc, p) => [acc[0] + p[0] / world.length, acc[1] + p[1] / world.length],
          [0, 0]
        );
        const center = new THREE.Vector2(centroid[0], centroid[1]);
        const dir = new THREE.Vector3(centroid[0] / plateW, centroid[1] / plateH, 0.4 + (idx % 3) * 0.25).normalize();
        const spin = new THREE.Vector3(
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 0.8
        );

        mesh.userData.idx = idx;
        plate.add(mesh);
        shards.push({
          mesh,
          edge,
          mat,
          center,
          dir,
          spin: previous[idx]?.spin ?? spin, // keep tumble stable across rebuilds
          lift: previous[idx]?.lift ?? 0,
          phase: idx * 1.37,
          x: previous[idx]?.x ?? { position: 0, velocity: 0 },
          y: previous[idx]?.y ?? { position: 0, velocity: 0 },
          targetX: previous[idx]?.targetX ?? 0,
          targetY: previous[idx]?.targetY ?? 0,
        });
      });
    };

    /* ── sizing: plate matches the CSS layout box 1:1 ── */
    let layout = plateLayout(1, 1);
    const resize = () => {
      const w = section.clientWidth;
      const h = section.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      layout = plateLayout(w, h);

      const worldPerPx = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / h;
      plateW = layout.width * worldPerPx;
      plateH = layout.height * worldPerPx;
      plate.position.set(0, -((layout.top - (h - layout.top - layout.height)) / 2) * worldPerPx, 0);
      isMobile = layout.mobile;
      camera.updateProjectionMatrix();
      buildShards();

      const copy = copyRef.current;
      if (!copy) return;
      if (layout.mobile) {
        const top = layout.top + layout.height + Math.min(h * 0.02, 16);
        Object.assign(copy.style, {
          left: `${layout.left}px`,
          top: `${top}px`,
          width: `${layout.width}px`,
          height: `${Math.max(h - top - h * 0.03, 180)}px`,
        });
      } else {
        Object.assign(copy.style, {
          left: `${layout.left}px`,
          top: `${layout.top}px`,
          width: `${layout.width}px`,
          height: `${layout.height}px`,
        });
      }
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);

    /* ── pointer: hover tilt, hover lift, shard dragging ── */
    const ndc = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const dragPlane = new THREE.Plane();
    const grabLocal = new THREE.Vector3();
    const hitPoint = new THREE.Vector3();
    let dragIndex = -1;
    let dragPointerId: number | null = null;
    let dragZ = 0;
    const dragStart = new THREE.Vector2();
    let hovering = false;

    const shardMeshes = () => shards.map((s) => s.mesh);

    const onPointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      hovering = true;

      if (dragIndex >= 0 && e.pointerId === dragPointerId) {
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
          const local = plate.worldToLocal(hitPoint.clone());
          const s = shards[dragIndex];
          s.targetX = clampOffset(dragStart.x + local.x - grabLocal.x, plateW);
          s.targetY = clampOffset(dragStart.y + local.y - grabLocal.y, plateH);
        }
      }
    };
    const onPointerLeave = () => {
      hovering = false;
    };
    const release = () => {
      if (dragIndex < 0) return;
      const s = shards[dragIndex];
      s.targetX = 0; // spring back home
      s.targetY = 0;
      dragIndex = -1;
      section.classList.remove('shard-dragging');
      stage.style.cursor = '';
      if (dragPointerId !== null && section.hasPointerCapture(dragPointerId)) {
        section.releasePointerCapture(dragPointerId);
      }
      dragPointerId = null;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (dragIndex >= 0) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if ((e.target as HTMLElement).closest('a, button, input, textarea, nav')) return;
      if (section.getBoundingClientRect().top < -section.clientHeight * 0.04) return;

      onPointerMove(e);
      scene.updateMatrixWorld(true);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(shardMeshes(), false)[0];
      if (!hit) return;

      dragIndex = hit.object.userData.idx;
      dragPointerId = e.pointerId;
      const s = shards[dragIndex];
      dragZ = s.mesh.position.z;
      dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), hit.point);
      grabLocal.copy(plate.worldToLocal(hit.point.clone()));
      dragStart.set(s.x.position, s.y.position);
      section.setPointerCapture(e.pointerId);
      section.classList.add('shard-dragging');
      stage.style.cursor = 'grabbing';
      e.preventDefault();
    };

    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerleave', onPointerLeave);
    section.addEventListener('pointerdown', onPointerDown);
    section.addEventListener('pointerup', release);
    section.addEventListener('pointercancel', release);
    section.addEventListener('lostpointercapture', release);
    window.addEventListener('blur', release);

    /* ── render loop ── */
    const tilt = { x: 0, y: 0 };
    let hoverIndex = -1;
    let scrollSmooth = 0;
    let raf = 0;
    let lastTime = performance.now();
    let idleClock = 0;
    let visible = true;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) release();
    });
    io.observe(section);

    const frame = (nowMs: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        lastTime = nowMs;
        return;
      }
      const dt = Math.min((nowMs - lastTime) / 1000, 0.05);
      lastTime = nowMs;
      const time = nowMs / 1000;
      const damp = (k: number) => 1 - Math.exp(-k * dt);

      /* tilt plate toward the cursor (stronger while dragging) */
      const dragging = dragIndex >= 0;
      const wantX = dragging ? tilt.x : hovering && !reduceMotion ? -ndc.y * THREE.MathUtils.degToRad(5.5) : 0;
      const wantY = dragging ? tilt.y : hovering && !reduceMotion ? ndc.x * THREE.MathUtils.degToRad(7) : 0;
      tilt.x += (wantX - tilt.x) * damp(5);
      tilt.y += (wantY - tilt.y) * damp(5);

      /* scroll progress 0..1 → shards fly apart as the hero leaves the viewport */
      const rect = section.getBoundingClientRect();
      const scrollTarget = THREE.MathUtils.clamp(-rect.top / (rect.height * 0.8), 0, 1);
      scrollSmooth += (scrollTarget - scrollSmooth) * damp(8);
      const sp = scrollSmooth * scrollSmooth * (3 - 2 * scrollSmooth); // smoothstep

      plate.rotation.set(tilt.x, tilt.y, 0);
      plate.updateMatrixWorld(true);

      /* hover: find the shard under the cursor and light it */
      hoverIndex = -1;
      if (hovering && !coarse && sp < 0.05) {
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(shardMeshes(), false)[0];
        if (hit) {
          hoverIndex = hit.object.userData.idx;
          cursorLight.position.set(hit.point.x, hit.point.y, hit.point.z + 1.2);
        }
      }
      cursorLight.intensity += ((hoverIndex >= 0 || dragIndex >= 0 ? 1.4 : 0) - cursorLight.intensity) * damp(6);

      /* idle: rebuild geometry periodically so the central crack breathes */
      idleClock += dt;
      const displaced = shards.some((s) => s.x.position !== 0 || s.y.position !== 0);
      if (!reduceMotion && dragIndex < 0 && !displaced && idleClock > 0.25 && sp < 0.02) {
        idleClock = 0;
        buildShards();
      }

      const fly = sp * Math.max(plateW, plateH) * 0.9;
      shards.forEach((s, i) => {
        const moved = dragIndex === i || s.x.position !== 0 || s.y.position !== 0;
        s.lift += ((!moved && hoverIndex === i ? 1 : 0) - s.lift) * damp(7);
        stepSpring(s.x, s.targetX, dt);
        stepSpring(s.y, s.targetY, dt);

        const bob = reduceMotion || moved ? 0 : Math.sin(time * 0.8 + s.phase) * 0.03;
        s.mesh.position.set(
          s.dir.x * fly + s.x.position,
          s.dir.y * fly + s.y.position,
          (dragIndex === i ? dragZ : bob + s.lift * 0.35) + s.dir.z * fly * 0.6
        );
        s.mesh.rotation.set(
          s.spin.x * sp + s.lift * -0.05 * ndc.y + s.y.position * -0.06,
          s.spin.y * sp + s.lift * 0.06 * ndc.x + s.x.position * 0.06,
          s.spin.z * sp + s.x.position * 0.025
        );
        s.mat.iridescence = 0.55;
        s.mat.emissiveIntensity = (textureReady ? 0.92 : 0) * (1 - sp * 0.5) + s.lift * 0.08;
      });

      /* copy follows the plate tilt so text feels attached to the glass */
      const copy = copyRef.current;
      if (copy) {
        copy.style.transform = `perspective(1400px) rotateX(${(-tilt.x * 180) / Math.PI}deg) rotateY(${
          (tilt.y * 180) / Math.PI
        }deg) translate3d(${-sp * 140}px, ${-sp * 60}px, ${sp * 80}px)`;
        copy.style.opacity = String(1 - sp * 1.2);
      }

      renderer.render(scene, camera);
      if (textureReady) stage.dataset.sceneReady = '1';
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onPointerLeave);
      release();
      section.removeEventListener('pointerdown', onPointerDown);
      section.removeEventListener('pointerup', release);
      section.removeEventListener('pointercancel', release);
      section.removeEventListener('lostpointercapture', release);
      window.removeEventListener('blur', release);
      shards.forEach((s) => {
        s.mesh.geometry.dispose();
        s.edge.geometry.dispose();
        s.mat.dispose();
      });
      baseMaterial.dispose();
      edgeMaterial.dispose();
      portrait.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [webgl]);

  /* ───────────────────────── Markup ───────────────────────── */
  const useFallback = webgl === false;

  return (
    <div id="hero" className="w-full flex flex-col overflow-hidden">
      <section
        ref={sectionRef}
        className="relative w-full h-[100svh] min-h-[640px] overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        {/* No-WebGL fallback: flat glass card with the same portrait */}
        {useFallback && (
          <div
            className="absolute rounded-[28px] overflow-hidden border border-white/10 shadow-glass"
            style={
              mobile
                ? { left: 'clamp(16px, 5%, 22px)', right: 'clamp(16px, 5%, 22px)', top: 'max(8.5%, 84px)', height: '50%' }
                : { left: '5.5%', right: '5.5%', top: 'max(8.5%, 96px)', bottom: '8.5%' }
            }
          >
            <img
              src={IMG_HERO_RED}
              alt={HERO.imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: HERO.imagePosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-[#050507]/30 to-transparent" />
          </div>
        )}

        {/* WebGL mount */}
        <div ref={stageRef} className="absolute inset-0 touch-pan-y" aria-hidden="true" />

        {/* Copy layer (positioned over the glass plate by the resize handler) */}
        <div
          ref={copyRef}
          className="absolute flex items-center max-md:items-end will-change-transform pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
          style={
            useFallback
              ? mobile
                ? { left: '4%', right: '4%', top: 'calc(max(8.5%, 84px) + 50% + 12px)', bottom: '3%' }
                : { left: '5.5%', right: '5.5%', top: 'max(8.5%, 96px)', bottom: '8.5%' }
              : { transformOrigin: '50% 50%' }
          }
        >
          <div className="pl-[5%] pr-4 w-full md:max-w-[48%] lg:max-w-[46%] max-md:max-w-full max-md:pl-3 max-md:pr-3 max-md:pb-1 max-md:rounded-3xl max-md:bg-gradient-to-t max-md:from-[#050507]/90 max-md:via-[#050507]/55 max-md:to-transparent max-md:pt-4">
            <div data-hero-copy className="flex flex-col gap-2 sm:gap-2.5">
              <span className="text-[#ff2a3b] font-bold uppercase text-[10px] sm:text-xs md:text-sm tracking-[0.2em] whitespace-normal sm:whitespace-nowrap">
                {HERO.eyebrow}
              </span>
              <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-black tracking-tight leading-[0.9] uppercase whitespace-nowrap drop-shadow-md">
                {HERO.headline}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-white font-extrabold text-xs sm:text-sm md:text-base lg:text-base uppercase tracking-wider mt-0.5">
                <span>{HERO.roles[0]}</span>
                <span className="text-[#ff2a3b] font-bold">/</span>
                <span>{HERO.roles[1]}</span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base font-normal tracking-wide mt-0.5 max-w-md leading-relaxed">
                {HERO.tagline}
              </p>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 mt-3 sm:mt-5">
                <VenomButton href="#projects" variant="primary" ariaLabel={HERO.primaryButton}>
                  {HERO.primaryButton}
                </VenomButton>
                <a
                  href="#contact"
                  className="glass glass-hover shrink-0 inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
                >
                  {HERO.secondaryButton}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
