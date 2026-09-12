'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import { portfolioData } from '../../data/portfolio-data'
import { TechnicalCrosshair, TelemetryDivider } from '../../components/technical-graphics'
import dynamic from 'next/dynamic'

const Projects3DBackground = dynamic(
  () => import('../../components/projects-3d-background'),
  { ssr: false }
)

/* ─── Image display modes per project ─────────────────
   'cover'   = cinematic photo, fill entire area
   'contain' = logo on dark bg, centered with padding
─────────────────────────────────────────────────────── */
const IMAGE_MODES: Record<string, 'cover' | 'contain'> = {
  'medi-nexus':            'cover',     // full landscape banner — fill card
  'codeguardian':          'cover',
  'turbofan-rul':          'cover',
  'ibpfm-mission':         'cover',
  'thekamalai-transports': 'cover',
}

/* ─── Intersection Observer hook ─────────────────────── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); obs.disconnect() }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─── Project Card ────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  imgHeight = 320,
}: {
  project: (typeof portfolioData.projects)[0]
  index: number
  imgHeight?: number
}) {
  const [hovered, setHovered] = useState(false)
  const { ref, inView } = useInView()
  const mode = IMAGE_MODES[project.slug] ?? 'cover'
  const isCover = mode === 'cover'

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms,
                     transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms`,
        height: '100%',
      }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          height: '100%',
          background: '#080809',
          border: `1px solid ${hovered ? 'var(--border-accent, rgba(255,30,56,0.5))' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: hovered
            ? '0 0 0 1px var(--theme-dim, rgba(255,30,56,0.07)), 0 24px 64px rgba(0,0,0,0.7)'
            : '0 4px 20px rgba(0,0,0,0.35)',
          transition: 'border-color 0.35s, box-shadow 0.35s',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        {/* ══ IMAGE AREA ══════════════════════════════ */}
        <Link
          href={`/projects/${project.slug}`}
          prefetch={true}
          data-cursor="project"
          style={{
            position: 'relative',
            width: '100%',
            height: imgHeight,
            overflow: 'hidden',
            flexShrink: 0,
            background: isCover ? '#050506' : '#0a0a0c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          {/* Wipe-reveal curtain */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#050505',
              zIndex: 20,
              transformOrigin: 'top',
              transform: inView ? 'scaleY(0)' : 'scaleY(1)',
              transition: `transform 0.8s cubic-bezier(0.76,0,0.24,1) ${index * 110 + 200}ms`,
              pointerEvents: 'none',
            }}
          />

          {/* The logo / project image */}
          {project.image && (
            <div
              style={{
                position: 'absolute',
                inset: isCover ? 0 : '12%',
                transform: hovered
                  ? isCover ? 'scale(1.05)' : 'scale(1.04)'
                  : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                willChange: 'transform',
              }}
            >
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                sizes="(max-width: 860px) 100vw, 60vw"
                style={{
                  objectFit: isCover ? 'cover' : 'contain',
                  objectPosition: 'center',
                  filter: hovered
                    ? 'grayscale(0%) brightness(1)'
                    : isCover
                      ? 'grayscale(15%) brightness(0.88)'
                      : 'grayscale(5%) brightness(0.92)',
                  transition: 'filter 0.45s ease',
                }}
                priority={index < 2}
                unoptimized
              />
            </div>
          )}

          {/* Gradient overlay */}
          {isCover && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(8,8,9,0.85) 0%, rgba(8,8,9,0.2) 55%, transparent 100%)',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Theme tint on hover */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--theme-dim, rgba(255,30,56,0.08))',
              zIndex: 6,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.35s ease',
              pointerEvents: 'none',
            }}
          />

          {/* Live Demo Status Pill on image */}
          {project.demo && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 16,
                zIndex: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 9999,
                background: 'rgba(5, 5, 8, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-accent, rgba(255,30,56,0.4))',
                fontFamily: 'monospace',
                fontSize: 8.5,
                letterSpacing: '0.14em',
                color: 'var(--theme-color, #ff1e38)',
                textTransform: 'uppercase',
                fontWeight: 700,
                boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: 'var(--theme-color, #ff1e38)',
                  boxShadow: '0 0 6px var(--theme-color, #ff1e38)',
                }}
              />
              <span>LIVE DEMO</span>
            </div>
          )}

          {/* Ghost project number — top right */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              zIndex: 10,
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: 60,
              fontWeight: 900,
              lineHeight: 1,
              color: isCover ? 'rgba(255,255,255,0.07)' : 'var(--theme-dim, rgba(255,30,56,0.08))',
              userSelect: 'none',
              pointerEvents: 'none',
              transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'transform 0.4s ease',
              letterSpacing: '-0.02em',
            }}
          >
            {project.n}
          </div>

          {/* Year — bottom left */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 16,
              zIndex: 10,
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.4)',
              pointerEvents: 'none',
            }}
          >
            {project.year}
          </div>

          {/* Category — bottom right */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 16,
              zIndex: 10,
              fontFamily: 'monospace',
              fontSize: 8,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: hovered ? 'var(--theme-color, #ff1e38)' : 'rgba(255,255,255,0.3)',
              transition: 'color 0.3s',
              pointerEvents: 'none',
            }}
          >
            {project.category}
          </div>
        </Link>

        {/* ══ CONTENT AREA ════════════════════════════ */}
        <div
          style={{
            padding: '22px 24px 20px',
            borderTop: `1px solid ${hovered ? 'var(--theme-dim, rgba(255,30,56,0.2))' : 'rgba(255,255,255,0.05)'}`,
            transition: 'border-color 0.35s',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flex: 1,
          }}
        >
          {/* PROJECT NUMBER */}
          <div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: 'var(--theme-color, #ff1e38)',
                marginBottom: 6,
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              {project.n}&nbsp;/&nbsp;{String(portfolioData.projects.length).padStart(2, '0')}
            </p>

            {/* PROJECT NAME */}
            <Link
              href={`/projects/${project.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.15,
                  color: '#ffffff',
                  transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.3s',
                }}
              >
                {project.title}
              </h2>
            </Link>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: 8.5,
                letterSpacing: '0.12em',
                color: 'var(--border-accent, rgba(255,30,56,0.6))',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {project.subtitle}
            </p>
          </div>

          {/* CATEGORY / DESCRIPTION */}
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: 12.5,
              lineHeight: 1.62,
              color: 'rgba(255,255,255,0.42)',
              fontWeight: 300,
            }}
          >
            {project.summary}
          </p>

          {/* TECHNOLOGIES */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px', marginTop: 2 }}>
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 8.5,
                  letterSpacing: '0.11em',
                  textTransform: 'uppercase',
                  color: hovered ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.28)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '3px 8px',
                  borderRadius: 4,
                  transition: 'color 0.3s, border-color 0.3s',
                }}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 5 && (
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 8.5,
                  color: 'var(--border-accent, rgba(255,30,56,0.5))',
                  letterSpacing: '0.1em',
                  padding: '3px 6px',
                }}
              >
                +{project.tags.length - 5}
              </span>
            )}
          </div>

          {/* LIVE DEMO ↗ PRIMARY ACTION */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              paddingTop: 16,
              marginTop: 'auto',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-live-demo-btn"
                style={{ flex: '1 1 130px', minWidth: 120 }}
              >
                <span>LIVE DEMO</span>
                <span className="arrow-icon">↗</span>
              </a>
            ) : (
              <Link
                href={`/projects/${project.slug}`}
                className="editorial-live-demo-btn"
                style={{ flex: '1 1 130px', minWidth: 120 }}
              >
                <span>VIEW CASE STUDY</span>
                <span className="arrow-icon">→</span>
              </Link>
            )}

            <Link
              href={`/projects/${project.slug}`}
              style={{
                flex: '1 1 110px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '11px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                e.currentTarget.style.background = 'transparent'
              }}
              title="Read full case study"
            >
              <span>CASE STUDY</span>
              <span style={{ fontSize: 11 }}>→</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────── */
export default function ProjectsPage() {
  const { ref: headerRef, inView: headerInView } = useInView(0.06)
  const projects = portfolioData.projects

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .proj-row-1 { display:grid; grid-template-columns:1fr; gap:10px; }
        .proj-row-2 { display:grid; grid-template-columns:1fr; gap:10px; }
        @media (min-width:860px) {
          .proj-row-1 { grid-template-columns:3fr 2fr; }
          .proj-row-2 { grid-template-columns:2fr 3fr; }
        }
      `}} />

      <div style={{ background:'#050505', minHeight:'100vh', paddingTop:108, paddingBottom:96, position:'relative', overflow:'hidden' }}>
        {/* ── 3D FLOATING ABSTRACT GEOMETRIC SCULPTURES (z-0) ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <Projects3DBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/45 to-[#050505] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,transparent_30%,#050505_95%)] pointer-events-none" />
        </div>

        <div style={{ maxWidth:1280, margin:'0 auto', paddingLeft:24, paddingRight:24, position:'relative', zIndex:10 }}>

          {/* Header */}
          <header
            ref={headerRef}
            style={{
              marginBottom:60, paddingBottom:36,
              borderBottom:'1px solid rgba(255,255,255,0.06)',
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? 'translateY(0)' : 'translateY(24px)',
              transition:'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <TechnicalCrosshair
              coord="+ 10°51'N / 78°41'E"
              label="ARCHIVE // REPOSITORY INDEX"
              className="mb-8"
            />

            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#ff1e38', display:'inline-block' }} />
              <span style={{ fontFamily:'monospace', fontSize:9.5, letterSpacing:'0.22em', color:'#ff1e38', textTransform:'uppercase' }}>
                Project Archive / 0{projects.length} Case Studies
              </span>
            </div>
            <h1 style={{ fontFamily:'var(--font-display,sans-serif)', fontSize:'clamp(38px,7vw,88px)', fontWeight:900, textTransform:'uppercase', letterSpacing:'-0.028em', lineHeight:0.93, color:'#ffffff', marginBottom:16 }}>
              ENGINEERED{' '}
              <span style={{ color:'rgba(255,255,255,0.15)', fontWeight:300 }}>SYSTEMS.</span>
            </h1>
            <p style={{ fontFamily:'sans-serif', fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.37)', maxWidth:480, lineHeight:1.65 }}>
              A curated archive of production systems, ML research, and full-stack applications built with precision.
            </p>
          </header>

          {/* Editorial Grid */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div className="proj-row-1">
              <ProjectCard project={projects[0]} index={0} imgHeight={400} />
              <ProjectCard project={projects[1]} index={1} imgHeight={260} />
            </div>

            {/* Connecting telemetry line between project rows */}
            <TelemetryDivider label="TELEMETRY INTERFACE // SYSTEM PIPELINE" code="01" />

            <div className="proj-row-2">
              <ProjectCard project={projects[2]} index={2} imgHeight={260} />
              <ProjectCard project={projects[3]} index={3} imgHeight={400} />
            </div>

            {/* Row 3: Project 05 — same 3fr/2fr layout as Row 1 */}
            {projects[4] && (
              <>
                <TelemetryDivider label="ENTERPRISE INFRASTRUCTURE // LOGISTICS" code="02" />
                <div className="proj-row-1">
                  <ProjectCard project={projects[4]} index={4} imgHeight={400} />
                  {/* Editorial negative space — intentional whitespace */}
                  <div />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <footer style={{ marginTop:60, paddingTop:28, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
            <div>
              <p style={{ fontFamily:'monospace', fontSize:8.5, letterSpacing:'0.2em', color:'rgba(255,255,255,0.16)', textTransform:'uppercase', marginBottom:5 }}>
                Source Repository
              </p>
              <a
                href={portfolioData.links.github}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily:'sans-serif', fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.4)', display:'inline-flex', alignItems:'center', gap:6, textDecoration:'none', transition:'color 0.25s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color='#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)')}
              >
                <Github size={13} />
                github.com/Sudarsonbalu
                <ArrowUpRight size={11} />
              </a>
            </div>
            <Link
              href="/contact"
              prefetch={true}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', border:'1px solid var(--border-accent, rgba(255,30,56,0.35))', color:'var(--theme-color, #ff1e38)', fontFamily:'monospace', fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', textDecoration:'none', transition:'background 0.3s,color 0.3s' }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background='var(--theme-color, #ff1e38)'; el.style.color='#000' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background='transparent'; el.style.color='var(--theme-color, #ff1e38)' }}
            >
              Discuss a Project <ArrowRight size={11} />
            </Link>
          </footer>

        </div>
      </div>
    </>
  )
}
