'use client'

import React, { useEffect, useRef } from 'react'

/**
 * SquareScopeCursor
 * Premium "Square Scope" precision targeting cursor.
 * - Center pinpoint square dot (zero latency tracking)
 * - Stable inner white square and cardinal crosshair ticks
 * - Continuous smoothly rotating outer square corner brackets
 * - Subtle motion trail (ghost scope frames)
 * - Interactive target-lock hover effect with global theme acceleration
 * - Target-lock click pulse ripple
 * - Desktop only, respects prefers-reduced-motion, zero React state re-renders on mousemove
 */
export default function SquareScopeCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const scopeRef = useRef<HTMLDivElement | null>(null)
  const rippleRef = useRef<HTMLDivElement | null>(null)
  const trail1Ref = useRef<HTMLDivElement | null>(null)
  const trail2Ref = useRef<HTMLDivElement | null>(null)

  const mousePos = useRef({ x: -200, y: -200 })
  const scopePos = useRef({ x: -200, y: -200 })
  const trailPos = useRef([
    { x: -200, y: -200 },
    { x: -200, y: -200 },
  ])

  const rafId = useRef<number | null>(null)
  const isHovered = useRef(false)
  const isVisible = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Desktop only: check for fine pointer and absence of touch primary pointer
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (!isFinePointer || isCoarsePointer) return

    // Suppress system cursor globally on both html root and body
    document.documentElement.classList.add('square-scope-active')
    document.body.classList.add('square-scope-active')

    const dot = dotRef.current
    const scope = scopeRef.current
    const ripple = rippleRef.current
    const t1 = trail1Ref.current
    const t2 = trail2Ref.current

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      if (!isVisible.current) {
        isVisible.current = true
        if (dot) dot.style.opacity = '1'
        if (scope) scope.style.opacity = '1'
        if (t1) t1.style.opacity = '0.2'
        if (t2) t2.style.opacity = '0.1'

        scopePos.current = { x: e.clientX, y: e.clientY }
        trailPos.current = [
          { x: e.clientX, y: e.clientY },
          { x: e.clientX, y: e.clientY },
        ]
      }

      // Zero-latency pinpoint center dot
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }

      // Check for interactive targets (links, buttons, inputs, textareas, cards, etc.)
      const target = e.target as HTMLElement | null
      const interactive = target?.closest(
        'a, button, [data-cursor], input, textarea, select, [role="button"], .interactive-hover'
      )

      if (interactive && !isHovered.current) {
        isHovered.current = true
        scope?.classList.add('scope-hover')
        dot?.classList.add('scope-dot-hover')
      } else if (!interactive && isHovered.current) {
        isHovered.current = false
        scope?.classList.remove('scope-hover')
        dot?.classList.remove('scope-dot-hover')
      }
    }

    const onScroll = () => {
      if (!isVisible.current) return
      const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y) as HTMLElement | null
      const interactive = el?.closest(
        'a, button, [data-cursor], input, textarea, select, [role="button"], .interactive-hover'
      )
      if (interactive && !isHovered.current) {
        isHovered.current = true
        scope?.classList.add('scope-hover')
        dot?.classList.add('scope-dot-hover')
      } else if (!interactive && isHovered.current) {
        isHovered.current = false
        scope?.classList.remove('scope-hover')
        dot?.classList.remove('scope-dot-hover')
      }
    }

    const onMouseDown = () => {
      scope?.classList.add('scope-clicking')
    }

    const onMouseUp = () => {
      scope?.classList.remove('scope-clicking')
    }

    const onClick = (e: MouseEvent) => {
      if (!ripple) return
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      ripple.classList.remove('scope-pulse-anim')
      // Trigger reflow to restart CSS keyframe animation
      void ripple.offsetWidth
      ripple.classList.add('scope-pulse-anim')
    }

    const onMouseLeave = () => {
      isVisible.current = false
      if (dot) dot.style.opacity = '0'
      if (scope) scope.style.opacity = '0'
      if (t1) t1.style.opacity = '0'
      if (t2) t2.style.opacity = '0'
    }

    const onMouseEnter = () => {
      isVisible.current = true
      if (dot) dot.style.opacity = '1'
      if (scope) scope.style.opacity = '1'
      if (t1) t1.style.opacity = '0.2'
      if (t2) t2.style.opacity = '0.1'
    }

    // High performance RAF loop with smooth lerp easing for scope and subtle trail
    const loop = () => {
      if (isVisible.current && scope) {
        const mx = mousePos.current.x
        const my = mousePos.current.y
        const sx = scopePos.current.x
        const sy = scopePos.current.y

        // Main scope smooth easing (lerp factor ~0.22)
        const nx = sx + (mx - sx) * 0.22
        const ny = sy + (my - sy) * 0.22
        scopePos.current = { x: nx, y: ny }

        scope.style.transform = `translate3d(${nx}px, ${ny}px, 0) translate(-50%, -50%)`

        // Update trail positions (subtle delayed follower squares)
        const t = trailPos.current
        t[0].x += (nx - t[0].x) * 0.35
        t[0].y += (ny - t[0].y) * 0.35
        t[1].x += (t[0].x - t[1].x) * 0.3
        t[1].y += (t[0].y - t[1].y) * 0.3

        if (t1) {
          t1.style.transform = `translate3d(${t[0].x}px, ${t[0].y}px, 0) translate(-50%, -50%)`
        }
        if (t2) {
          t2.style.transform = `translate3d(${t[1].x}px, ${t[1].y}px, 0) translate(-50%, -50%)`
        }
      }
      rafId.current = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('click', onClick)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId.current = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('square-scope-active')
      document.body.classList.remove('square-scope-active')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('click', onClick)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      {/* 1. Subtle Motion Trail Ghost Frame 2 (Deepest) */}
      <div
        ref={trail2Ref}
        aria-hidden="true"
        className="scope-trail-2 pointer-events-none fixed top-0 left-0 z-[9999995] opacity-0 will-change-transform"
      />

      {/* 2. Subtle Motion Trail Ghost Frame 1 */}
      <div
        ref={trail1Ref}
        aria-hidden="true"
        className="scope-trail-1 pointer-events-none fixed top-0 left-0 z-[9999996] opacity-0 will-change-transform"
      />

      {/* 3. Instantaneous Precision Center Square Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="scope-center-dot pointer-events-none fixed top-0 left-0 z-[9999999] opacity-0 will-change-transform"
      />

      {/* 4. Main Square Scope (Stable Inner Square + Continuous Rotating Outer Brackets) */}
      <div
        ref={scopeRef}
        aria-hidden="true"
        className="scope-container pointer-events-none fixed top-0 left-0 z-[9999998] opacity-0 will-change-transform"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="scope-svg overflow-visible"
        >
          {/* LAYER 1: Subtle Target Reference Ring behind square */}
          <circle
            cx="20"
            cy="20"
            r="14.5"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="0.85"
            strokeDasharray="2 3"
            className="scope-bg-ring"
          />

          {/* LAYER 2: 4 Cardinal Directional Crosshair Ticks (Crisp Pure White) */}
          <line
            x1="20"
            y1="1.5"
            x2="20"
            y2="6.5"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="33.5"
            x2="20"
            y2="38.5"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="1.5"
            y1="20"
            x2="6.5"
            y2="20"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="33.5"
            y1="20"
            x2="38.5"
            y2="20"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* LAYER 3: Stable Inner Precision Square (Bright White, High Contrast) */}
          <rect
            x="13.5"
            y="13.5"
            width="13"
            height="13"
            stroke="#ffffff"
            strokeWidth="1.3"
            fill="none"
            className="scope-inner-square"
          />

          {/* LAYER 4: Continuous Smoothly Rotating Outer Square with 4 Corner Brackets */}
          <g className="scope-rotating-brackets">
            {/* Top-Left Bracket */}
            <path
              d="M 6.5 13.5 L 6.5 6.5 L 13.5 6.5"
              stroke="var(--theme-color, #ff1e38)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="bracket-corner"
            />
            {/* Top-Right Bracket */}
            <path
              d="M 26.5 6.5 L 33.5 6.5 L 33.5 13.5"
              stroke="var(--theme-color, #ff1e38)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="bracket-corner"
            />
            {/* Bottom-Right Bracket */}
            <path
              d="M 33.5 26.5 L 33.5 33.5 L 26.5 33.5"
              stroke="var(--theme-color, #ff1e38)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="bracket-corner"
            />
            {/* Bottom-Left Bracket */}
            <path
              d="M 13.5 33.5 L 6.5 33.5 L 6.5 26.5"
              stroke="var(--theme-color, #ff1e38)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="bracket-corner"
            />
          </g>
        </svg>
      </div>

      {/* 5. Click Target-Lock Pulse Ripple */}
      <div
        ref={rippleRef}
        aria-hidden="true"
        className="scope-ripple pointer-events-none fixed top-0 left-0 z-[9999997] opacity-0 will-change-transform"
      />
    </>
  )
}
