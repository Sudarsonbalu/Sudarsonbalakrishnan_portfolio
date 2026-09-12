'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Shield,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { portfolioData } from '../../data/portfolio-data'
import {
  TechnicalCrosshair,
  TelemetryDivider,
  GeometricAchievementGraphic,
} from '../../components/technical-graphics'
import { CertificateMarquee } from '../../components/certificate-marquee'
import dynamic from 'next/dynamic'

const Achievements3DBackground = dynamic(
  () => import('../../components/achievements-3d-background'),
  { ssr: false }
)

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)

    const timer = setTimeout(() => setMounted(true), 60)
    return () => {
      mq.removeEventListener('change', handler)
      clearTimeout(timer)
    }
  }, [])

  const intellectualProperty = [
    {
      index: '01',
      graphicType: 'patent' as const,
      type: 'PATENT FILED / PUBLISHED',
      year: '2024',
      title: 'Smart Dustbin System with Automated Dust Collection, Waste Management and IoT Integration',
      venue: 'Official Intellectual Property India Filing',
      details:
        'Engineered an automated IoT-enabled civic waste collection infrastructure combining ultrasonic level sensors, automated lid triggering, and telemetry dispatching.',
    },
    {
      index: '02',
      graphicType: 'publication' as const,
      type: 'JOURNAL PUBLICATION',
      year: '2024',
      title: 'A Comprehensive Analysis of Cyber Crimes and Cyber Security Tools',
      venue: 'International Journal of Creative Research Thoughts (IJCRT)',
      details:
        'Published empirical research paper surveying evolving attack vectors, penetration testing tooling, cryptographic defenses, and threat intelligence mitigations.',
    },
  ]

  const honors = [
    {
      index: '03',
      graphicType: 'conference' as const,
      type: 'NATIONAL CONFERENCE PRESENTATION',
      year: 'MARCH 2025',
      title: 'Research Paper: "AI in Cybersecurity"',
      event: 'NCRPAIDST-2K25 National Conference',
      organizer: 'Dept. of AI & Data Science, Er. Perumal Manimekalai College of Engineering',
      badge: 'CONFERENCE RESEARCH',
    },
    {
      index: '04',
      graphicType: 'award' as const,
      type: 'HACKATHON COMPETITION WINNER',
      year: '2024',
      title: 'Second Prize Winner — Technical Innovation',
      event: 'Sparkathon-2K24 Hackathon',
      organizer: 'Dept. of AI & Data Science, V.S.B. College of Engineering Technical Campus',
      badge: '2ND PRIZE PODIUM',
    },
  ]

  const certifications = [
    {
      name: 'Python for Data Science',
      issuer: 'Infosys Springboard',
      field: 'Machine Learning & Analytics',
    },
    {
      name: 'Python Programming',
      issuer: 'HackerRank & Guvi',
      field: 'Data Structures & Algorithms',
    },
    {
      name: 'ServiceNow Virtual Internship',
      issuer: 'ServiceNow / AICTE / EduSkills',
      field: 'Enterprise Cloud & ITSM',
    },
    {
      name: 'HTML & CSS Web Development',
      issuer: 'Udemy',
      field: 'Responsive Frontend Standards',
    },
  ]

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f5f5f7] relative overflow-hidden">
      {/* ── 3D METALLIC ORBITAL RINGS BACKGROUND LAYER (z-0) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <Achievements3DBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/40 to-[#050505] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_40%,transparent_25%,#050505_95%)] pointer-events-none" />
      </div>

      <div className="pt-28 pb-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">
        {/* 1. Header (NO PERSONAL PHOTO) */}
      <section className="mb-20 pb-12 border-b border-white/10 relative">
        <TechnicalCrosshair
          coord="+ 10°51'N / 78°41'E"
          label="INDEX 04 // RECOGNITIONS"
          className="mb-8"
        />

        <div
          className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase mb-4 flex items-center gap-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse" />
          <span>INDEX 04 // RECOGNITIONS &amp; VERIFIED INTELLECTUAL PROPERTY</span>
        </div>

        <h1
          className="font-display text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white mb-6 leading-[0.92] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '100ms',
          }}
        >
          HONORS, PATENTS <br />
          <span className="text-neutral-400 font-light">&amp; PUBLICATIONS.</span>
        </h1>

        <p
          className="text-neutral-400 font-sans text-base sm:text-xl font-light leading-relaxed max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '200ms',
          }}
        >
          An editorial archive of filed patents, academic journal publications, national conference research presentations, and competitive technical awards.
        </p>
      </section>

      {/* 2. Abstract Geometric Stamp Graphic with Real-Time Counters */}
      <section
        className="mb-20 p-6 sm:p-8 rounded-xl border border-white/10 bg-[#0a0a0a] flex flex-wrap items-center justify-between gap-6 font-mono text-xs transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
          transitionDelay: '280ms',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg border border-[#ff1e38]/40 bg-[#ff1e38]/10 flex items-center justify-center font-mono font-bold text-[#ff1e38] shadow-[0_0_12px_rgba(255,30,56,0.2)]">
            §
          </div>
          <div>
            <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <span>VERIFIED ARCHIVE STATUS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping" />
            </div>
            <div className="text-neutral-500 text-[11px]">
              ALL ENTRIES SUPPORTED BY INSTITUTIONAL RECORDS
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 text-neutral-400">
          <div className="flex items-baseline gap-2">
            <span>PATENTS:</span> <span className="text-white font-bold font-display text-base">01</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span>JOURNALS:</span> <span className="text-white font-bold font-display text-base">01</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span>CONFERENCES:</span> <span className="text-white font-bold font-display text-base">01</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span>AWARDS:</span> <span className="text-white font-bold font-display text-base">01</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span>DOCUMENTS:</span> <span className="text-[var(--theme-color,#ff1e38)] font-bold font-display text-base">09</span>
          </div>
        </div>
      </section>

      {/* 3. Intellectual Property: Patents & Journals */}
      <section className="mb-24">
        <TelemetryDivider label="INTELLECTUAL PROPERTY & PEER-REVIEWED RESEARCH" code="01" />

        <div className="space-y-8">
          {intellectualProperty.map((item, idx) => (
            <div
              key={item.index}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted || reducedMotion ? 'translateX(0)' : 'translateX(-16px)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 140 + 350}ms,
                             transform 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 140 + 350}ms,
                             border-color 0.3s ease,
                             box-shadow 0.3s ease`,
              }}
              className="p-8 sm:p-10 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-[#ff1e38] hover:shadow-[0_0_30px_rgba(255,30,56,0.1)] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Animated top hairline sweep on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-white/5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-2 rounded-lg bg-black/60 border border-white/10 group-hover:border-[#ff1e38]/50 transition-colors">
                    <GeometricAchievementGraphic type={item.graphicType} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                      <span className="font-display text-2xl font-bold text-[#ff1e38]">
                        {item.index}
                      </span>
                      <span className="w-3 h-px bg-white/20" />
                      <span className="text-white font-bold uppercase tracking-wider">{item.type}</span>
                    </div>
                    <div className="font-mono text-[11px] text-neutral-500 mt-1">
                      RECORD YEAR: {item.year}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[10px] tracking-widest px-3 py-1 rounded-full border border-white/10 text-neutral-400 group-hover:border-[#ff1e38]/40 group-hover:text-white transition-colors uppercase">
                  VERIFIED RECORD
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-[#ff1e38] transition-colors mb-3 leading-snug">
                {item.title}
              </h2>

              <div className="font-mono text-xs text-neutral-400 mb-4">
                VENUE: <span className="text-neutral-200">{item.venue}</span>
              </div>

              <p className="text-neutral-400 font-sans text-sm sm:text-base font-light leading-relaxed max-w-3xl">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Honors, Conferences & Competitions */}
      <section className="mb-24">
        <TelemetryDivider label="PRESENTATIONS & TECHNICAL COMPETITIONS" code="02" />

        <div className="space-y-8">
          {honors.map((item, idx) => (
            <div
              key={item.index}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted || reducedMotion ? 'translateX(0)' : 'translateX(16px)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 140 + 500}ms,
                             transform 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 140 + 500}ms,
                             border-color 0.3s ease,
                             box-shadow 0.3s ease`,
              }}
              className="p-8 sm:p-10 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-[#ff1e38] hover:shadow-[0_0_30px_rgba(255,30,56,0.1)] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Animated top hairline sweep */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

              <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-white/5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-2 rounded-lg bg-black/60 border border-white/10 group-hover:border-[#ff1e38]/50 transition-colors">
                    <GeometricAchievementGraphic type={item.graphicType} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                      <span className="font-display text-2xl font-bold text-[#ff1e38]">
                        {item.index}
                      </span>
                      <span className="w-3 h-px bg-white/20" />
                      <span className="text-white font-bold uppercase tracking-wider">{item.badge}</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#ff1e38] font-bold mt-1">
                      {item.year}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[10px] tracking-widest px-3 py-1 rounded-full border border-white/10 text-neutral-400 group-hover:border-[#ff1e38]/40 group-hover:text-white transition-colors uppercase">
                  HONOR CERTIFIED
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-[#ff1e38] transition-colors mb-3 leading-snug">
                {item.title}
              </h2>

              <div className="font-mono text-xs text-neutral-300 mb-2">
                EVENT: {item.event}
              </div>

              <div className="font-mono text-xs text-neutral-500">
                ORGANIZER: {item.organizer}
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* 5. Animated Horizontal Certificate Marquee Showcase */}
      <CertificateMarquee />

      <div className="pt-16 pb-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      {/* 6. Verified Technical Certifications */}
      <section className="mb-24 pt-4">
        <TelemetryDivider label="PROFESSIONAL BENCHMARKS & ACCREDITATIONS" code="04" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-[#ff1e38] hover:shadow-[0_0_20px_rgba(255,30,56,0.12)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="mb-4">
                  <GeometricAchievementGraphic type="certification" />
                </div>
                <h3 className="font-display text-base font-bold uppercase text-white mb-2 leading-snug group-hover:text-[#ff1e38] transition-colors">
                  {cert.name}
                </h3>
                <div className="font-mono text-xs text-neutral-400 mb-4">
                  {cert.issuer}
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 font-mono text-[10px] text-neutral-500 uppercase flex items-center justify-between">
                <span>{cert.field}</span>
                <span className="w-1 h-1 rounded-full bg-[#ff1e38]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer Navigation */}
      <section className="pt-16 border-t border-white/10 flex flex-wrap justify-between items-center gap-6">
        <div>
          <div className="font-mono text-xs text-neutral-500 uppercase mb-1">
            VERIFY CREDENTIALS
          </div>
          <div className="font-display text-xl font-bold text-white">
            READY TO COLLABORATE?
          </div>
        </div>
        <Link
          href="/contact"
          className="px-8 py-4 rounded-full bg-[#ff1e38] hover:bg-white text-black font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,30,56,0.3)] hover:scale-[1.02]"
        >
          CONTACT SUDARSON →
        </Link>
      </section>
      </div>
    </div>
  )
}
