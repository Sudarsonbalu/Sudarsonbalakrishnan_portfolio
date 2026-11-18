import React, { useRef, useEffect, useState } from 'react';
import { Award, Trophy, Eye, Sparkles } from 'lucide-react';
import { CERTIFICATES_LIST } from '../data/portfolioData';
import type { CertificateItem } from '../data/portfolioData';
import { CertificateModal } from './CertificateModal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handleOpenCert = (cert: CertificateItem) => {
    setSelectedCert(cert);
  };

  const handleCloseCert = () => {
    setSelectedCert(null);
  };

  const handleNavigateCert = (direction: 1 | -1) => {
    if (!selectedCert) return;
    const idx = CERTIFICATES_LIST.findIndex((c) => c.id === selectedCert.id);
    if (idx === -1) return;
    const nextIdx = (idx + direction + CERTIFICATES_LIST.length) % CERTIFICATES_LIST.length;
    setSelectedCert(CERTIFICATES_LIST[nextIdx]);
  };

  const handleOpenCertById = (certId?: string) => {
    if (!certId) return;
    const cert = CERTIFICATES_LIST.find((c) => c.id === certId);
    if (cert) setSelectedCert(cert);
  };

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
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .fromTo(marqueeRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
        .fromTo(
          '.achievement-text-item',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'power3.out' },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Duplicate sequence to create seamless infinite scrolling loop
  const duplicatedCertificates = [...CERTIFICATES_LIST, ...CERTIFICATES_LIST];

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative w-full text-gray-100 py-24 flex flex-col items-center justify-center overflow-hidden border-t border-white/5"
    >
      {/* Section Master Heading */}
      <div ref={titleRef} className="flex flex-col items-center text-center mb-12 px-4 z-10 max-w-2xl mx-auto">
        <span className="text-[#a31515] font-bold uppercase text-xs md:text-sm tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-red-500" />
          Credentials &amp; Recognition
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white">
          ACHIEVEMENTS.
        </h2>
        <div className="w-16 h-1.5 bg-[#a31515] mt-3 rounded-full" />
        <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
          Hover to pause scrolling • Click any certificate to inspect, zoom &amp; view verified details
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. CONTINUOUS HORIZONTAL CERTIFICATE MARQUEE
      ───────────────────────────────────────────────────────────── */}
      <div ref={marqueeRef} className="relative w-full overflow-hidden my-4 py-4 z-10">
        {/* Soft edge gradient masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#07070a] via-[#07070a]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-[#07070a] via-[#07070a]/80 to-transparent z-20" />

        {/* Marquee Track (seamless infinite loop) */}
        <div className="animate-cert-marquee-track flex items-center gap-6 px-4">
          {duplicatedCertificates.map((cert, index) => (
            <div
              key={`${cert.id}-${index}`}
              onClick={() => handleOpenCert(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleOpenCert(cert);
              }}
              aria-label={`Inspect ${cert.title}`}
              className="group/cert relative shrink-0 cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-[#ff334b] bg-[#0d090d] transition-all duration-300 shadow-xl shadow-black/80 hover:shadow-2xl hover:shadow-red-950/60 hover:scale-[1.03] select-none w-72 sm:w-80 md:w-96 aspect-[16/11]"
            >
              {/* Certificate Image Preview */}
              <img
                src={cert.image}
                alt={`${cert.title} certificate preview`}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/cert:scale-105"
              />

              {/* Ambient Red Glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <span className="text-white text-xs sm:text-sm font-black line-clamp-1 leading-snug">
                  {cert.title}
                </span>
                <span className="text-red-400 text-[11px] font-semibold mt-0.5 line-clamp-1">
                  {cert.issuer}
                </span>
                <span className="mt-2 text-[10px] uppercase font-bold text-gray-200 flex items-center gap-1.5 tracking-wider">
                  <Eye className="w-3.5 h-3.5 text-red-400" />
                  <span>Click to Inspect &amp; Zoom</span>
                </span>
              </div>

              {/* Category Chip */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="glass-chip-red rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md border border-red-500/40">
                  {cert.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ACHIEVEMENTS & AWARDS (ANIMATED TEXT SECTION)
      ───────────────────────────────────────────────────────────── */}
      <div ref={achievementsRef} className="w-full max-w-4xl mx-auto mt-20 px-6 sm:px-8 z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-red-500" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-400">
              Major Achievements &amp; Honors
            </h3>
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            Certified Recognition
          </span>
        </div>

        {/* Text-based Animated Section */}
        <div className="flex flex-col divide-y divide-white/10">
          {/* Achievement 01: Sparkathon 2024 */}
          <div className="achievement-text-item py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="flex items-start sm:items-center gap-4">
              <span className="text-sm md:text-base font-mono font-bold text-red-500/80 shrink-0">
                01
              </span>
              <div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-[#ff334b] transition-colors leading-snug">
                  Sparkathon 2024 <span className="text-red-400 font-semibold">— Second Place</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">
                  Technical Innovation Hackathon, Department of AI &amp; Data Science, V.S.B. College of Engineering Technical Campus.
                </p>
              </div>
            </div>
            <span className="glass-chip-red shrink-0 self-start sm:self-auto text-xs font-bold px-3.5 py-1 rounded-full text-white">
              Second Place
            </span>
          </div>

          {/* Achievement 02: NCRPAIDST-2K25 */}
          <div className="achievement-text-item py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="flex items-start sm:items-center gap-4">
              <span className="text-sm md:text-base font-mono font-bold text-red-500/80 shrink-0">
                02
              </span>
              <div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-[#ff334b] transition-colors leading-snug">
                  NCRPAIDST-2K25 <span className="text-red-400 font-semibold">— Second Prize, Cybersecurity Research Paper</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">
                  Presented research paper titled "AI in Cybersecurity" at the National Conference, Er. Perumal Manimekalai College of Engineering (ISBN: 978-81-972697-4-5).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCertById('cert-ncrpaidst-secondprize')}
              className="glass-chip shrink-0 self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full text-red-300 hover:text-white hover:border-red-500/60 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-red-400" />
              <span>View Certificate</span>
            </button>
          </div>

          {/* Achievement 03: Smart Dustbin System */}
          <div className="achievement-text-item py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="flex items-start sm:items-center gap-4">
              <span className="text-sm md:text-base font-mono font-bold text-red-500/80 shrink-0">
                03
              </span>
              <div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-[#ff334b] transition-colors leading-snug">
                  Smart Dustbin System <span className="text-red-400 font-semibold">— Patent Holder</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">
                  Automated Dust Collection, Waste Management and IoT Integration (The Patent Office Journal, Application No: 202541009764 A, Published 21/02/2025).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCertById('cert-patent-publication')}
              className="glass-chip shrink-0 self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full text-red-300 hover:text-white hover:border-red-500/60 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-red-400" />
              <span>View Patent</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
          *All awards, hackathon rankings, conference publications, and patent publications are officially certified.
        </p>
      </div>

      {/* Interactive Certificate Preview Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={handleCloseCert}
        onNavigate={handleNavigateCert}
      />
    </section>
  );
};

export default Achievements;
