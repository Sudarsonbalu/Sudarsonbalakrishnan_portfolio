import React, { useRef, useEffect } from 'react';
import { Download, Eye, FileText, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Resume: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
        .fromTo(titleRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo(
          cardRef.current,
          { y: 35, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const resumePath = '/assets/Sudarson_B_Resume.pdf';

  return (
    <section
      id="resume"
      ref={sectionRef}
      className="relative w-full text-gray-100 py-24 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col items-center justify-center overflow-hidden border-t border-white/5"
    >
      {/* Venom Crimson Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-[520px] h-[520px] rounded-full bg-red-950/20 blur-[130px] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-red-600/10 blur-[90px]" />
      </div>

      {/* Section Master Heading */}
      <div ref={titleRef} className="flex flex-col items-center text-center mb-10 sm:mb-12 z-10 max-w-3xl mx-auto">
        <span className="text-[#a31515] font-bold uppercase text-xs md:text-sm tracking-[0.25em] mb-2.5 flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-500 animate-pulse" />
          Curriculum Vitae
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white mb-4">
          MY <span className="text-[#a31515]">RESUME</span>.
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium max-w-2xl leading-relaxed px-2">
          Explore my professional journey, technical expertise, academic background, projects, internships, and achievements.
        </p>
      </div>

      {/* Venom Glassmorphic Resume Showcase Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-3xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 bg-[#0c0c10]/85 backdrop-blur-2xl border border-red-900/40 shadow-[0_0_50px_rgba(163,21,21,0.18)] transition-all duration-300 hover:border-red-600/60 hover:shadow-[0_0_70px_rgba(220,38,38,0.28)]"
      >
        {/* Subtle Venom corner shards */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-600/70 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-600/70 rounded-br-2xl pointer-events-none" />

        {/* Card Header & Metadata */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-950/70 to-[#16161d] border border-red-600/50 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <FileText className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase">
                  Sudarson Balakrishnan
                </h3>
                <ShieldCheck className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                AI &amp; Data Science Engineer &bull; Full-Stack Developer
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-700/40 text-[11px] font-semibold text-red-300 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            Latest 2026 Edition
          </div>
        </div>

        {/* Supporting description */}
        <div className="py-6 text-center sm:text-left">
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Take a closer look at my experience and the skills I bring to every opportunity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5 text-xs text-gray-400">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Full Project Portfolio</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Academic &amp; Patents</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Internships &amp; Tech Stack</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: DOWNLOAD RESUME & VIEW RESUME */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4 border-t border-white/10">
          {/* Download Button */}
          <a
            href={resumePath}
            download="Sudarson_B_Resume.pdf"
            aria-label="Download Sudarson B Resume PDF"
            className="group relative flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white font-extrabold uppercase text-xs sm:text-sm tracking-[0.14em] transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.45)] hover:shadow-[0_0_40px_rgba(220,38,38,0.85)] hover:scale-[1.02] active:scale-[0.98] border border-red-500/60"
          >
            <Download className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
            <span>DOWNLOAD RESUME</span>
          </a>

          {/* View Button */}
          <a
            href={resumePath}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Sudarson B Resume PDF in new tab"
            className="group relative flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#141419]/90 text-gray-200 font-extrabold uppercase text-xs sm:text-sm tracking-[0.14em] transition-all duration-300 border border-white/15 hover:border-red-500/70 hover:text-white hover:bg-red-950/40 hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Eye className="w-4 h-4 text-red-500 transition-transform duration-300 group-hover:scale-110" />
            <span>VIEW RESUME</span>
          </a>
        </div>
      </div>
    </section>
  );
};
