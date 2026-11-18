import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uTravel;
  uniform float uDepth;
  uniform vec2 uMouse;
  uniform float uSpeed;
  uniform float uPixelRatio;
  uniform float uClock;
  uniform float uAspect;
  uniform vec3 uClick[4];
  varying float vAlpha;
  varying float vSeed;
  varying float vSize;

  void main() {
    vec3 p = position;
    // idle organic drift
    p.x += sin(uTime * (0.12 + aSeed * 0.2) + aSeed * 31.0) * (0.4 + aSeed * 0.6);
    p.y += cos(uTime * (0.10 + aSeed * 0.18) + aSeed * 17.0) * (0.4 + aSeed * 0.6);

    // forward travel, wrapped into [-uDepth, 6]
    float z = p.z + uTravel + uTime * 0.25;
    z = mod(z + uDepth, uDepth + 6.0) - uDepth;
    p.z = z;

    // depth-based cursor parallax (near reacts more)
    float near = clamp((z + uDepth) / (uDepth + 6.0), 0.0, 1.0);
    p.xy += uMouse * near * near * 1.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // click repulsion: push away from click in screen space, ease back
    vec4 clip0 = projectionMatrix * mv;
    vec2 ndc = clip0.xy / clip0.w;
    for (int i = 0; i < 4; i++) {
      float age = uClock - uClick[i].z;
      if (age > 0.0 && age < 4.0) {
        vec2 d = ndc - uClick[i].xy;
        d.x *= uAspect;
        float dist = length(d);
        float reach = 0.15 + age * 0.55; // expanding wave
        float fall = exp(-dist * dist / (reach * reach * 0.35));
        float env = age * exp(-age * 2.2) * 6.0; // fast out, smooth return
        vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0, 1.0);
        dir.x /= uAspect;
        mv.xy += dir * fall * env * 0.22 * -mv.z;
      }
    }

    gl_Position = projectionMatrix * mv;
    float pulse = 0.75 + 0.25 * sin(uTime * (0.6 + aSeed) + aSeed * 50.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 + uSpeed * 0.6) * (60.0 / -mv.z) * (0.8 + near * near * 1.8);

    // fade in from far, fade out right before the camera
    float fadeFar = smoothstep(-uDepth, -uDepth + 14.0, z);
    float fadeNear = 1.0 - smoothstep(2.0, 5.5, z);
    vAlpha = fadeFar * fadeNear * pulse * (0.35 + aSeed * 0.65) * (0.55 + near * 0.75);
    vSeed = aSeed;
    vSize = aSize;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying float vAlpha;
  varying float vSeed;
  varying float vSize;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = exp(-d * d * 60.0);
    float halo = exp(-d * d * 7.0) * (0.35 + vSize * 0.04);
    float a = (core + halo) * vAlpha;
    if (a < 0.003) discard;
    vec3 col = mix(vec3(0.75, 0.03, 0.08), vec3(1.0, 0.32, 0.30), core * (0.4 + vSeed * 0.6));
    gl_FragColor = vec4(col * a, a);
  }
`;

export const ParticleField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    camera.position.set(0, 0, 6);

    const count = isMobile ? 900 : 2200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = Math.pow(Math.random(), 0.7) * 26;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius * 1.4 + (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.9 + (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = -Math.random() * 70;
      sizes[i] = Math.random() < 0.06 ? 7 + Math.random() * 11 : 1.1 + Math.random() * 3.4;
      seeds[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTravel: { value: 0 },
        uDepth: { value: 70 },
        uMouse: { value: new THREE.Vector2() },
        uSpeed: { value: 0 },
        uPixelRatio: { value: dpr },
        uClock: { value: 0 },
        uAspect: { value: 1 },
        uClick: { value: [0, 1, 2, 3].map(() => new THREE.Vector3(0, 0, -99)) },
      },
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      material.uniforms.uAspect.value = w / h;
    };
    onResize();
    window.addEventListener('resize', onResize);

    const mouse = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    let clickIndex = 0;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('a,button,input,textarea,select,label,video,img,nav,[role="button"],[data-no-ripple],.glass,.glass-chip,.glass-red')) return;

      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      material.uniforms.uClick.value[clickIndex++ % 4].set(nx, ny, (performance.now() - startTime) / 1000);

      if (reduced) return;
      const ripple = document.createElement('span');
      ripple.className = 'pf-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let travel = 0;
    let targetTravel = 0;
    let lastScrollY = window.scrollY;
    let speed = 0;
    const startTime = performance.now();
    let lastFrameTime = startTime;
    let animId = 0;

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      targetTravel += scrollDelta * 0.02;
      const prevTravel = travel;
      travel += (targetTravel - travel) * (1 - Math.exp(-6 * dt));

      const instantSpeed = Math.min(Math.abs(travel - prevTravel) / Math.max(dt, 0.001) / 25, 1);
      speed += (instantSpeed - speed) * (1 - Math.exp(-8 * dt));

      const uniforms = material.uniforms;
      uniforms.uTime.value = reduced ? 0 : (now - startTime) / 1000;
      uniforms.uTravel.value = travel;
      uniforms.uSpeed.value = speed;
      uniforms.uClock.value = (now - startTime) / 1000;
      uniforms.uMouse.value.x += (mouse.x - uniforms.uMouse.value.x) * (1 - Math.exp(-3 * dt));
      uniforms.uMouse.value.y += (mouse.y - uniforms.uMouse.value.y) * (1 - Math.exp(-3 * dt));

      renderer.render(scene, camera);
      if (containerRef.current && !containerRef.current.hasAttribute('data-scene-ready')) {
        containerRef.current.setAttribute('data-scene-ready', 'true');
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[#050507]"
    />
  );
};
