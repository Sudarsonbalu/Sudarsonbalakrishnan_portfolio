'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// In-memory flag across client-side route navigations
let hasIntroRunInSession = false

export default function WebsiteIntro() {
  // If already played during client-side navigation, don't show
  const [showIntro, setShowIntro] = useState(!hasIntroRunInSession)
  const [step, setStep] = useState(0) // 0: init, 1: HI THIS IS, 2: SB Logo, 3: PORTFOLIO, 4: transition to home
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (hasIntroRunInSession) {
      setShowIntro(false)
      return
    }

    hasIntroRunInSession = true
    setShowIntro(true)

    // Lock page scroll during the short intro
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)

    if (mq.matches) {
      // Reduced motion: instantaneous fade sequence
      const t1 = setTimeout(() => setStep(3), 100)
      const t2 = setTimeout(() => setStep(4), 800)
      const t3 = setTimeout(() => {
        setShowIntro(false)
        document.body.style.overflow = originalOverflow
      }, 1200)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        document.body.style.overflow = originalOverflow
      }
    }

    // STEP 1: Reveal "HI, THIS IS" (at 200ms)
    const t1 = setTimeout(() => setStep(1), 200)

    // STEP 2: Reveal SB Logo in center (at 850ms)
    const t2 = setTimeout(() => setStep(2), 850)

    // STEP 3: Reveal "PORTFOLIO" headline (at 1650ms)
    const t3 = setTimeout(() => setStep(3), 1650)

    // STEP 4: Cinematic transition into Home page (at 2650ms)
    const t4 = setTimeout(() => setStep(4), 2650)

    // STEP 5: Completely unmount intro (at 3550ms)
    const t5 = setTimeout(() => {
      setShowIntro(false)
      document.body.style.overflow = originalOverflow
    }, 3550)

    // Pressing ESC dismisses immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStep(4)
        setTimeout(() => {
          setShowIntro(false)
          document.body.style.overflow = originalOverflow
        }, 250)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const skipIntro = () => {
    setStep(4)
    setTimeout(() => {
      setShowIntro(false)
      document.body.style.overflow = ''
    }, 250)
  }

  if (!showIntro) return null

  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        opacity: step === 4 ? 0 : 1,
        transform: step === 4 ? (reducedMotion ? 'none' : 'scale(1.025)') : 'scale(1)',
        pointerEvents: step === 4 ? 'none' : 'auto',
        transition: reducedMotion
          ? 'opacity 0.4s ease-out'
          : 'opacity 0.9s cubic-bezier(0.76, 0, 0.24, 1), transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
      aria-label="Website Opening Introduction"
    >
      {/* Subtle top & bottom technical framing lines */}
      <div className="absolute top-8 left-8 right-8 flex items-center justify-between text-neutral-600 font-mono text-[10px] tracking-[0.25em] uppercase pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500" style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }} />
          <span>INITIALIZING SYSTEM</span>
        </div>
        <div className="hidden sm:block">
          <span>+ 10°51&apos;N / 78°41&apos;E</span>
        </div>
      </div>

      {/* Center Cinematic Composition:
          HI, THIS IS
             [SB]
          PORTFOLIO
      */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-xl">
        
        {/* STEP 1: "HI, THIS IS" */}
        <div
          className="transition-all"
          style={{
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? 'translateY(0)' : 'translateY(14px)',
            transition: reducedMotion
              ? 'opacity 0.3s ease'
              : 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.38em] text-neutral-300 font-medium uppercase mb-1">
            <span>HI, THIS IS</span>
            <span className="font-bold transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>/</span>
          </div>
        </div>

        {/* STEP 2: SB CROWN LOGO */}
        <div
          className="relative w-28 h-28 sm:w-36 sm:h-36 my-6 sm:my-8 transition-all"
          style={{
            opacity: step >= 2 ? 1 : 0,
            transform:
              step >= 2
                ? 'scale(1) translateY(0)'
                : reducedMotion
                ? 'scale(1)'
                : 'scale(0.85) translateY(10px)',
            filter:
              step >= 2
                ? 'drop-shadow(0 0 24px var(--theme-glow, rgba(255, 30, 56, 0.35))) hue-rotate(var(--theme-hue-rotate, 0deg))'
                : 'drop-shadow(0 0 0px transparent)',
            transition: reducedMotion
              ? 'opacity 0.4s ease'
              : 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease-out',
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Sudarson Balakrishnan — SB Emblem"
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </div>

        {/* STEP 3: "PORTFOLIO" */}
        <div
          className="transition-all"
          style={{
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
            transition: reducedMotion
              ? 'opacity 0.3s ease'
              : 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-[0.22em] text-white uppercase flex items-center justify-center">
            <span>PORTFOLIO</span>
            <span className="font-mono text-2xl sm:text-4xl ml-1 font-bold transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>.</span>
          </h1>
        </div>

      </div>

      {/* Subtle Bottom Bar & Skip Trigger */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between font-mono text-[10px] tracking-widest text-neutral-600">
        <div className="flex items-center gap-2">
          <span>AI &amp; DATA SCIENCE</span>
          <span>·</span>
          <span>SUDARSON BALAKRISHNAN</span>
        </div>
        <button
          onClick={skipIntro}
          className="text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded hover:bg-white/[0.04]"
        >
          <span>SKIP</span>
          <span className="text-neutral-600">[ESC]</span>
          <span className="transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>→</span>
        </button>
      </div>

    </div>
  )
}
