'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [badgeText, setBadgeText] = useState('')
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'project' | 'magnetic'>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Don't activate on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }

      // Check cursor data attribute or interactive elements
      const target = e.target as HTMLElement | null
      const interactiveEl = target?.closest('[data-cursor], a, button, input, select, textarea') as HTMLElement | null

      if (interactiveEl) {
        const type = interactiveEl.getAttribute('data-cursor')
        if (type === 'project' || type === 'view') {
          setCursorState('project')
          setBadgeText('VIEW')
        } else if (type === 'open') {
          setCursorState('project')
          setBadgeText('OPEN')
        } else if (type === 'read') {
          setCursorState('project')
          setBadgeText('READ')
        } else if (type === 'magnetic') {
          setCursorState('magnetic')
          setBadgeText('')
        } else {
          setCursorState('hover')
          setBadgeText('')
        }
      } else {
        setCursorState('default')
        setBadgeText('')
      }
    }

    const onMouseLeave = () => setVisible(false)
    const onMouseEnter = () => setVisible(true)

    // Smooth ring animation loop
    const render = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }
      rafId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={`custom-cursor ${cursorState !== 'default' ? `cursor-${cursorState}` : ''} pointer-events-none fixed inset-0 z-[9999]`}>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
        style={{
          backgroundColor: 'var(--theme-color, #ff1e38)',
          boxShadow: '0 0 10px var(--theme-color, #ff1e38)',
          opacity: cursorState === 'project' ? 0 : 1,
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-[width,height,border-color,background-color] duration-300 ease-out"
        style={{
          width: cursorState === 'project' ? '74px' : cursorState === 'hover' ? '46px' : cursorState === 'magnetic' ? '54px' : '32px',
          height: cursorState === 'project' ? '74px' : cursorState === 'hover' ? '46px' : cursorState === 'magnetic' ? '54px' : '32px',
          borderColor: 'var(--theme-color, #ff1e38)',
          borderWidth: '1px',
          borderStyle: 'solid',
          backgroundColor: cursorState === 'project' ? 'var(--theme-color, #ff1e38)' : cursorState === 'magnetic' ? 'var(--theme-dim, rgba(255, 30, 56, 0.12))' : 'transparent',
          boxShadow: cursorState === 'project' ? '0 0 20px var(--theme-glow, rgba(255, 30, 56, 0.6))' : 'none',
        }}
      >
        {cursorState === 'project' && badgeText && (
          <span className="font-mono text-[10px] font-bold tracking-widest text-black uppercase select-none">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  )
}
