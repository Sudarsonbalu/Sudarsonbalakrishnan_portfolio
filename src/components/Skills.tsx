import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SoftwareStrip } from './SoftwareStrip';
import { SKILL_CARDS } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline - snappy 0.5s pop
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .fromTo(
          '.matrix-item',
          { y: 25, opacity: 0, x: -10 },
          { y: 0, opacity: 1, x: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(1.4)' },
          '-=0.2'
        );


    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const skillsData = SKILL_CARDS;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full text-gray-100 py-28 px-6 md:px-12 lg:px-20 flex flex-col items-center justify-center overflow-hidden border-t border-white/5"
    >
      {/* Section Title */}
      <div ref={titleRef} className="flex flex-col items-center text-center mb-16 z-10">
        <span className="text-[#a31515] font-bold uppercase text-sm md:text-base tracking-[0.2em] mb-2">
          What I Work With
        </span>
        <h2
          className="text-5xl md:text-7xl font-black tracking-tight uppercase text-white"
        >
          TECHNICAL SKILLS.
        </h2>
        <div className="w-20 h-1.5 bg-[#a31515] mt-3 rounded-full" />
      </div>

      {/* Skills Matrix Cards */}
      <div className="relative w-full max-w-6xl z-10">
        <div className="red-halo" aria-hidden="true" />
        <div className="grid-blur relative grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
        {skillsData.map((skill) => (
          <div
            key={skill.name}
            className="matrix-item glass glass-grid-card group p-6 md:p-8 rounded-3xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 md:gap-5 min-w-0">
              <div className="min-w-0">
                <h3 className="font-bold text-lg md:text-2xl text-gray-100 group-hover:text-[#a31515] transition-colors">
                  {skill.name}
                </h3>
                <span className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {skill.category}
                </span>
              </div>
            </div>
            <span className="glass-chip text-xs md:text-sm font-black uppercase tracking-wider px-4 py-1.5 text-gray-200 shrink-0 group-hover:text-white rounded-full">
              {skill.level}
            </span>
          </div>
        ))}
        </div>
      </div>

      {/* Software & tools capsules */}
      <SoftwareStrip />
    </section>
  );
};
