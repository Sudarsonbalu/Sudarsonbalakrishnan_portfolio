'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  Server,
  Sparkles,
} from 'lucide-react'
import { portfolioData } from '../data/portfolio-data'
import ProjectVisualMockup from './project-visual-mockup'
import { TechnicalCrosshair, TelemetryDivider } from './technical-graphics'
import dynamic from 'next/dynamic'

const ProjectDetail3DBackground = dynamic(
  () => import('./project-detail-3d-background'),
  { ssr: false }
)

export default function ProjectDetailView({
  project,
  nextProject,
}: {
  project: (typeof portfolioData.projects)[0]
  nextProject: (typeof portfolioData.projects)[0]
}) {
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

  return (
    <div className="bg-[#050505] text-[#f5f5f7] min-h-screen pt-24 pb-28 relative overflow-hidden">
      {/* ── 3D TRANSPARENT PRISM / GLASS LAYERS (z-0) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <ProjectDetail3DBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_40%,transparent_25%,#050505_95%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">

        {/* ── Top Navigation & Coordinates ─────────────────────────── */}
        <nav className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-400 hover:text-white uppercase transition-colors group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            <span>PROJECT ARCHIVE</span>
          </Link>

          <TechnicalCrosshair
            coord="+ 10°51'N / 78°41'E"
            label={`CASE STUDY ${project.n} // 05`}
            className="hidden sm:flex"
          />
        </nav>

        {/* ── Hero Section ─────────────────────────────────── */}
        <header className="mb-16">
          {/* Category & year */}
          <div
            className="flex items-center gap-2.5 mb-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase">
              {project.category} · {project.year}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white mb-4 leading-[0.92] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '100ms',
            }}
          >
            {project.title}
          </h1>

          <p
            className="font-mono text-xs sm:text-sm tracking-wider text-[#ff1e38]/80 uppercase mb-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '180ms',
            }}
          >
            {project.subtitle}
          </p>

          <p
            className="font-sans text-base sm:text-lg font-light text-neutral-300 max-w-3xl leading-relaxed mb-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '260ms',
            }}
          >
            {project.summary}
          </p>

          {/* Project Direct Link Bar */}
          {(() => {
            const targetUrl = project.demo || (project.link?.startsWith('http') ? project.link : null) || project.github
            if (!targetUrl) return null
            return (
              <div
                className="mb-8 p-4 sm:p-5 rounded-xl border border-white/10 bg-[#0c0d10] flex flex-wrap items-center justify-between gap-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: '300ms',
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-color,#ff1e38)] shadow-[0_0_10px_var(--theme-color,#ff1e38)] shrink-0" />
                  <div className="min-w-0 font-mono text-xs">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5">
                      {project.demo ? 'LIVE PRODUCTION LINK' : 'OFFICIAL PROJECT LINK'}
                    </div>
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:text-[var(--theme-color,#ff1e38)] font-semibold transition-colors underline decoration-[var(--border-accent)] underline-offset-4 break-all block"
                    >
                      {targetUrl}
                    </a>
                  </div>
                </div>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--theme-color,#ff1e38)] hover:bg-white text-black font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_16px_var(--theme-glow)] hover:scale-105 active:scale-95 shrink-0"
                >
                  <span>OPEN LINK</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            )
          })()}

          {/* CTA links */}
          <div
            className="flex flex-wrap gap-4 items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '340ms',
            }}
          >
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-live-demo-btn px-7 py-3.5 text-xs"
              >
                <Globe size={14} />
                <span>LIVE DEMO</span>
                <span className="arrow-icon">↗</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white/[0.06]"
              >
                <Github size={13} />
                <span>SOURCE REPOSITORY</span>
                <ArrowUpRight size={12} />
              </a>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 hover:border-white text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white/[0.04]"
            >
              DISCUSS ARCHITECTURE
            </Link>
          </div>
        </header>

        {/* ── Large Project Visual Hero with Curtain Wipe ─────────────────────── */}
        <section className="relative w-full h-[320px] sm:h-[460px] lg:h-[560px] overflow-hidden rounded-xl border border-white/10 mb-6 bg-[#050506]">
          {/* Mask curtain */}
          <div
            className="absolute inset-0 bg-[#050505] z-30 pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] origin-top"
            style={{
              transform: mounted && !reducedMotion ? 'scaleY(0)' : 'scaleY(1)',
            }}
          />

          {project.image && (
            <>
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none z-10" />

              {/* Ghost project number */}
              <div className="absolute bottom-6 left-8 z-20 font-display text-7xl sm:text-9xl font-extrabold text-white/[0.08] pointer-events-none select-none">
                {project.n}
              </div>
            </>
          )}
        </section>

        {/* ── Prominent LIVE DEMO under Image ────────────────── */}
        {project.demo && (
          <div className="mb-8 p-5 sm:p-6 rounded-xl border border-[var(--border-accent,rgba(255,30,56,0.45))] bg-[#08080a] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_0_35px_var(--theme-dim,rgba(255,30,56,0.18))]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--theme-dim,rgba(255,30,56,0.15))] border border-[var(--border-accent,rgba(255,30,56,0.4))] flex items-center justify-center text-[var(--theme-color,#ff1e38)] shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <div className="font-mono text-[10px] sm:text-xs text-[var(--theme-color,#ff1e38)] tracking-widest uppercase font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--theme-color,#ff1e38)] shadow-[0_0_8px_var(--theme-color,#ff1e38)] animate-pulse" />
                  <span>PRODUCTION DEPLOYMENT ACTIVE</span>
                </div>
                <div className="font-mono text-xs sm:text-sm text-neutral-300 mt-0.5">
                  {project.demo.replace(/^https?:\/\//, '')}
                </div>
              </div>
            </div>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-live-demo-btn w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm"
            >
              <span>LIVE DEMO</span>
              <span className="arrow-icon">↗</span>
            </a>
          </div>
        )}

        {/* Metric Bar under visual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden mb-12 border border-white/10">
          {project.metricsList.map((m, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 bg-[#0a0a0c] hover:bg-white/[0.02] transition-colors group"
            >
              <div className="font-mono text-[9.5px] tracking-widest text-neutral-500 uppercase mb-2">
                {m.label}
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-[#ff1e38] group-hover:translate-x-0.5 transition-transform">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Online Live Demo Banner (if available) ────────────────── */}
        {project.demo && (
          <div className="mb-14 p-6 sm:p-8 rounded-xl border border-[var(--border-accent,rgba(255,30,56,0.35))] bg-gradient-to-r from-[var(--theme-dim,rgba(255,30,56,0.1))] via-[#0a0a0c] to-[#0a0a0c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_0_35px_var(--theme-dim,rgba(255,30,56,0.08))]">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[var(--theme-color,#ff1e38)] text-black flex items-center justify-center font-bold shadow-[0_0_16px_var(--theme-glow,rgba(255,30,56,0.4))] shrink-0">
                <Globe size={22} />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] sm:text-xs text-[var(--theme-color,#ff1e38)] tracking-widest uppercase mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-color,#ff1e38)] inline-block" />
                  <span>ONLINE PRODUCTION DEPLOYMENT</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white tracking-wide">
                  Live Interactive Demo Available
                </h3>
                <p className="font-mono text-[11px] text-neutral-400 mt-0.5 truncate max-w-md sm:max-w-xl">
                  {project.demo}
                </p>
              </div>
            </div>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-live-demo-btn shrink-0 px-7 py-3.5"
            >
              <span>LIVE DEMO</span>
              <span className="arrow-icon">↗</span>
            </a>
          </div>
        )}

        <TelemetryDivider label="SIMULATION // SYSTEM BENCHMARKS" code="01" />

        {/* ── Interactive Console Simulation ────────────────── */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-4 bg-[#ff1e38] rounded-full inline-block" />
            <p className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase">
              01 / LIVE SYSTEM RUNTIME SIMULATION
            </p>
          </div>
          <ProjectVisualMockup slug={project.slug} />
        </section>

        <TelemetryDivider label="PIPELINES // ARCHITECTURE SPEC" code="02" />

        {/* ── Architecture Pipelines ────────────────────────── */}
        <section className="mb-16 p-8 sm:p-10 rounded-xl border border-white/10 bg-[#0a0a0b] relative overflow-hidden">
          <div className="flex items-center gap-2 mb-8">
            <Cpu size={16} className="text-[#ff1e38]" />
            <p className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase">
              02 / CORE ARCHITECTURAL PIPELINES
            </p>
          </div>

          <div className="space-y-5">
            {project.architectureList.map((arch, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <span className="font-mono text-xs text-[#ff1e38] font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  [{(i + 1).toString().padStart(2, '0')}]
                </span>
                <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                  {arch}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Challenge vs Solution Split Screen ─────────────────────────── */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Challenge */}
            <div className="p-8 sm:p-10 rounded-xl border border-white/10 bg-[#0a0a0b] hover:border-white/20 transition-colors relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Server size={15} className="text-neutral-400" />
                <p className="font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase">
                  03 / THE CHALLENGE
                </p>
              </div>
              <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {project.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className="p-8 sm:p-10 rounded-xl border border-[#ff1e38]/30 bg-[#0a0a0b] hover:border-[#ff1e38] transition-all relative overflow-hidden shadow-[0_0_24px_rgba(255,30,56,0.06)]">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={15} className="text-[#ff1e38]" />
                <p className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase">
                  04 / THE SOLUTION
                </p>
              </div>
              <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </section>

        {/* ── Key Features / Deliverables ─────────────────────────────────── */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-4 bg-[#ff1e38] rounded-full inline-block" />
            <p className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase">
              05 / PRODUCTION DELIVERABLES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.features.map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/10 bg-[#0a0a0b] hover:border-[#ff1e38]/40 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#ff1e38]/10 flex items-center justify-center text-[#ff1e38]">
                    <CheckCircle2 size={13} />
                  </div>
                  <span className="font-mono text-xs text-neutral-500">
                    0{i + 1}
                  </span>
                </div>
                <p className="font-sans text-sm text-neutral-300 font-light leading-relaxed">
                  {feat}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Technology Stack ──────────────────────────────── */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-4 bg-[#ff1e38] rounded-full inline-block" />
            <p className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase">
              06 / TECHNOLOGY STACK
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0a0a0b] font-mono text-xs uppercase tracking-wider text-neutral-300 hover:border-[#ff1e38]/50 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
                {tag}
              </span>
            ))}
          </div>
        </section>

        <TelemetryDivider label="NEXT ARCHIVE // CASE STUDY" code="NEXT" />

        {/* ── Next Project Interaction ─────────────────────────────────── */}
        <section>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="block p-8 sm:p-12 rounded-2xl border border-white/10 bg-[#0a0a0b] hover:border-[#ff1e38] hover:shadow-[0_0_30px_rgba(255,30,56,0.15)] transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div>
                <p className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse" />
                  <span>NEXT CASE STUDY — {nextProject.n} / 05</span>
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white group-hover:text-[#ff1e38] transition-colors leading-tight">
                  {nextProject.title}
                </h2>
                <p className="font-mono text-xs text-neutral-400 mt-2 uppercase tracking-wider">
                  {nextProject.subtitle}
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-[#ff1e38] text-black flex items-center justify-center shrink-0 group-hover:scale-110 shadow-[0_0_24px_rgba(255,30,56,0.4)] transition-all duration-300">
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </section>

      </div>
    </div>
  )
}
