'use client'

import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { portfolioData } from '../../data/portfolio-data'
import {
  TechnicalCrosshair,
  TelemetryDivider,
  NetworkTopologyGraphic,
} from '../../components/technical-graphics'
import dynamic from 'next/dynamic'

const Contact3DBackground = dynamic(
  () => import('../../components/contact-3d-background'),
  { ssr: false }
)

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  })

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

  const copyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(portfolioData.profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      // 1. First attempt: Use internal Next.js API route
      let res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formState),
      })

      // 2. Fallback attempt: Direct FormSubmit endpoint if API route is unavailable
      if (!res.ok) {
        res = await fetch('https://formsubmit.co/ajax/sudarsonbalu@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            subject: formState.subject,
            message: formState.message,
            _subject: `[Portfolio Inquiry] ${formState.subject} from ${formState.name}`,
            _replyto: formState.email,
            _template: 'table',
            _captcha: 'false',
          }),
        })
      }

      const data = await res.json().catch(() => ({}))

      if (data.success === true || data.success === 'true') {
        setFormSubmitted(true)
      } else if (data.needsActivation) {
        setErrorMessage(data.message)
      } else {
        throw new Error(data.error || data.message || 'Failed to dispatch transmission.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transmission failed. You can also send directly via email client.'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f5f5f7] relative overflow-hidden">
      {/* ── 3D FLOWING SILK RIBBON BACKGROUND LAYER (z-0) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <Contact3DBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/40 to-[#050505] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_40%,transparent_25%,#050505_95%)] pointer-events-none" />
      </div>

      <div className="pt-28 pb-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">
        {/* 1. Header (NO PERSONAL PHOTO) */}
      <section className="mb-20 pb-12 border-b border-white/10 relative">
        <TechnicalCrosshair
          coord="+ 10°51'N / 78°41'E"
          label="INDEX 05 // TRANSMISSION DIRECT"
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
          <span>INDEX 05 // DIRECT COMMUNICATIONS</span>
        </div>

        <h1
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white mb-6 leading-[0.92] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(22px)',
            transitionDelay: '100ms',
          }}
        >
          LET’S <br />
          <span className="text-[#ff1e38] italic">TALK</span>.
        </h1>

        <p
          className="text-neutral-400 font-sans text-base sm:text-xl font-light leading-relaxed max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '200ms',
          }}
        >
          Open for full-time engineering roles, AI research initiatives, and select technical commissions. Reach out directly through the verified communication lines below.
        </p>
      </section>

      {/* 2. Main Grid: Contact Info + Interactive Network Graphic + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Coordinates & Interactive Graphic (5 cols) */}
        <div
          className="lg:col-span-5 space-y-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted || reducedMotion ? 'translateX(0)' : 'translateX(-20px)',
            transitionDelay: '300ms',
          }}
        >
          
          {/* Direct Channels */}
          <div className="space-y-4 font-mono">
            {/* Email */}
            <div className="p-6 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-[#ff1e38]/60 transition-all duration-300 flex items-center justify-between group">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                  DIRECT EMAIL
                </div>
                <a
                  href={`mailto:${portfolioData.profile.email}`}
                  className="text-sm text-white group-hover:text-[#ff1e38] transition-colors relative"
                >
                  <span>{portfolioData.profile.email}</span>
                </a>
              </div>
              <button
                onClick={copyEmail}
                className="p-2.5 rounded-lg border border-white/10 hover:border-[#ff1e38] text-neutral-400 hover:text-white transition-all hover:scale-105"
                title="Copy Email"
                aria-label="Copy Email"
              >
                {copied ? <Check size={14} className="text-[#ff1e38]" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Telephone */}
            <div className="p-6 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-[#ff1e38]/60 transition-all duration-300 flex items-center justify-between group">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                  PHONE / DIRECT
                </div>
                <a
                  href={`tel:${portfolioData.profile.phone.replace(/\s+/g, '')}`}
                  className="text-sm text-white group-hover:text-[#ff1e38] transition-colors"
                >
                  {portfolioData.profile.phone}
                </a>
              </div>
              <a
                href={`tel:${portfolioData.profile.phone.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 rounded text-[11px] tracking-wider border border-[#ff1e38]/40 text-[#ff1e38] hover:bg-[#ff1e38] hover:text-black transition-all"
              >
                CALL
              </a>
            </div>

            {/* Coordinates */}
            <div className="p-6 rounded-xl border border-white/10 bg-[#0a0a0a]">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                LOCATION / TIMEZONE
              </div>
              <div className="font-display text-sm font-bold text-white">
                {portfolioData.profile.location}
              </div>
              <div className="text-xs text-[#ff1e38] mt-1">
                {portfolioData.profile.coordinates} · IST (UTC+05:30)
              </div>
            </div>
          </div>

          {/* Interactive Abstract Communication / Network Graphic */}
          <NetworkTopologyGraphic interactive={true} height={260} />

          {/* Social Profiles with hover indicator lines */}
          <div className="pt-2 flex gap-4 font-mono text-xs">
            <a
              href={portfolioData.links.github}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full border border-white/10 hover:border-[#ff1e38] text-neutral-300 hover:text-white transition-all flex items-center gap-2 group hover:scale-[1.02]"
            >
              <Github size={13} />
              <span>GITHUB</span>
              <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href={portfolioData.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full border border-white/10 hover:border-[#ff1e38] text-neutral-300 hover:text-white transition-all flex items-center gap-2 group hover:scale-[1.02]"
            >
              <Linkedin size={13} />
              <span>LINKEDIN</span>
              <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>

        {/* Right Column: Transmission Dispatch Form (7 cols) */}
        <div
          className="lg:col-span-7 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted || reducedMotion ? 'translateX(0)' : 'translateX(20px)',
            transitionDelay: '380ms',
          }}
        >
          <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="font-mono text-xs tracking-[0.2em] text-[#ff1e38] uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse" />
              <span>SECURE DISPATCH FORM // DIRECT PIPELINE</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mb-2">
              SEND DIRECT TRANSMISSION
            </h2>
            <p className="text-neutral-400 font-sans text-xs sm:text-sm font-light mb-8">
              Dispatch a structured message directly to Sudarson Balakrishnan&apos;s primary engineering inbox.
            </p>

            {formSubmitted ? (
              <div className="p-8 rounded-xl border border-[#ff1e38]/40 bg-[#ff1e38]/5 text-center py-16">
                <div className="w-12 h-12 rounded-full bg-[#ff1e38] text-black flex items-center justify-center mx-auto mb-4 font-bold shadow-[0_0_20px_rgba(255,30,56,0.6)]">
                  <Check size={22} />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  TRANSMISSION DISPATCHED
                </h3>
                <p className="text-neutral-300 text-sm font-sans max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you! Your message has been dispatched directly to Sudarson Balakrishnan&apos;s email (<span className="text-[#ff1e38] font-mono">sudarsonbalu@gmail.com</span>). I will review and respond to you promptly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false)
                    setFormState({ name: '', email: '', subject: 'General Enquiry', message: '' })
                  }}
                  className="px-6 py-2.5 rounded-full border border-white/20 hover:border-[#ff1e38] text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                {errorMessage && (
                  <div className="p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                    <a
                      href={`mailto:${portfolioData.profile.email}?subject=${encodeURIComponent(
                        `[Portfolio] ${formState.subject} - from ${formState.name}`
                      )}&body=${encodeURIComponent(
                        `Name: ${formState.name}\nEmail: ${formState.email}\nSubject: ${formState.subject}\n\nMessage:\n${formState.message}`
                      )}`}
                      className="px-4 py-2 rounded bg-white/10 hover:bg-[#ff1e38] hover:text-black font-mono text-[11px] uppercase tracking-wider text-white transition-all text-center shrink-0"
                    >
                      Open Email App →
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-widest mb-2 text-[10px]">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/10 focus:border-[#ff1e38] text-white font-sans text-sm outline-none transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,30,56,0.2)] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 uppercase tracking-widest mb-2 text-[10px]">
                      YOUR EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="Your Email"
                      className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/10 focus:border-[#ff1e38] text-white font-sans text-sm outline-none transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,30,56,0.2)] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-neutral-400 uppercase tracking-widest mb-2 text-[10px]">
                    SUBJECT
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    disabled={isSubmitting}
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/10 focus:border-[#ff1e38] text-white font-sans text-sm outline-none transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,30,56,0.2)] cursor-pointer disabled:opacity-50"
                  >
                    <option value="General Enquiry" className="bg-[#0a0a0a] text-white">
                      General Enquiry
                    </option>
                    <option value="Hiring" className="bg-[#0a0a0a] text-white">
                      Hiring
                    </option>
                    <option value="Project Development" className="bg-[#0a0a0a] text-white">
                      Project Development
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase tracking-widest mb-2 text-[10px]">
                    YOUR MESSAGE
                  </label>
                  <textarea
                    required
                    rows={5}
                    disabled={isSubmitting}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Your Message..."
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/10 focus:border-[#ff1e38] text-white font-sans text-sm outline-none transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,30,56,0.2)] resize-none disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-full bg-[#ff1e38] hover:bg-white text-black font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,30,56,0.3)] hover:scale-[1.01] active:scale-[0.99] ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  data-cursor="project"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>DISPATCHING TRANSMISSION...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>TRANSMIT MESSAGE →</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
