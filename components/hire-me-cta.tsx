'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { portfolioData } from '../data/portfolio-data'

// Client-only dynamic import of the 3D topographic background
const HireMe3DBackground = dynamic(
  () => import('./hire-me-3d-background'),
  { ssr: false }
)

export function HireMeCta() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0.5)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handleMQ = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handleMQ)

    const el = sectionRef.current
    if (!el) return

    // Intersection observer for section visibility (smooth transition on enter/exit)
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.08, rootMargin: '100px 0px 100px 0px' }
    )

    observer.observe(el)

    // Scroll progress tracker for micro-parallax perspective shift
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      mq.removeEventListener('change', handleMQ)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Smooth mouse parallax for 3D camera
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    // Normalized [-1, 1] coordinates
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMouseOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  const phoneDigits = portfolioData.profile.phone.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${phoneDigits}`
  const emailUrl = `mailto:${portfolioData.profile.email}`
  const resumeUrl = portfolioData.links.resume || 'https://drive.google.com/drive/folders/12fZAOVld3XP_NQ9zyB6BiZnqmjE_6f0z?usp=drive_link'

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16 bg-[#050505] overflow-hidden border-t border-white/10 select-none"
      id="hire-me"
    >
      {/* ============================================================
          3D TOPOGRAPHIC & PERSPECTIVE GRID BACKGROUND LAYER (z-0)
          ============================================================ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Far background: subtle ambient dark theme glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 transition-colors duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle at 50% 50%, var(--theme-color, #ff1e38) 0%, transparent 68%)',
            filter: 'blur(100px)',
          }}
        />

        {/* 3D Topographic Terrain & Perspective Grid Canvas */}
        <HireMe3DBackground
          inView={inView}
          scrollProgress={scrollProgress}
          mouseOffset={mouseOffset}
          reducedMotion={reducedMotion}
        />

        {/* Dark Vignette & Readability Overlays (z-1)
            Guarantees HIRE ME typography and CTA action buttons remain crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(5,5,5,0.76) 0%, rgba(5,5,5,0.42) 50%, rgba(5,5,5,0.92) 100%)',
          }}
        />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505]/90 to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505]/90 to-transparent pointer-events-none" />
      </div>

      {/* ============================================================
          SECTION CONTENT CONTAINER (Centered Editorial Composition)
          ============================================================ */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* 1. TOP SMALL LABEL: OPEN TO OPPORTUNITIES */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-sm mb-6 sm:mb-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(18px)',
            transitionDelay: '100ms',
            color: 'var(--theme-color, #ff1e38)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: 'var(--theme-color, #ff1e38)',
              boxShadow: '0 0 8px var(--theme-color, #ff1e38)',
            }}
          />
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.28em] font-semibold uppercase">
            OPEN TO OPPORTUNITIES
          </span>
        </div>

        {/* 2. MAIN HEADLINE: HIRE ME (Dominant Element) */}
        <div
          className="overflow-hidden mb-8 sm:mb-12 w-full flex justify-center"
          style={{
            clipPath: inView || reducedMotion ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
            transition: 'clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) 200ms',
          }}
        >
          <h2
            className="font-display font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[10.5rem] xl:text-[12rem] 2xl:text-[13rem] uppercase tracking-tight leading-[0.88] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap"
            style={{
              transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(40%)',
            }}
          >
            <span
              style={{
                color: 'var(--theme-color, #ff1e38)',
                textShadow: '0 0 40px var(--theme-glow, rgba(255, 30, 56, 0.35))',
              }}
            >
              HIRE
            </span>{' '}
            <span className="text-white">ME</span>
          </h2>
        </div>

        {/* Supporting Brief Subtitle */}
        <p
          className="font-sans text-neutral-400 font-light text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-12 sm:mb-14 leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '300ms',
          }}
        >
          Available for full-time Artificial Intelligence &amp; Data Science engineering roles, high-performance machine learning deployments, and technical consultations.
        </p>

        {/* 3. CTA BUTTONS: THREE LARGE RECTANGULAR BUTTONS */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-10">
          
          {/* BUTTON 1: EMAIL DIRECT */}
          <a
            href={emailUrl}
            className="group relative flex items-center justify-center gap-3 px-6 py-5 rounded-lg border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/50 text-white font-mono text-xs sm:text-sm tracking-[0.16em] uppercase font-semibold transition-all duration-300 hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: '380ms',
            }}
            data-cursor="link"
            title={`Send Email to ${portfolioData.profile.email}`}
          >
            <Mail
              size={16}
              style={{ color: 'var(--theme-color, #ff1e38)' }}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span>EMAIL DIRECT</span>
            <ArrowUpRight
              size={14}
              className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            />
          </a>

          {/* BUTTON 2: VIEW RESUME (Theme Color Button) */}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-6 py-5 rounded-lg text-white font-mono text-xs sm:text-sm tracking-[0.16em] uppercase font-bold transition-all duration-500 hover:-translate-y-1 active:translate-y-0"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: '460ms',
              backgroundColor: 'var(--theme-color, #ff1e38)',
              boxShadow: '0 0 30px var(--theme-glow, rgba(255,30,56,0.38))',
            }}
            data-cursor="project"
            title="View Sudarson Balakrishnan's Resume on Google Drive"
          >
            <ArrowDownToLine
              size={16}
              className="group-hover:translate-y-0.5 transition-transform duration-300"
            />
            <span>VIEW RESUME</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* BUTTON 3: WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative flex items-center justify-center gap-3 px-6 py-5 rounded-lg border border-white/20 hover:border-white/50 bg-white/[0.03] hover:bg-white/[0.06] text-white font-mono text-xs sm:text-sm tracking-[0.16em] uppercase font-semibold transition-all duration-300 hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: '540ms',
            }}
            data-cursor="link"
            title={`Chat on WhatsApp: ${portfolioData.profile.phone}`}
          >
            <MessageCircle
              size={16}
              style={{ color: 'var(--theme-color, #ff1e38)' }}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span>WHATSAPP</span>
            <ArrowUpRight
              size={14}
              className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            />
          </a>
        </div>

        {/* 4. UNDER BUTTONS: EDITORIAL LINK TO /contact */}
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '620ms',
          }}
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.22em] text-neutral-400 hover:text-white uppercase py-2 transition-colors duration-200"
            data-cursor="link"
          >
            <span>MORE CONTACT OPTIONS</span>
            <ArrowRight
              size={13}
              style={{ color: 'var(--theme-color, #ff1e38)' }}
              className="group-hover:translate-x-1.5 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Bottom Technical Coordinate Footer */}
        <div
          className="mt-14 pt-8 border-t border-white/[0.08] w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-neutral-500 font-mono text-[10px] tracking-widest gap-4 transition-opacity duration-1000"
          style={{ opacity: inView ? 0.7 : 0, transitionDelay: '700ms' }}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>+</span>
            <span>{portfolioData.profile.coordinates}</span>
            <span>·</span>
            <span>{portfolioData.profile.location}</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <a
              href={portfolioData.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors group"
            >
              <span className="transition-colors duration-300 group-hover:text-[var(--theme-color)]">GITHUB</span>
            </a>
            <span>/</span>
            <a
              href={portfolioData.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors group"
            >
              <span className="transition-colors duration-300 group-hover:text-[var(--theme-color)]">LINKEDIN</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
