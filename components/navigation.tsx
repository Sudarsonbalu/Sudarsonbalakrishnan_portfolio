'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, Volume2, VolumeX, ArrowUpRight } from 'lucide-react'
import { portfolioData } from '../data/portfolio-data'
import { GlobalThemeSelector } from './theme-provider'

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const playSound = (freq = 440, dur = 0.05) => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new AudioContextClass()
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + dur)
    } catch {}
  }

  const navLinks = [
    { href: '/', label: 'HOME', code: '01' },
    { href: '/about', label: 'ABOUT', code: '02' },
    { href: '/projects', label: 'PROJECTS', code: '03' },
    { href: '/achievements', label: 'ACHIEVEMENTS', code: '04' },
    { href: '/contact', label: 'CONTACT', code: '05' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full h-16 sm:h-20 px-6 sm:px-10 lg:px-16 flex items-center justify-between z-50 bg-[#07080a]/90 backdrop-blur-md border-b border-white/[0.08]">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center group py-1"
          onClick={() => playSound(520)}
          aria-label="Sudarson Balakrishnan Home"
        >
          <div
            className="relative w-11 h-11 sm:w-13 sm:h-13 transition-all duration-500 group-hover:scale-105"
            style={{
              filter: 'hue-rotate(var(--theme-hue-rotate, 0deg))',
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Sudarson Balakrishnan — SB Logo"
              fill
              unoptimized
              className="object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_16px_var(--theme-glow,rgba(255,30,56,0.45))]"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links with animated indicators */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-mono text-xs tracking-[0.14em]">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playSound(480)}
                className={`relative py-2 group transition-all duration-300 flex items-center gap-2 ${
                  active ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {/* Active beacon */}
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block transition-all duration-300 ${
                    active ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-60'
                  }`}
                  style={{
                    backgroundColor: 'var(--theme-color, #ff1e38)',
                    boxShadow: active ? '0 0 8px var(--theme-color, #ff1e38)' : 'none',
                  }}
                />
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>

                {/* Micro underline indicator */}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ease-out ${
                    active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
                  }`}
                  style={{
                    backgroundColor: 'var(--theme-color, #ff1e38)',
                    boxShadow: active ? '0 0 6px var(--theme-color, #ff1e38)' : undefined,
                  }}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right Controls: Global Theme Selector, Audio Toggle & Mobile Menu */}
        <div className="flex items-center gap-3">
          <GlobalThemeSelector />

          <button
            onClick={() => {
              const next = !soundEnabled
              setSoundEnabled(next)
              if (next) playSound(600, 0.08)
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all"
            aria-label="Toggle Audio"
          >
            {soundEnabled ? (
              <Volume2
                size={12}
                className="transition-colors duration-300"
                style={{ color: 'var(--theme-color, #ff1e38)' }}
              />
            ) : (
              <VolumeX size={12} />
            )}
            <span>{soundEnabled ? 'SND ON' : 'SND OFF'}</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => {
              setMenuOpen(!menuOpen)
              playSound(menuOpen ? 340 : 540)
            }}
            className="md:hidden w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-colors"
            aria-label="Open Menu"
          >
            {menuOpen ? (
              <X size={18} style={{ color: 'var(--theme-color, #ff1e38)' }} />
            ) : (
              <Menu size={18} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer with Staggered Link Reveals */}
      <div
        className={`fixed inset-0 z-40 bg-[#07080a]/98 backdrop-blur-2xl flex flex-col justify-between px-8 pt-28 pb-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          menuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-6">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }}
            />
            <span style={{ color: 'var(--theme-color, #ff1e38)' }}>
              NAVIGATION INDEX // ROUTE DIRECTORY
            </span>
          </div>
          {navLinks.map((link, idx) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${idx * 60 + 100}ms` : '0ms',
                  color: active ? 'var(--theme-color, #ff1e38)' : undefined,
                }}
                className={`block font-display text-3xl font-extrabold uppercase tracking-tight transition-all duration-400 ${
                  menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                } ${
                  active ? '' : 'text-neutral-300 hover:text-white hover:translate-x-2'
                }`}
              >
                <span className="font-mono text-xs text-neutral-600 mr-3">{link.code}</span>
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="pt-8 border-t border-white/10 font-mono text-xs text-neutral-500 space-y-2">
          <div>{portfolioData.profile.formalName}</div>
          <div className="text-white">{portfolioData.profile.email}</div>
          <div className="pt-2" style={{ color: 'var(--theme-color, #ff1e38)' }}>
            {portfolioData.profile.coordinates}
          </div>
        </div>
      </div>
    </>
  )
}
