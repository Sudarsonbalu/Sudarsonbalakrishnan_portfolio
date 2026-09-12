'use client'

import React, { useEffect, useRef, useState } from 'react'

const ROLES = [
  'ASPIRING SOFTWARE ENGINEER',
  'FULL-STACK DEVELOPER',
  'PYTHON DEVELOPER',
  'AWS + DATA ANALYTICS',
]

interface RotatingRoleTextProps {
  mounted?: boolean
  reducedMotion?: boolean
  className?: string
}

export function RotatingRoleText({
  mounted = true,
  reducedMotion = false,
  className = '',
}: RotatingRoleTextProps) {
  const [systemReducedMotion, setSystemReducedMotion] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPausedBetween, setIsPausedBetween] = useState(false)
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Respect system prefers-reduced-motion settings
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSystemReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current)
      }
    }
  }, [])

  const effectiveReducedMotion = reducedMotion || systemReducedMotion

  // If reduced motion is active, show the first role statically with no switching
  if (effectiveReducedMotion) {
    return (
      <div
        className={`w-full h-[62px] sm:h-[50px] lg:h-[54px] flex flex-col justify-start select-none ${className}`}
        aria-label="Professional Role: Aspiring Software Engineer"
      >
        <div className="flex items-start sm:items-center gap-3">
          <span
            className="w-2 h-2 rounded-full mt-2.5 sm:mt-0 shrink-0 transition-colors duration-500"
            style={{
              backgroundColor: 'var(--theme-color, #ff1e38)',
              boxShadow: '0 0 10px var(--theme-glow, rgba(255,30,56,0.6))',
            }}
          />
          <span
            className="font-display font-bold uppercase tracking-tight text-white leading-tight whitespace-normal sm:whitespace-nowrap"
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 2.25rem)',
            }}
          >
            {ROLES[0]}
          </span>
        </div>
        <div
          className="w-16 sm:w-20 h-[2px] rounded-full mt-2 ml-5 sm:ml-5"
          style={{
            backgroundColor: 'var(--theme-color, #ff1e38)',
            boxShadow: '0 0 12px var(--theme-glow, rgba(255,30,56,0.5))',
          }}
        />
      </div>
    )
  }

  // Animation end handler: fires strictly when the exit animation finishes
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName !== 'roleTextCycle') return

    // Enter brief pause phase where role has 100% exited
    setIsPausedBetween(true)

    // Wait exactly 150ms before triggering the next role to enter
    pauseTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ROLES.length)
      setIsPausedBetween(false)
    }, 150)
  }

  const currentRole = ROLES[currentIndex]

  return (
    <div
      className={`w-full h-[62px] sm:h-[50px] lg:h-[54px] flex flex-col justify-start select-none ${className}`}
      role="region"
      aria-label="Professional Specializations"
    >
      {/* Screen reader text (accessible, non-intrusive) */}
      <span className="sr-only">
        Active Specialization: {currentRole}. All roles: {ROLES.join(', ')}.
      </span>

      {/* Visual animated display (aria-hidden to avoid screen reader chatter) */}
      <div aria-hidden="true" className="w-full flex items-start sm:items-center gap-3">
        {/* Theme Accent Dot Indicator */}
        <span
          className="w-2 h-2 rounded-full mt-2.5 sm:mt-0 shrink-0 transition-colors duration-500"
          style={{
            backgroundColor: 'var(--theme-color, #ff1e38)',
            boxShadow: '0 0 10px var(--theme-glow, rgba(255,30,56,0.6))',
          }}
        />

        {/* Text mask container */}
        <div className="overflow-hidden py-1 w-full relative">
          {!isPausedBetween && mounted && (
            <div
              key={currentIndex}
              onAnimationEnd={handleAnimationEnd}
              className="animate-role-text inline-block origin-bottom"
            >
              <span
                className="font-display font-bold uppercase tracking-tight text-white leading-tight block whitespace-normal sm:whitespace-nowrap"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 2.25rem)',
                  textShadow: '0 0 30px var(--theme-dim, rgba(255,30,56,0.18))',
                }}
              >
                {currentRole}
              </span>
            </div>
          )}

          {/* Invisible placeholder during pause to guarantee zero layout shift */}
          {isPausedBetween && (
            <div className="invisible py-1">
              <span
                className="font-display font-bold uppercase tracking-tight leading-tight block whitespace-normal sm:whitespace-nowrap"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 2.25rem)',
                }}
              >
                {currentRole}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Theme Accent Reveal Line / Underline */}
      <div className="ml-5 sm:ml-5 overflow-hidden h-[3px] mt-1 flex items-center">
        {!isPausedBetween && mounted && (
          <div
            key={`line-${currentIndex}`}
            className="animate-role-line h-[2px] rounded-full origin-left transition-colors duration-500"
            style={{
              width: '64px',
              backgroundColor: 'var(--theme-color, #ff1e38)',
              boxShadow: '0 0 12px var(--theme-glow, rgba(255,30,56,0.5))',
            }}
          />
        )}
      </div>
    </div>
  )
}
