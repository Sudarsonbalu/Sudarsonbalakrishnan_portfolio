import React, { useEffect, useRef } from 'react';

const SPARK_POOL = 160;
const BRANCH_POOL = 24;
const TRAIL_MAX = 14;
const COLOR_WHITE = '255,255,255';
const COLOR_RED = '255,32,32';
const COLOR_DEEP = '160,0,18';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hot: boolean;
}

interface Branch {
  pts: number[];
  life: number;
  max: number;
  width: number;
  bright: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

function generateBranch(
  originX: number,
  originY: number,
  angle: number,
  length: number,
  pts: number[]
) {
  pts.length = 0;
  const segments = 4 + Math.floor(Math.random() * 4);
  let curX = originX;
  let curY = originY;
  pts.push(curX, curY);

  for (let i = 1; i <= segments; i++) {
    const a = angle + (Math.random() - 0.5) * 1.1;
    const segLen = length / segments;
    curX += Math.cos(a) * segLen;
    curY += Math.sin(a) * segLen;
    pts.push(curX, curY);
  }
}

export const SparkCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sparks: Spark[] = Array.from({ length: SPARK_POOL }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      max: 1,
      size: 1,
      hot: false,
    }));

    const branches: Branch[] = Array.from({ length: BRANCH_POOL }, () => ({
      pts: [],
      life: 0,
      max: 1,
      width: 1,
      bright: false,
    }));

    const trail: TrailPoint[] = [];
    let sparkIdx = 0;
    let branchIdx = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let prevX = -9999;
    let prevY = -9999;
    let speedNorm = 0;
    let auraPower = 0;
    let animId = 0;
    let active = false;
    let lastTime = performance.now();
    let dpr = 1;

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    onResize();

    const spawnSpark = (x: number, y: number, vx: number, vy: number, speed: number) => {
      const s = sparks[sparkIdx];
      sparkIdx = (sparkIdx + 1) % SPARK_POOL;
      const angle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 2.6;
      const force = 0.05 + Math.random() * 0.25 * (0.5 + speed);
      s.x = x;
      s.y = y;
      s.vx = Math.cos(angle) * force + vx * 0.02;
      s.vy = Math.sin(angle) * force + vy * 0.02;
      s.max = s.life = 250 + Math.random() * 400;
      s.size = 0.6 + Math.random() * 1.6;
      s.hot = Math.random() < 0.15;
    };

    const spawnBranch = (x: number, y: number, speed: number, bright: boolean) => {
      const b = branches[branchIdx];
      branchIdx = (branchIdx + 1) % BRANCH_POOL;
      generateBranch(
        x,
        y,
        Math.random() * Math.PI * 2,
        (10 + Math.random() * 28) * (bright ? 1.8 : 1) * (0.6 + speed * 0.6),
        b.pts
      );
      b.max = b.life = bright ? 160 : 70 + Math.random() * 80;
      b.width = bright ? 1.6 : 0.6 + Math.random() * 0.8;
      b.bright = bright;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (prevX < -999) {
        prevX = mouseX;
        prevY = mouseY;
      }
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      const dist = Math.hypot(dx, dy);

      speedNorm = Math.min(1.5, speedNorm * 0.6 + dist / 40);
      const now = performance.now();
      trail.push({ x: mouseX, y: mouseY, t: now });
      if (trail.length > TRAIL_MAX) trail.shift();

      const count = Math.min(8, Math.floor(dist / 6) + (Math.random() < 0.4 ? 1 : 0));
      for (let i = 0; i < count; i++) {
        const t = Math.random();
        spawnSpark(prevX + dx * t, prevY + dy * t, dx, dy, speedNorm);
      }

      if (Math.random() < 0.15 + speedNorm * 0.4) {
        spawnBranch(mouseX, mouseY, speedNorm, false);
      }
      if (dist > 45 && Math.random() < 0.25) {
        spawnBranch(mouseX, mouseY, speedNorm, true);
      }

      auraPower = Math.min(1, auraPower + dist / 120);
      prevX = mouseX;
      prevY = mouseY;

      if (!active) {
        active = true;
        lastTime = now;
        animId = requestAnimationFrame(loop);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';

      let alive = false;
      auraPower *= Math.pow(0.992, dt);
      if (auraPower > 0.02) {
        alive = true;
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 70);
        grad.addColorStop(0, `rgba(255,0,30,${0.14 * auraPower})`);
        grad.addColorStop(1, 'rgba(255,0,30,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(mouseX - 70, mouseY - 70, 140, 140);
      }

      while (trail.length && now - trail[0].t > 220) {
        trail.shift();
      }

      if (trail.length > 1) {
        alive = true;
        ctx.lineCap = 'round';
        for (let i = 1; i < trail.length; i++) {
          const ratio = 1 - (now - trail[i].t) / 220;
          ctx.strokeStyle = `rgba(${COLOR_DEEP},${ratio * 0.6})`;
          ctx.lineWidth = 3 * ratio;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(${COLOR_RED},${ratio * 0.5})`;
          ctx.lineWidth = 0.8 * ratio;
          ctx.stroke();
        }
      }

      for (const b of branches) {
        if (b.life <= 0) continue;
        b.life -= dt;
        alive = true;
        const ratio = Math.max(0, b.life / b.max) * (Math.random() < 0.25 ? 0.4 : 1);
        ctx.beginPath();
        ctx.moveTo(b.pts[0], b.pts[1]);
        for (let j = 2; j < b.pts.length; j += 2) {
          ctx.lineTo(b.pts[j], b.pts[j + 1]);
        }
        ctx.shadowBlur = b.bright ? 14 : 8;
        ctx.shadowColor = 'rgba(255,0,30,0.35)';
        ctx.strokeStyle = `rgba(${COLOR_RED},${ratio * 0.85})`;
        ctx.lineWidth = b.width * 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(${COLOR_WHITE},${ratio * (b.bright ? 0.8 : 0.45)})`;
        ctx.lineWidth = b.width * 0.5;
        ctx.stroke();
      }

      for (const s of sparks) {
        if (s.life <= 0) continue;
        s.life -= dt;
        alive = true;
        const ratio = Math.max(0, s.life / s.max);
        const oldX = s.x;
        const oldY = s.y;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.985;
        s.vy *= 0.985;
        ctx.strokeStyle = `rgba(${s.hot ? COLOR_WHITE : COLOR_RED},${ratio * 0.9})`;
        ctx.lineWidth = s.size * ratio;
        ctx.beginPath();
        ctx.moveTo(oldX - s.vx * 18, oldY - s.vy * 18);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      speedNorm *= Math.pow(0.95, dt / 16);

      if (alive) {
        animId = requestAnimationFrame(loop);
      } else {
        active = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="spark-cursor" aria-hidden="true" />;
};
