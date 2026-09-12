'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Mail,
  MessageCircle,
  Phone,
  Server,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import { portfolioData } from '../data/portfolio-data'
import { TechnicalCrosshair, NetworkTopologyGraphic, TelemetryDivider } from '../components/technical-graphics'
import { HireMeCta } from '../components/hire-me-cta'
import TechEcosystem from '../components/tech-ecosystem'
import { RotatingRoleText } from '../components/rotating-role-text'
import dynamic from 'next/dynamic'

const Home3DBackground = dynamic(
  () => import('../components/home-3d-background'),
  { ssr: false }
)

export default function HomePage() {
  const [heroMounted, setHeroMounted] = useState(false)
  const [capabilitiesInView, setCapabilitiesInView] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const capabilitiesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)

    // Trigger hero reveal
    const timer = setTimeout(() => setHeroMounted(true), 80)

    // Setup intersection observers
    const setupObserver = (
      el: HTMLElement | null,
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      threshold = 0.15
    ) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true)
            obs.disconnect()
          }
        },
        { threshold }
      )
      obs.observe(el)
      return obs
    }

    const obs1 = setupObserver(capabilitiesRef.current, setCapabilitiesInView, 0.1)

    return () => {
      mq.removeEventListener('change', handler)
      clearTimeout(timer)
      obs1?.disconnect()
    }
  }, [])

  const capabilities = [
    {
      num: '01',
      title: 'AI & MACHINE LEARNING',
      domain: 'Predictive Modeling · Computer Vision · Degradation Analytics',
      desc: 'Formulating machine learning pipelines with Python, Scikit-learn, and OpenCV—ranging from NASA C-MAPSS turbofan remaining useful life degradation forecasting to automated computer vision classification.',
    },
    {
      num: '02',
      title: 'DATA ENGINEERING & TELEMETRY',
      domain: 'ETL Pipelines · Relational Storage · Structured Indexing',
      desc: 'Engineering robust data processing workflows, sensor time-series normalization, and GitHub API telemetry ingestion pipelines backed by PostgreSQL and MySQL with high data integrity.',
    },
    {
      num: '03',
      title: 'FULL-STACK ASYNCHRONOUS SOFTWARE',
      domain: 'FastAPI Microservices · Next.js · JWT Stateless Security',
      desc: 'Developing resilient, sub-millisecond asynchronous backend microservices with FastAPI coupled to reactive Next.js client interfaces and role-based access security controls.',
    },
    {
      num: '04',
      title: 'ENTERPRISE CLOUD & AI INTEGRATION',
      domain: 'ServiceNow ITSM · Gemini API · OpenAI Source Code Analysis',
      desc: 'Integrating enterprise workflow platforms and neural language models for clinical healthcare triaging (MEDI NEXUS) and automated AST security vulnerability remediation (CODEGUARDIAN).',
    },
  ]

  return (
    <div className="bg-[#050505] text-[#f5f5f7] min-h-screen">
      
      {/* ============================================================
          01 — HERO SECTION
          Integrated Editorial Composition with Staggered Typography
          & Masked Portrait Reveal
          ============================================================ */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#050505]">
        {/* ── 3D FLOATING ABSTRACT GLASS SCULPTURE BACKGROUND LAYER (z-0) ── */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <Home3DBackground />
          {/* Subtle directional vignette mask to keep typography crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/70 pointer-events-none" />
        </div>
        
        {/* Subtle geometric corner crosshairs */}
        <div className="hidden lg:block absolute top-28 left-8 text-neutral-800 font-mono text-[10px] select-none z-30">
          <TechnicalCrosshair coord="+ 10°51'N / 78°41'E" label="SEC.01 // IDENTITY" />
        </div>

        {/* DESKTOP EXTENDED PORTRAIT (56-60% width, extends right-to-center, seamless gradient blend) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[56%] xl:w-[58%] h-full z-10 pointer-events-none">
          <div className="relative w-full h-full">
            {/* Cinematic curtain wipe-reveal */}
            <div
              className="absolute inset-0 bg-[#050505] z-30 pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] origin-top"
              style={{
                transform: heroMounted && !reducedMotion ? 'scaleY(0)' : 'scaleY(1)',
              }}
            />

            {/* DYNAMIC VOLUMETRIC THEME ATMOSPHERE GLOW */}
            <div
              className="absolute top-1/3 right-1/4 w-[480px] h-[480px] rounded-full blur-[130px] pointer-events-none transition-colors duration-700 ease-out z-0"
              style={{
                backgroundColor: 'var(--theme-color, #ff1e38)',
                opacity: 0.22,
              }}
            />

            {/* LAYER 1: CINEMATIC COLOR-GRADED PORTRAIT
                Hue-shifted to the exact theme color, transforming the red smoke,
                red rim light on hair/suit, and background atmosphere to match the theme */}
            <div
              className="absolute inset-0 z-0 transition-all duration-700 ease-out"
              style={{
                filter: 'hue-rotate(var(--theme-hue-rotate, 0deg)) contrast(1.04) saturate(1.1)',
              }}
            >
              <Image
                src="/images/sudarson.jpg"
                alt="Sudarson Balakrishnan — AI & Data Science Engineer"
                fill
                priority
                unoptimized
                sizes="60vw"
                className="object-contain object-right-bottom"
              />
            </div>

            {/* LAYER 2: NEUTRAL CORE & FACIAL PRESERVATION MASK */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                WebkitMaskImage: 'radial-gradient(circle at 62% 34%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 22%, rgba(0,0,0,0) 48%)',
                maskImage: 'radial-gradient(circle at 62% 34%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 22%, rgba(0,0,0,0) 48%)',
              }}
            >
              <Image
                src="/images/sudarson.jpg"
                alt=""
                fill
                priority
                unoptimized
                sizes="60vw"
                className="object-contain object-right-bottom"
              />
            </div>

            {/* Left Edge Natural Fade into Pure Black */}
            <div className="absolute inset-y-0 left-0 w-64 xl:w-96 bg-gradient-to-r from-[#050505] via-[#050505]/85 via-40% to-transparent pointer-events-none z-20" />
            
            {/* Bottom Edge Fade into Pure Black */}
            <div className="absolute inset-x-0 bottom-0 h-44 xl:h-64 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-20" />

            {/* Top Fade for Navigation Clearance */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] via-[#050505]/50 to-transparent pointer-events-none z-20" />
          </div>
        </div>

        {/* HERO CONTENT CONTAINER (Typography & Interaction) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-16 lg:py-32">
          <div className="w-full lg:max-w-[56%] xl:max-w-[52%] flex flex-col items-start">
            
            {/* Minimal Technical Header */}
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] font-mono text-[11px] tracking-[0.2em] uppercase mb-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: '100ms',
                color: 'var(--theme-color, #ff1e38)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }}
              />
              <span>AI &amp; DATA SCIENCE ENGINEER</span>
            </div>

            {/* Confident Typographic Name with Staggered Entrance */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.92] mb-6">
              <span
                className="block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[var(--theme-color)] transition-colors cursor-default"
                style={{
                  opacity: heroMounted ? 1 : 0,
                  transform: heroMounted || reducedMotion ? 'translateY(0)' : 'translateY(22px)',
                  transitionDelay: '200ms',
                }}
              >
                SUDARSON
              </span>
              <span
                className="block text-neutral-400 font-light transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: heroMounted ? 1 : 0,
                  transform: heroMounted || reducedMotion ? 'translateY(0)' : 'translateY(22px)',
                  transitionDelay: '320ms',
                }}
              >
                BALAKRISHNAN
              </span>
            </h1>

            {/* Premium Rotating Role Text Animation */}
            <div
              className="w-full max-w-xl lg:max-w-2xl mb-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted || reducedMotion ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '420ms',
              }}
            >
              <RotatingRoleText
                mounted={heroMounted}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-wrap items-center gap-4 mb-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted || reducedMotion ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '520ms',
              }}
            >
              <Link
                href="/projects"
                className="px-8 py-4 rounded-full text-black font-mono font-bold text-xs tracking-widest uppercase transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] hover:bg-white"
                style={{
                  backgroundColor: 'var(--theme-color, #ff1e38)',
                  boxShadow: '0 0 25px var(--theme-glow, rgba(255,30,56,0.35))',
                }}
                data-cursor="project"
              >
                VIEW PROJECTS [05] →
              </Link>

              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-transparent border border-white/20 hover:border-white text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white/[0.04]"
                data-cursor="link"
              >
                GET IN TOUCH
              </Link>
            </div>

            {/* Minimal Hairline Telemetry */}
            <div
              className="font-mono text-xs text-neutral-500 flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 w-full max-w-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: '620ms',
              }}
            >
              <div>
                <span className="text-neutral-400">LOCATION:</span> {portfolioData.profile.location}
              </div>
              <div>
                <span className="text-neutral-400">STATUS:</span>{' '}
                <span className="font-bold transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>
                  {portfolioData.profile.availability}
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE/TABLET EXTENDED PORTRAIT (< lg):
              Large editorial portrait that seamlessly melts into the background with dynamic theme color treatment */}
          <div className="block lg:hidden relative w-[calc(100%+3rem)] -mx-6 sm:w-[calc(100%+5rem)] sm:-mx-10 h-[500px] sm:h-[640px] mt-12 overflow-hidden pointer-events-none">
            {/* Curtain wipe */}
            <div
              className="absolute inset-0 bg-[#050505] z-30 pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] origin-top"
              style={{
                transform: heroMounted && !reducedMotion ? 'scaleY(0)' : 'scaleY(1)',
              }}
            />

            {/* Mobile Volumetric Glow */}
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[100px] pointer-events-none transition-colors duration-700 ease-out z-0"
              style={{
                backgroundColor: 'var(--theme-color, #ff1e38)',
                opacity: 0.2,
              }}
            />

            {/* Layer 1: Color-Graded Portrait */}
            <div
              className="absolute inset-0 z-0 transition-all duration-700 ease-out"
              style={{
                filter: 'hue-rotate(var(--theme-hue-rotate, 0deg)) contrast(1.04) saturate(1.1)',
              }}
            >
              <Image
                src="/images/sudarson.jpg"
                alt="Sudarson Balakrishnan — AI & Data Science Engineer"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-contain object-bottom"
              />
            </div>

            {/* Layer 2: Neutral Face Preservation Mask */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                WebkitMaskImage: 'radial-gradient(circle at 50% 32%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0) 45%)',
                maskImage: 'radial-gradient(circle at 50% 32%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0) 45%)',
              }}
            >
              <Image
                src="/images/sudarson.jpg"
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-contain object-bottom"
              />
            </div>

            {/* Top Fade */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-20" />
            {/* Bottom Fade */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent pointer-events-none z-20" />
            {/* Subtle side vignettes */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-20" />
          </div>

        </div>
      </section>

      {/* ============================================================
          02 — WHAT I DO
          Typography + Hairline Dividers + Interactive Capability Rows
          ============================================================ */}
      <section
        ref={capabilitiesRef}
        className="py-28 sm:py-36 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto border-t border-white/10"
      >
        <div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: capabilitiesInView ? 1 : 0,
            transform: capabilitiesInView || reducedMotion ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <div>
            <div className="font-mono text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: 'var(--theme-color, #ff1e38)' }}>
              <span className="w-1.5 h-1.5 rounded-full transition-colors duration-300" style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }} />
              <span>01 // CAPABILITIES &amp; SPECIALIZATION</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              WHAT I DO<span className="transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>.</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-neutral-400 max-w-md leading-relaxed">
            Verified engineering disciplines backed by machine learning models, database systems, and full-stack software.
          </p>
        </div>

        {/* Clean Typographic & Line-Based Capability List */}
        <div className="border-t border-white/10 divide-y divide-white/10">
          {capabilities.map((cap, idx) => (
            <div
              key={cap.num}
              style={{
                opacity: capabilitiesInView ? 1 : 0,
                transform: capabilitiesInView || reducedMotion ? 'translateX(0)' : 'translateX(-16px)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 110}ms,
                             transform 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 110}ms,
                             background-color 0.3s ease`,
              }}
              className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start group hover:bg-white/[0.015] px-2 sm:px-4 cursor-default relative overflow-hidden"
            >
              {/* Left red accent indicator on hover */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"
                style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }}
              />

              {/* Index Number */}
              <div className="lg:col-span-2 font-mono text-sm sm:text-base text-neutral-600 transition-colors flex items-center gap-3">
                <span className="group-hover:translate-x-1 transition-transform duration-200 group-hover:text-[var(--theme-color)]">{cap.num}</span>
                <span className="w-4 h-px bg-white/10 group-hover:bg-[var(--theme-color)] transition-colors" />
              </div>

              {/* Title & Domain */}
              <div className="lg:col-span-5">
                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white group-hover:text-[var(--theme-color)] transition-colors leading-snug mb-2 group-hover:translate-x-1 transition-transform duration-200">
                  {cap.title}
                </h3>
                <div className="font-mono text-xs uppercase tracking-wider transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>
                  {cap.domain}
                </div>
              </div>

              {/* Narrative Description */}
              <div className="lg:col-span-5">
                <p className="text-neutral-300 font-sans text-sm sm:text-base font-light leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          03 — WHAT TECHNOLOGIES I WORK WITH
          Categorized Editorial Technology Ecosystem (7 Verified Categories)
          ============================================================ */}
      <TechEcosystem />

      {/* ============================================================
          04 — CLOSING CTA SECTION: HIRE ME
          Dominant Editorial Headline + Topographic Contour Lines
          + 3 Staggered Action Buttons + Direct Resume & WhatsApp
          ============================================================ */}
      <HireMeCta />

    </div>
  )
}
