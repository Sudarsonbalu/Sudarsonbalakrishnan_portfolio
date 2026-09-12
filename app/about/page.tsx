'use client'

import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  GraduationCap,
  Layers,
  MapPin,
  Server,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { portfolioData } from '../../data/portfolio-data'
import { TechnicalCrosshair, TelemetryDivider } from '../../components/technical-graphics'

// Dynamically import Three.js liquid-metal ribbon component (client-only, no SSR)
const About3DBackground = dynamic(
  () => import('../../components/about-3d-background'),
  { ssr: false }
)

export default function AboutPage() {
  const academicTimeline = [
    {
      date: '04.03.2006',
      title: 'BORN',
      subtitle: 'Tiruchirappalli, Tamil Nadu, India',
      description: 'Foundational upbringing with early passion for computers, mathematics, and logic.',
      highlight: false,
    },
    {
      date: '2023',
      title: 'HIGHER SECONDARY SCHOOL COMPLETED — 66%',
      subtitle: 'Akkv Aarnadu Matric Higher Secondary School',
      description: 'Completed higher secondary education in science and mathematics stream in Tiruchirappalli.',
      highlight: false,
    },
    {
      date: '06.09.2023',
      title: 'COLLEGE JOURNEY BEGINS — B.TECH AI & DATA SCIENCE',
      subtitle: 'VSB College of Engineering Technical Campus, Coimbatore',
      description: 'Commenced undergraduate engineering program in Artificial Intelligence & Data Science.',
      highlight: true,
    },
    {
      date: '2023 – 2024',
      title: 'FIRST YEAR — FOUNDATIONS & CORE CODING',
      subtitle: 'Algorithmic Problem Solving & Web Development',
      description: 'Completed Tech Volt Software Front-End Development Internship (February 2024) and won 2nd Prize in Sparkathon-2K24 Hackathon.',
      highlight: false,
    },
    {
      date: '2024 – 2025',
      title: 'SECOND YEAR — RESEARCH & PREDICTIVE SYSTEMS',
      subtitle: 'Machine Learning & Intellectual Property',
      description: 'Filed Smart Dustbin IoT System Patent. Published cybersecurity research in IJCRT. Presented research paper at NCRPAIDST-2K25 National Conference.',
      highlight: true,
    },
    {
      date: '2025 – 2026',
      title: 'THIRD YEAR — PRODUCTION FULL-STACK & ENTERPRISE',
      subtitle: 'FastAPI, Next.js & ServiceNow Enterprise Cloud',
      description: 'Architected MEDI NEXUS and CODEGUARDIAN. Completed ServiceNow Virtual Internship (March 2026). Maintained 8.45 / 10 cumulative GPA.',
      highlight: true,
    },
    {
      date: '2026',
      title: 'FINAL YEAR — NOW',
      subtitle: 'Autonomous Systems & Professional Engagements',
      description: 'Graduating senior actively available for full-time AI/ML engineering roles, software commissions, and research partnerships.',
      highlight: true,
    },
  ]

  const skillGroups = [
    {
      title: 'Programming Languages',
      skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'PHP', 'SQL'],
    },
    {
      title: 'Frameworks & Libraries',
      skills: ['FastAPI', 'Next.js', 'React', 'Scikit-Learn', 'Pandas', 'NumPy', 'OpenCV', 'Matplotlib'],
    },
    {
      title: 'AI, ML & Neural APIs',
      skills: ['Machine Learning', 'Computer Vision', 'Gemini API', 'OpenAI API', 'OpenRouter', 'Predictive Modeling'],
    },
    {
      title: 'Databases & Storage',
      skills: ['PostgreSQL', 'MySQL', 'Relational Schemas', 'Query Tuning'],
    },
    {
      title: 'Platforms & Tools',
      skills: ['Git', 'VS Code', 'Jupyter Notebook', 'Power BI', 'Cursor AI', 'Antigravity', 'ServiceNow'],
    },
  ]

  // ── Timeline Animation State ─────────────────────────────
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const entryRefs            = useRef<(HTMLDivElement | null)[]>([])
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    () => new Array(academicTimeline.length).fill(false)
  )
  const [lineProgress,   setLineProgress]   = useState(0)
  const [reducedMotion,  setReducedMotion]  = useState(false)
  const [scrollY,        setScrollY]        = useState(0)

  // Track scroll for subtle 3D background parallax
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  // Derived — highest visible entry = active
  const activeIndex = inViewStates.lastIndexOf(true)

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // Scroll-tracked red progress line
  useEffect(() => {
    const onScroll = () => {
      const el = timelineContainerRef.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      setLineProgress(Math.max(0, Math.min(1, (window.innerHeight * 0.65 - top) / height)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Per-entry IO — REVERSIBLE (entries fade back when scrolled out)
  useEffect(() => {
    const obs: IntersectionObserver[] = []
    entryRefs.current.forEach((el, idx) => {
      if (!el) return
      const o = new IntersectionObserver(
        ([entry]) => {
          setInViewStates(prev => {
            if (prev[idx] === entry.isIntersecting) return prev
            const next = [...prev]; next[idx] = entry.isIntersecting; return next
          })
        },
        { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
      )
      o.observe(el)
      obs.push(o)
    })
    return () => obs.forEach(o => o.disconnect())
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f5f5f7]">
      <div className="pt-28 pb-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        {/* 1. Page Header (NO PHOTO) */}
      <section className="mb-20 pb-12 border-b border-white/10 relative">
        <TechnicalCrosshair
          coord="+ 10°51'N / 78°41'E"
          label="INDEX 02 // IDENTITY & CV"
          className="mb-6"
        />

        <div className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
          <span>CURRICULUM VITAE &amp; RESEARCH DIRECTORY</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white mb-6">
          ENGINEERING <br />
          <span className="text-neutral-400 font-light">WITH ANALYTICAL RIGOR.</span>
        </h1>

        <div className="text-neutral-300 font-sans text-base sm:text-xl font-light leading-relaxed max-w-3xl space-y-4">
          <p className="text-white font-medium">
            AI &amp; Data Science Student | Aspiring Software Development Engineer | Python Developer.
          </p>
          <p>
            I build{' '}
            <span className="text-white font-medium border-b border-[#ff1e38] pb-0.5">AI-powered web systems</span>,{' '}
            backend solutions, and data analytics products with a research-first engineering mindset. Focused on intelligent applications,{' '}
            <span className="text-white font-medium border-b border-[#ff1e38] pb-0.5">scalable web development</span>,{' '}
            automation, and turning data into practical insights.
          </p>
        </div>
      </section>

      {/* 2. Abstract Academic Data Visualization Graphic */}
      <section className="mb-24 p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden group">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-[#ff1e38] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
              <span>ACADEMIC TELEMETRY METRIC // B.TECH AI &amp; DS</span>
            </div>
            <div className="font-display text-xl font-bold text-white mt-1">
              VSB College of Engineering Technical Campus
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-neutral-400">
            <div>
              SCORE: <span className="text-[#ff1e38] font-bold">8.45 / 10 GPA</span>
            </div>
            <div>
              PROGRAM: <span className="text-white">B.Tech AI &amp; DS</span>
            </div>
          </div>
        </div>

        {/* Minimal Geometric Data Bar Graphic */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span className="flex items-center gap-2">
              <span className="text-[#ff1e38]">●</span>
              <span>Degree Progression (2023 – 2027)</span>
            </span>
            <span className="text-[#ff1e38] font-bold">75% Completed (Final Year)</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#ff1e38] via-[#ff1e38] to-white rounded-full transition-all duration-1000 ease-out"
              style={{ width: '75%', boxShadow: '0 0 12px rgba(255, 30, 56, 0.5)' }}
            />
          </div>
        </div>
      </section>

      {/* 3. Editorial Academic Journey Timeline with 3D Technical Background */}
      <section className="mb-24 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#07080a]/90 p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* ── 3D TECHNICAL ENVIRONMENT BACKGROUND LAYER ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Far background: very subtle dark theme ambient glow */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none transition-colors duration-700"
            style={{
              background: 'radial-gradient(circle at 50% 45%, var(--theme-color, #ff1e38) 0%, transparent 68%)',
              filter: 'blur(100px)',
            }}
          />

          {/* Far background: subtle technical isometric datum grid */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          {/* 3D Liquid Metal Ribbon Sculpture (Canvas) */}
          <div className="absolute inset-0 opacity-75 md:opacity-85 lg:opacity-95 transition-opacity duration-500">
            <About3DBackground scrollY={scrollY} reducedMotion={reducedMotion} />
          </div>

          {/* Middle layer: High readability gradients & vignette
              Guarantees timeline text, dates, nodes and progress line remain 100% crisp and readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07080a] via-[#07080a]/40 to-[#07080a] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_50%,transparent_20%,#07080a_95%)] pointer-events-none" />
          <div className="hidden lg:block absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#07080a]/90 to-transparent pointer-events-none" />
          <div className="hidden lg:block absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#07080a]/90 to-transparent pointer-events-none" />
        </div>

        {/* ── FOREGROUND TIMELINE CONTENT (z-10, clean & readable) ── */}
        <div className="relative z-10">
          <div className="mb-12">
            <div
              className="font-mono text-xs tracking-[0.2em] uppercase mb-2 flex items-center gap-2"
              style={{ color: 'var(--theme-color, #ff1e38)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }}
              />
              <span>CHRONOLOGICAL TRAJECTORY // 2006 — PRESENT</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
              ACADEMIC &amp; MILESTONE TIMELINE
            </h2>
          </div>

          <div ref={timelineContainerRef} className="relative">

            {/* ── Gray base line — left on mobile, centered on desktop ── */}
            <div className="absolute top-0 bottom-0 w-px bg-white/10
                            left-[5.5px] lg:left-1/2 lg:-translate-x-px pointer-events-none" />

            {/* ── Animated progress line ── */}
            <div
              className="absolute top-0 w-px pointer-events-none
                          left-[5.5px] lg:left-1/2 lg:-translate-x-px"
              style={{
                backgroundColor: 'var(--theme-color, #ff1e38)',
                height:     `${reducedMotion ? 0 : lineProgress * 100}%`,
              transition: reducedMotion ? 'none' : 'height 0.1s linear',
              boxShadow:  lineProgress > 0.02 ? '0 0 6px var(--theme-glow, rgba(255,30,56,0.4))' : 'none',
            }}
          />

          {/* ── Entries ── */}
          <div className="space-y-10 lg:space-y-16">
            {academicTimeline.map((item, idx) => {
              const isLeft   = idx % 2 === 0   // desktop: left side of center line
              const revealed = reducedMotion || inViewStates[idx]
              const isActive = activeIndex === idx

              // Per-element stagger (relative to entry entering viewport)
              const sd = (ms: number): string =>
                reducedMotion ? '0ms' : `${ms}ms`

              // Node styles — shared by both layouts
              const nodeSx: React.CSSProperties = {
                borderColor:     isActive
                  ? 'var(--theme-color, #ff1e38)'
                  : revealed
                    ? item.highlight ? 'var(--theme-color, #ff1e38)' : 'rgba(255,255,255,0.28)'
                    : '#374151',
                backgroundColor: revealed && (isActive || item.highlight) ? 'var(--theme-color, #ff1e38)' : '#050505',
                boxShadow:       isActive
                  ? '0 0 0 4px var(--theme-dim, rgba(255,30,56,0.1)), 0 0 12px var(--theme-glow, rgba(255,30,56,0.5))'
                  : item.highlight && revealed ? '0 0 6px var(--theme-glow, rgba(255,30,56,0.3))' : 'none',
                transform:       `scale(${revealed ? 1 : 0.55})`,
                transition:      reducedMotion
                  ? 'all 0.3s'
                  : `transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${sd(60)},
                     border-color 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease`,
              }

              // Content block — renders date/title/subtitle/description
              // dir: 'left' aligns text right (for left entries), 'right' aligns left
              const content = (dir: 'left' | 'right') => (
                <div className={dir === 'left' ? 'lg:text-right' : ''}>
                  {/* Date */}
                  <div
                    className="font-mono text-xs tracking-widest mb-1"
                    style={{
                      color:      isActive ? 'var(--theme-color, #ff1e38)' : 'var(--theme-color, #ff1e38)',
                      opacity:    revealed ? (isActive ? 1 : 0.75) : 0,
                      transform:  revealed ? 'translateY(0)' : 'translateY(8px)',
                      transition: reducedMotion
                        ? 'all 0.3s'
                        : `opacity 0.4s ease ${sd(0)}, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${sd(0)}, color 0.3s`,
                    }}
                  >
                    {item.date}
                  </div>
                  {/* Title */}
                  <h3
                    className="font-display text-lg sm:text-xl font-bold uppercase mb-1"
                    style={{
                      color:      isActive ? '#ffffff' : revealed ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
                      opacity:    revealed ? 1 : 0,
                      transform:  revealed ? 'translateY(0)' : 'translateY(8px)',
                      transition: reducedMotion
                        ? 'all 0.3s'
                        : `opacity 0.4s ease ${sd(90)}, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${sd(90)}, color 0.3s`,
                    }}
                  >
                    {item.title}
                  </h3>
                  {/* Subtitle */}
                  <div
                    className="font-mono text-xs text-neutral-400 mb-2"
                    style={{
                      opacity:    revealed ? 0.75 : 0,
                      transform:  revealed ? 'translateY(0)' : 'translateY(8px)',
                      transition: reducedMotion
                        ? 'opacity 0.3s'
                        : `opacity 0.4s ease ${sd(170)}, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${sd(170)}`,
                    }}
                  >
                    {item.subtitle}
                  </div>
                  {/* Description */}
                  <p
                    className="font-sans text-sm leading-relaxed font-light text-neutral-400 max-w-xs"
                    style={{
                      opacity:    revealed ? 0.65 : 0,
                      transform:  revealed ? 'translateY(0)' : 'translateY(8px)',
                      transition: reducedMotion
                        ? 'opacity 0.3s'
                        : `opacity 0.4s ease ${sd(240)}, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${sd(240)}`,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              )

              return (
                <div
                  key={idx}
                  ref={el => { entryRefs.current[idx] = el }}
                  className={`relative
                    flex items-start
                    lg:grid lg:grid-cols-[1fr_24px_1fr] lg:items-start
                  `}
                >
                  {/* ── NODE ──
                      Mobile:  absolute, pinned to left-[5.5px], out of flex flow
                      Desktop: in-flow grid item in center column              */}
                  <div
                    className={`
                      absolute top-1.5 w-3 h-3 rounded-full border-2 z-10
                      left-[5.5px] -translate-x-1/2
                      lg:static lg:translate-x-0
                      lg:col-start-2 lg:justify-self-center lg:mt-[5px]
                    `}
                    style={nodeSx}
                  />

                  {/* ── LEFT CONTENT COLUMN (desktop col-1, right-aligned text) ──
                      Mobile: shown for even entries (isLeft), hidden for odd        */}
                  <div
                    className={`lg:col-start-1 lg:row-start-1 lg:pr-10 ${
                      isLeft ? 'pl-8 lg:pl-0 w-full lg:w-auto' : 'hidden lg:block'
                    }`}
                    style={
                      isLeft ? {
                        opacity:    revealed ? 1 : 0,
                        transform:  revealed
                          ? 'translateX(0)'
                          : reducedMotion ? 'none' : 'translateX(-20px)',
                        transition: reducedMotion
                          ? 'opacity 0.3s'
                          : 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                      } : {}
                    }
                  >
                    {isLeft && content('left')}
                  </div>

                  {/* ── RIGHT CONTENT COLUMN (desktop col-3, left-aligned text) ──
                      Mobile: shown for odd entries (!isLeft), hidden for even       */}
                  <div
                    className={`lg:col-start-3 lg:row-start-1 lg:pl-10 ${
                      !isLeft ? 'pl-8 lg:pl-0 w-full lg:w-auto' : 'hidden lg:block'
                    }`}
                    style={
                      !isLeft ? {
                        opacity:    revealed ? 1 : 0,
                        transform:  revealed
                          ? 'translateX(0)'
                          : reducedMotion ? 'none' : 'translateX(20px)',
                        transition: reducedMotion
                          ? 'opacity 0.3s'
                          : 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                      } : {}
                    }
                  >
                    {!isLeft && content('right')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>

      {/* 4. Integrated Skills Matrix */}
      <section className="mb-24 pt-8">
        <TelemetryDivider label="COMPETENCY MATRIX // 05 DOMAINS" code="02" />

        <div className="mb-12">
          <div className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
            <span>TECHNICAL MATRIX // VERIFIED SKILLS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
            VERIFIED COMPETENCIES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-[#ff1e38] hover:shadow-[0_0_20px_rgba(255,30,56,0.12)] transition-all duration-300 group"
            >
              <h3 className="font-display text-base font-bold uppercase text-white mb-4 flex items-center justify-between">
                <span className="group-hover:text-[#ff1e38] transition-colors">{group.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#ff1e38] group-hover:shadow-[0_0_8px_#ff1e38] transition-all" />
              </h3>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 group-hover:border-white/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Integrated Professional Experience */}
      <section className="mb-24 pt-8">
        <TelemetryDivider label="CAREER TRAJECTORY // PRODUCTION ROLES" code="03" />

        <div className="mb-12">
          <div className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
            <span>INDUSTRY EXPERIENCE // VERIFIED TRACK RECORD</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
            PROFESSIONAL INTERNSHIPS
          </h2>
        </div>

        <div className="space-y-8">
          {portfolioData.experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-[#ff1e38]/50 hover:shadow-[0_0_24px_rgba(255,30,56,0.08)] transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#ff1e38] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <h3 className="font-display text-2xl font-bold uppercase text-white group-hover:text-[#ff1e38] transition-colors">
                  {exp.role}
                </h3>
                <span className="font-mono text-xs text-[#ff1e38] font-bold tracking-wider">
                  {exp.period}
                </span>
              </div>

              <div className="font-mono text-xs text-neutral-400 mb-6">
                {exp.company} · {exp.type}
              </div>

              <div className="space-y-2">
                {exp.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-sm text-neutral-300 font-sans font-light">
                    <span className="w-1 h-1 rounded-full bg-[#ff1e38] mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Navigation Footer to Projects & Contact */}
      <section className="pt-16 border-t border-white/10 flex flex-wrap justify-between items-center gap-6">
        <div>
          <div className="font-mono text-xs text-neutral-500 uppercase mb-1">
            CONTINUE ARCHIVE
          </div>
          <div className="font-display text-xl font-bold text-white">
            EXPLORE PROJECT CASE STUDIES
          </div>
        </div>
        <Link
          href="/projects"
          className="px-8 py-4 rounded-full bg-[#ff1e38] hover:bg-white text-black font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300"
        >
          VIEW PROJECTS [04] →
        </Link>
      </section>
      </div>
    </div>
  )
}
