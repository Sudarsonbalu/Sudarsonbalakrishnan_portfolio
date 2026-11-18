import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_STATS } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Statistics showcase, directly under the hero.
 * Edit the numbers and labels in `CLIENT_STATS` (src/data/portfolioData.ts).
 *
 * - Entrance + count-up: one ScrollTrigger timeline, same trigger/toggle pattern as the other sections.
 * - Pointer light: a damped lerp on gsap.ticker (same physics as the hero reveal) that writes
 *   --mx / --my / --lo onto the panel; the glow itself is pure CSS (.stat-light, .stat-rim).
 */
export const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Scroll entrance + number count-up ── */
  useEffect(() => {
    // Reduced motion: the final numbers are already in the markup, so there is nothing to animate.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.stat-item');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        panelRef.current,
        { y: 48, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
      );

      items.forEach((item, i) => {
        const numEl = item.querySelector<HTMLElement>('.stat-num');
        const figEl = item.querySelector<HTMLElement>('.stat-fig');
        const barEl = item.querySelector<HTMLElement>('.stat-bar');
        const labelEl = item.querySelector<HTMLElement>('.stat-label');
        if (!numEl || !figEl || !barEl || !labelEl) return;

        const target = Number(item.dataset.value);
        const counter = { v: 0 };
        const at = 0.3 + i * 0.18; // staggered left to right
        numEl.textContent = '0';

        tl.fromTo(figEl, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, at)
          .fromTo(
            counter,
            { v: 0 },
            {
              v: target,
              duration: 2.2,
              ease: 'power3.out',
              onUpdate: () => {
                numEl.textContent = String(Math.round(counter.v));
              },
            },
            at
          )
          // the red bar fills in step with the count
          .fromTo(barEl, { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: 'power3.out' }, at)
          .fromTo(labelEl, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, at + 0.25);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Pointer-responsive lighting: damped follow, no overshoot ── */
  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section || !panel) return;
    // Touch screens have no hover; CSS gives them a resting light instead.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: 0, y: 0, o: 0 };
    const current = { x: 0, y: 0, o: 0 };
    let last = performance.now();
    let running = false;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const posFactor = 1 - Math.exp(-(reduce ? 40 : 9) * dt);
      const opFactor = 1 - Math.exp(-(reduce ? 40 : 5.5) * dt);
      current.x += (target.x - current.x) * posFactor;
      current.y += (target.y - current.y) * posFactor;
      current.o += (target.o - current.o) * opFactor;

      panel.style.setProperty('--mx', `${current.x.toFixed(1)}px`);
      panel.style.setProperty('--my', `${current.y.toFixed(1)}px`);
      panel.style.setProperty('--lo', current.o.toFixed(3));

      // Light has fully faded out: stop spending frames on it
      if (target.o === 0 && current.o < 0.003) {
        panel.style.setProperty('--lo', '0');
        stop();
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      gsap.ticker.add(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    // Listening on the whole section (not just the panel) lets the rim light up as the cursor approaches
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = panel.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (target.o === 0) {
        // first entry: bloom out from the cursor instead of sliding in from the last position
        current.x = target.x;
        current.y = target.y;
      }
      target.o = 1;
      start();
    };
    const onLeave = () => {
      target.o = 0;
    };

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);

    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      stop();
    };
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      aria-labelledby="stats-heading"
      className="relative w-full text-gray-100 py-20 md:py-28 px-4 md:px-10 lg:px-16 overflow-hidden border-t border-white/5"
    >
      <h2 id="stats-heading" className="sr-only">
        Client results
      </h2>

      {/* One glass panel, three columns split by hairlines */}
      <div ref={panelRef} className="stat-panel glass glass-panel-card relative z-10 max-w-7xl mx-auto rounded-3xl overflow-hidden">
        <div className="stat-light" aria-hidden="true" />
        <div className="stat-rim" aria-hidden="true" />

        <dl className="relative z-10 m-0 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {CLIENT_STATS.map((stat) => (
            <div key={stat.id} data-value={stat.value} className="stat-item px-6 py-12 md:px-8 md:py-20 lg:px-10">
              {/* label comes first in the DOM (dt before dd); flex-col-reverse puts the figure on top */}
              <div className="stat-cq flex flex-col-reverse gap-6">
                <dt className="stat-label text-sm md:text-base font-semibold uppercase tracking-[0.16em] leading-snug text-gray-300">
                  {stat.label}
                </dt>
                <dd className="m-0">
                  <span className="sr-only">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <div aria-hidden="true" className="stat-fig font-black uppercase text-white">
                    {/* the hidden copy reserves the final width so nothing reflows while counting; live digits sit flush right so the suffix always hugs them */}
                    <span className="relative inline-block">
                      <span className="invisible">{stat.value}</span>
                      <span className="stat-num absolute right-0 top-0">{stat.value}</span>
                    </span>
                    <span className="stat-suffix">{stat.suffix}</span>
                  </div>
                  <div className="stat-bar mt-6 w-12 h-1 bg-[#a31515] rounded-full origin-left" aria-hidden="true" />
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
