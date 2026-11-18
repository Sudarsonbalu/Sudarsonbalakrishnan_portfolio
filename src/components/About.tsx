import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SITE, ABOUT } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const Fb = 26;
const Ib = 70;
const Lb = 0.38;
const Rb = 9e-4;

const clamp = (val: number, max: number) => Math.max(-max, Math.min(max, val));

export const HangingPhoto: React.FC = () => {
  const rigRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rig = rigRef.current;
    const swing = swingRef.current;
    if (!rig || !swing) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    let angle = 0;
    let angularVel = 0;
    let roll = 0;
    let targetAngle = 0;
    let isDragging = false;
    let activePointerId = -1;
    let prevPointerX = 0;
    let lastTime = performance.now();
    let isIntersecting = true;
    let animId = 0;

    const getPivot = () => {
      const rect = rig.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + 8 };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max((now - lastTime) / 1000, 0.008);
      const vx = (e.clientX - prevPointerX) / dt;
      prevPointerX = e.clientX;
      lastTime = now;

      if (isDragging && e.pointerId === activePointerId) {
        const pivot = getPivot();
        targetAngle = clamp(Math.atan2(-(e.clientX - pivot.x), Math.max(e.clientY - pivot.y, 60)), Lb);
        return;
      }

      if (prefersReducedMotion || isCoarse || !isIntersecting) return;
      const rect = rig.getBoundingClientRect();
      const dist =
        Math.abs(e.clientX - (rect.left + rect.width / 2)) +
        Math.max(0, Math.abs(e.clientY - (rect.top + rect.height / 2)) - rect.height / 2);
      const influence = Math.max(0, 1 - dist / 900);
      angularVel += clamp(-vx * Rb * influence, 0.25);
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      activePointerId = e.pointerId;
      swing.setPointerCapture?.(e.pointerId);
      swing.style.cursor = 'grabbing';
      prevPointerX = e.clientX;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId === activePointerId) {
        isDragging = false;
        activePointerId = -1;
        targetAngle = 0;
        swing.style.cursor = '';
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { rootMargin: '200px' }
    );
    observer.observe(rig);

    let prevFrameTime = performance.now();
    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      const dt = Math.min((now - prevFrameTime) / 1000, 0.05);
      prevFrameTime = now;
      if (!isIntersecting && !isDragging) return;

      const stiffness = isDragging ? Ib : Fb;
      const target = isDragging ? targetAngle : 0;
      angularVel += -stiffness * (angle - target) * dt;
      angularVel *= Math.exp(-3.2 * dt);
      angle += angularVel * dt;
      if (Math.abs(angle) > Lb) {
        angle = Math.sign(angle) * Lb;
        angularVel *= -0.3;
      }
      roll += (angularVel * 0.6 - roll) * (1 - Math.exp(-6 * dt));
      const deg = (angle * 180) / Math.PI;
      swing.style.transform = `rotateZ(${deg}deg) rotateY(${clamp(roll, 0.4) * 30}deg)`;
      if (shadowRef.current) {
        shadowRef.current.style.transform = `translateX(${-deg * 2.2}px) rotateZ(${deg * 0.8}deg)`;
      }
    };

    animId = requestAnimationFrame(tick);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    swing.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      swing.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  return (
    <div ref={rigRef} className="hang-rig" data-no-ripple={true}>
      <span className="hang-nail" aria-hidden="true" />
      <div ref={shadowRef} className="hang-shadow" aria-hidden="true" />
      <div ref={swingRef} className="hang-swing">
        <svg className="hang-strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="50" y1="0" x2="12" y2="100" />
          <line x1="50" y1="0" x2="88" y2="100" />
        </svg>
        <div className="hang-frame glow-frame">
          <span className="hang-ring hang-ring-l" aria-hidden="true" />
          <span className="hang-ring hang-ring-r" aria-hidden="true" />
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 ring-1 ring-white/15">
            <img
              src={ABOUT.portrait}
              alt={ABOUT.portraitAlt}
              draggable={false}
              className="w-full h-full object-cover object-top transition-all duration-700 select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="hang-glare" aria-hidden="true" />
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <span className="text-white text-base md:text-xl font-black uppercase tracking-wider block">
                {SITE.name}
              </span>
              <span className="text-red-400 text-xs md:text-sm uppercase font-bold tracking-widest">
                {ABOUT.portraitCaption}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const STACK = ABOUT.technologies;

const FOCUS = ABOUT.focus;

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(headRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo(bioRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .fromTo(
          photoCardRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
          '-=0.6'
        )
        .fromTo(
          stackRef.current?.children || [],
          { scale: 0.7, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(1.5)' },
          '-=0.6'
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full text-gray-100 py-24 overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em]">
              {ABOUT.eyebrow}
            </span>
            <h2
              ref={headRef}
              className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight uppercase text-white"
            >
              ABOUT ME.
            </h2>
            <div className="w-24 h-1.5 bg-[#a31515] rounded-full mt-2" />
          </div>

          <div className="relative">
            <div className="red-halo" aria-hidden="true" />
            <div className="glass glass-panel-card relative rounded-3xl p-5 md:p-12 flex flex-col gap-5 md:gap-8">
              <div ref={bioRef} className="flex flex-col gap-4 md:gap-5">
                {ABOUT.paragraphs.map((text, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'text-gray-200 text-base md:text-2xl leading-relaxed font-medium'
                        : 'text-gray-400 text-base md:text-xl leading-relaxed'
                    }
                  >
                    {text}
                  </p>
                ))}
              </div>

              <div>
                <h3 className="text-xs md:text-base font-bold uppercase tracking-wider text-gray-500 mb-3 md:mb-4">
                  Technologies
                </h3>
                <div ref={stackRef} className="flex flex-wrap gap-2 md:gap-3">
                  {STACK.map((tool) => (
                    <span
                      key={tool}
                      className="tech-pill glass-chip px-3.5 py-1.5 text-xs md:px-5 md:py-2.5 md:text-lg font-bold text-gray-200 rounded-full cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs md:text-base font-bold uppercase tracking-wider text-gray-500 mb-3 md:mb-4">
                  Areas of Focus
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {FOCUS.map((f) => (
                    <span
                      key={f}
                      className="px-3.5 py-1.5 text-xs md:px-4 md:py-2 md:text-base font-semibold text-red-300 rounded-full ring-1 ring-red-500/30 bg-[#a31515]/10"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education from resume */}
              {ABOUT.education && (
                <div>
                  <h3 className="text-xs md:text-base font-bold uppercase tracking-wider text-gray-500 mb-3 md:mb-4">
                    Education
                  </h3>
                  <div className="flex flex-col gap-3">
                    {ABOUT.education.map((edu) => (
                      <div
                        key={edu.institution}
                        className="glass-chip p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div>
                          <h4 className="text-sm md:text-base font-bold text-gray-100">{edu.degree}</h4>
                          <p className="text-xs md:text-sm text-gray-400 font-medium">{edu.institution}</p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className="text-[11px] md:text-xs font-mono font-bold uppercase text-red-400 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/20">
                            {edu.score}
                          </span>
                          <span className="text-[11px] md:text-xs font-mono text-gray-400">
                            {edu.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs md:text-base font-bold uppercase tracking-wider text-gray-500 mb-3 md:mb-4">
                  Experience &amp; Internships
                </h3>
                <div className="flex flex-col gap-3">
                  {ABOUT.experience.map((exp) => (
                    <div
                      key={exp.role}
                      className="glass-chip p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <h4 className="text-sm md:text-base font-bold text-gray-100">{exp.role}</h4>
                        <p className="text-xs md:text-sm text-gray-400 font-medium">
                          <span className="text-gray-300 font-semibold">{exp.company}</span> — {exp.description}
                        </p>
                      </div>
                      <span className="text-[11px] md:text-xs font-mono font-bold uppercase text-red-400 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/20 self-start sm:self-auto shrink-0">
                        {exp.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {ABOUT.certificates && (
                <div>
                  <h3 className="text-xs md:text-base font-bold uppercase tracking-wider text-gray-500 mb-3 md:mb-4">
                    Certifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ABOUT.certificates.map((cert) => (
                      <div
                        key={cert.name + cert.provider}
                        className="glass-chip px-4 py-2.5 rounded-2xl flex items-center justify-between"
                      >
                        <span className="text-xs md:text-sm font-bold text-gray-200">{cert.name}</span>
                        <span className="text-[11px] text-red-400 font-semibold">{cert.provider}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right column: suspended profile card with physics swing */}
        <div className="lg:col-span-5 flex justify-center relative lg:sticky lg:top-28">
          <div ref={photoCardRef} data-photo-reveal={true} className="flex flex-col items-center pointer-events-auto">
            <HangingPhoto />
          </div>
        </div>
      </div>
    </section>
  );
};
