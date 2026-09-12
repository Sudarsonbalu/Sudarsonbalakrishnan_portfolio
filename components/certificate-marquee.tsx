'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  FileCheck,
  ShieldCheck,
} from 'lucide-react'

export interface CertificateItem {
  id: string
  number: string
  title: string
  issuer: string
  date: string
  category: string
  filename: string
  src: string
  width: number
  height: number
  aspectRatio: number
}

export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'infosys-data-science',
    number: '01',
    title: 'Data Science Course Completion',
    issuer: 'Infosys Springboard',
    date: 'August 17, 2026',
    category: 'MACHINE LEARNING & DATA SCIENCE',
    filename: '01_Infosys_Data_Science_Certificate.jpg',
    src: '/certificates/01_Infosys_Data_Science_Certificate.jpg',
    width: 1830,
    height: 1297,
    aspectRatio: 1.41,
  },
  {
    id: 'astranova-2k25',
    number: '02',
    title: 'ASTRANOVA 2K25 National Technical Symposium',
    issuer: 'Coimbatore Institute of Technology (CIT)',
    date: 'March 1, 2025',
    category: 'NATIONAL TECHNICAL SYMPOSIUM',
    filename: '02_Astronova_2K25_Participation.jpg',
    src: '/certificates/02_Astronova_2K25_Participation.jpg',
    width: 1200,
    height: 675,
    aspectRatio: 1.78,
  },
  {
    id: 'ijcrt-publication',
    number: '03',
    title: 'Cyber Crimes & Cyber Security Tools Research Publication',
    issuer: 'International Journal of Creative Research Thoughts (IJCRT)',
    date: 'November 17, 2024',
    category: 'PEER-REVIEWED JOURNAL PUBLICATION',
    filename: '03_IJCRT_Publication_Certificate.jpg',
    src: '/certificates/03_IJCRT_Publication_Certificate.jpg',
    width: 1200,
    height: 849,
    aspectRatio: 1.41,
  },
  {
    id: 'patent-publication',
    number: '04',
    title: 'Smart Dustbin IoT System with Automated Waste Collection',
    issuer: 'The Patent Office Journal, Intellectual Property India',
    date: 'February 21, 2025',
    category: 'OFFICIAL PATENT PUBLICATION',
    filename: '04_Patent_Application_Publication.jpg',
    src: '/certificates/04_Patent_Application_Publication.jpg',
    width: 1200,
    height: 1552,
    aspectRatio: 0.77,
  },
  {
    id: 'sparkathon-2k24',
    number: '05',
    title: 'Sparkathon-2K24 Hackathon — 2nd Prize Technical Innovation',
    issuer: 'VSB College of Engineering Technical Campus',
    date: '2024',
    category: 'HACKATHON COMPETITION PODIUM',
    filename: '05_Sparkathon_2K24_Appreciation.jpg',
    src: '/certificates/05_Sparkathon_2K24_Appreciation.jpg',
    width: 1720,
    height: 1200,
    aspectRatio: 1.43,
  },
  {
    id: 'ncraidst-conference',
    number: '06',
    title: 'National Conference Paper: "AI in Cybersecurity"',
    issuer: 'NCRPAIDST-2K25 / Er. Perumal Manimekalai College of Engg.',
    date: 'March 2025',
    category: 'NATIONAL CONFERENCE PRESENTATION',
    filename: '06_National_Conference_NCRPAIDST_Certificate.jpg',
    src: '/certificates/06_National_Conference_NCRPAIDST_Certificate.jpg',
    width: 1675,
    height: 1200,
    aspectRatio: 1.40,
  },
  {
    id: 'techvolt-internship',
    number: '07',
    title: 'Full Stack Web Development Internship Certificate',
    issuer: 'Techvolt Software Pvt. Ltd.',
    date: '2024',
    category: 'FULL-STACK SOFTWARE INTERNSHIP',
    filename: '07_Techvolt_Full_Stack_Internship.jpg',
    src: '/certificates/07_Techvolt_Full_Stack_Internship.jpg',
    width: 1200,
    height: 1714,
    aspectRatio: 0.70,
  },
  {
    id: 'hackerrank-python',
    number: '08',
    title: 'Python (Basic) Skill Assessment Certification',
    issuer: 'HackerRank Certified Assessment',
    date: '2024',
    category: 'COMPUTATIONAL PROBLEM SOLVING',
    filename: '08_HackerRank_Python_Basic.jpg',
    src: '/certificates/08_HackerRank_Python_Basic.jpg',
    width: 1200,
    height: 913,
    aspectRatio: 1.31,
  },
  {
    id: 'servicenow-internship',
    number: '09',
    title: 'ServiceNow Virtual Internship Program Completion',
    issuer: 'ServiceNow / AICTE / SmartBridge',
    date: 'April 14, 2026',
    category: 'ENTERPRISE CLOUD ARCHITECTURE',
    filename: '09_ServiceNow_Virtual_Internship.jpg',
    src: '/certificates/09_ServiceNow_Virtual_Internship.jpg',
    width: 1200,
    height: 849,
    aspectRatio: 1.41,
  },
]

export function CertificateMarquee() {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [isPaused, setIsPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Open Lightbox
  const openLightbox = useCallback((cert: CertificateItem, index: number) => {
    setSelectedCert(cert)
    setSelectedIndex(index % CERTIFICATES.length)
  }, [])

  // Close Lightbox
  const closeLightbox = useCallback(() => {
    setSelectedCert(null)
    setSelectedIndex(-1)
  }, [])

  // Navigate lightbox next / previous
  const nextCert = useCallback(() => {
    if (selectedIndex === -1) return
    const nextIdx = (selectedIndex + 1) % CERTIFICATES.length
    setSelectedIndex(nextIdx)
    setSelectedCert(CERTIFICATES[nextIdx])
  }, [selectedIndex])

  const prevCert = useCallback(() => {
    if (selectedIndex === -1) return
    const prevIdx = (selectedIndex - 1 + CERTIFICATES.length) % CERTIFICATES.length
    setSelectedIndex(prevIdx)
    setSelectedCert(CERTIFICATES[prevIdx])
  }, [selectedIndex])

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!selectedCert) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextCert()
      if (e.key === 'ArrowLeft') prevCert()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedCert, closeLightbox, nextCert, prevCert])

  // Seamless duplication array (exact duplicate for infinite linear marquee)
  const marqueeItems = [...CERTIFICATES, ...CERTIFICATES]

  return (
    <section className="relative w-full py-16 sm:py-24 border-t border-b border-white/10 bg-[#050505] overflow-hidden">
      {/* Editorial Section Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[var(--theme-color,#ff1e38)] uppercase mb-3 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-color,#ff1e38)] shadow-[0_0_8px_var(--theme-color,#ff1e38)] animate-pulse" />
              <span>ACHIEVEMENTS // CERTIFICATES &amp; RECOGNITION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              AUTHENTICATED CREDENTIALS <br />
              <span className="text-neutral-500 font-light">&amp; INSTITUTIONAL ARCHIVE.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="px-3.5 py-1.5 rounded-full border border-[var(--border-accent,rgba(255,30,56,0.35))] bg-[var(--theme-dim,rgba(255,30,56,0.08))] font-mono text-[11px] text-[var(--theme-color,#ff1e38)] tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck size={13} />
              <span>09 DOCUMENTS</span>
            </div>
            <span className="hidden sm:inline font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
              CLICK CERTIFICATE TO INSPECT
            </span>
          </div>
        </div>
      </div>

      {/* Marquee Track Container with Edge Vignette Mask */}
      <div
        className={`certificate-marquee-container relative w-full overflow-hidden ${
          reducedMotion ? 'overflow-x-auto scrollbar-thin scrollbar-thumb-white/20' : 'certificate-edge-mask'
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex items-center gap-6 sm:gap-8 py-4 ${
            reducedMotion
              ? 'w-max px-6'
              : 'certificate-marquee-track'
          }`}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {(reducedMotion ? CERTIFICATES : marqueeItems).map((cert, index) => {
            const cardHeight = 320 // fixed baseline height for uniform alignment
            const cardWidth = Math.round(cardHeight * cert.aspectRatio)

            return (
              <button
                type="button"
                key={`${cert.id}-${index}`}
                onClick={() => openLightbox(cert, index)}
                aria-label={`Inspect certificate: ${cert.title}`}
                data-cursor="project"
                style={{
                  height: `${cardHeight}px`,
                  width: `${Math.max(220, Math.min(480, cardWidth))}px`,
                }}
                className="group relative shrink-0 rounded-lg overflow-hidden bg-[#090a0d] border border-white/10 hover:border-[var(--theme-color,#ff1e38)] shadow-[0_8px_24px_rgba(0,0,0,0.7),0_0_15px_var(--theme-dim,rgba(255,30,56,0.06))] hover:shadow-[0_16px_40px_var(--theme-glow,rgba(255,30,56,0.3))] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--theme-color,#ff1e38)] text-left p-0 select-none block"
              >
                {/* Subtle Theme Header Line */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--theme-color,#ff1e38)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                {/* Top Telemetry Stamp */}
                <div className="pointer-events-none absolute top-2 left-2 right-2 z-20 flex items-center justify-between px-2 py-1 bg-black/75 backdrop-blur-md rounded border border-white/5 text-[9px] font-mono tracking-wider">
                  <span className="text-[var(--theme-color,#ff1e38)] font-bold">
                    DOC. {cert.number}
                  </span>
                  <span className="text-neutral-400 uppercase truncate max-w-[150px]">
                    {cert.issuer}
                  </span>
                </div>

                {/* Certificate High-Res Image Container */}
                <div className="pointer-events-none relative w-full h-full p-2 pt-8 pb-9 flex items-center justify-center bg-[#070709]">
                  <div className="relative w-full h-full">
                    <Image
                      src={cert.src}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 768px) 280px, 420px"
                      priority={index < 4}
                      unoptimized
                      draggable={false}
                      className="pointer-events-none object-contain object-center rounded transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {/* Bottom Metadata Bar */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 px-3 py-2 bg-gradient-to-t from-black via-black/90 to-black/60 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[11px] font-bold text-white truncate group-hover:text-[var(--theme-color,#ff1e38)] transition-colors">
                      {cert.title}
                    </p>
                    <p className="font-mono text-[8.5px] text-neutral-400 tracking-wider uppercase truncate">
                      {cert.date}
                    </p>
                  </div>

                  <div className="w-6 h-6 rounded bg-white/5 group-hover:bg-[var(--theme-color,#ff1e38)] group-hover:text-black text-neutral-400 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <Maximize2 size={11} />
                  </div>
                </div>

                {/* Hover Ambient Sheen Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--theme-dim,rgba(255,30,56,0.06))] via-transparent to-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Lightbox / High-Res Inspection Modal — Mounted via Portal to document.body */}
      {mounted && selectedCert && createPortal(
        <div
          ref={modalRef}
          onClick={(e) => {
            if (e.target === modalRef.current) closeLightbox()
          }}
          className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/94 backdrop-blur-xl transition-all duration-300 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={selectedCert.title}
        >
          {/* Close Button Top Right */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[100002] p-3 rounded-full bg-white/10 hover:bg-[var(--theme-color,#ff1e38)] text-white hover:text-black border border-white/20 transition-all duration-200 shadow-xl flex items-center gap-2 font-mono text-xs tracking-wider cursor-pointer"
            title="Close Lightbox (ESC)"
          >
            <span>CLOSE</span>
            <X size={16} />
          </button>

          {/* Previous Certificate Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prevCert()
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[100002] w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/70 hover:bg-[var(--theme-color,#ff1e38)] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
            title="Previous Certificate (Left Arrow)"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next Certificate Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              nextCert()
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[100002] w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/70 hover:bg-[var(--theme-color,#ff1e38)] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
            title="Next Certificate (Right Arrow)"
          >
            <ChevronRight size={22} />
          </button>

          {/* Modal Central Frame */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[88vh] flex flex-col items-center justify-center bg-[#0a0a0c] rounded-xl border border-[var(--border-accent,rgba(255,30,56,0.4))] shadow-[0_0_50px_var(--theme-dim,rgba(255,30,56,0.25))] overflow-hidden z-[100001]"
          >
            {/* Modal Header */}
            <div className="w-full px-5 py-3.5 bg-black/80 border-b border-white/10 flex items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-0.5 rounded bg-[var(--theme-color,#ff1e38)] text-black font-bold text-[10px]">
                  DOC {selectedCert.number} / 09
                </span>
                <span className="text-[var(--theme-color,#ff1e38)] font-semibold uppercase truncate text-[11px]">
                  {selectedCert.category}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-[11px]">
                <FileCheck size={13} className="text-[var(--theme-color,#ff1e38)]" />
                <span>OFFICIAL VERIFIED ASSET</span>
              </div>
            </div>

            {/* High-Resolution Certificate Image */}
            <div className="relative w-full flex-1 min-h-[280px] sm:min-h-[460px] max-h-[70vh] p-3 sm:p-6 flex items-center justify-center bg-[#050507] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={selectedCert.id}
                src={selectedCert.src}
                alt={selectedCert.title}
                className="max-h-[66vh] max-w-full w-auto h-auto object-contain rounded shadow-2xl select-none transition-all duration-300"
                draggable={false}
              />
            </div>

            {/* Modal Footer Info Bar */}
            <div className="w-full px-5 sm:px-8 py-4 bg-[#0d0e12] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                  {selectedCert.title}
                </h3>
                <div className="font-mono text-xs text-neutral-400 flex flex-wrap items-center gap-3 mt-1">
                  <span>ISSUER: <strong className="text-neutral-200">{selectedCert.issuer}</strong></span>
                  <span>·</span>
                  <span>DATE: <strong className="text-neutral-200">{selectedCert.date}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href={selectedCert.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-accent,rgba(255,30,56,0.4))] hover:border-[var(--theme-color,#ff1e38)] bg-white/[0.04] hover:bg-[var(--theme-color,#ff1e38)] text-white hover:text-black font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>OPEN ORIGINAL FILE</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

