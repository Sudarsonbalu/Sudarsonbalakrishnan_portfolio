'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Technical Corner Crosshair with Coordinates
 */
export function TechnicalCrosshair({
  coord = '+ 10°51\'N / 78°41\'E',
  label = 'SEC.SYS // ACTIVE',
  className = '',
}: {
  coord?: string
  label?: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between font-mono text-[9.5px] text-neutral-600 select-none tracking-wider uppercase ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-bold transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>+</span>
        <span>{coord}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1 h-1 rounded-full transition-colors duration-300" style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }} />
        <span className="text-neutral-500">{label}</span>
      </div>
    </div>
  )
}

/**
 * Animated Technical Divider Line with Micro Tickers
 */
export function TelemetryDivider({
  label,
  code = '00',
}: {
  label?: string
  code?: string
}) {
  return (
    <div className="relative w-full my-8 flex items-center">
      <div className="h-px bg-white/10 flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 w-32 animate-[shimmer_3s_infinite_linear] transition-colors duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--theme-color, #ff1e38), transparent)',
            opacity: 0.35,
          }}
        />
      </div>
      {label && (
        <div className="px-4 font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase flex items-center gap-2">
          <span className="font-bold transition-colors duration-500" style={{ color: 'var(--theme-color, #ff1e38)' }}>
            [{code}]
          </span>
          <span>{label}</span>
        </div>
      )}
      <div className="h-px bg-white/10 flex-1" />
    </div>
  )
}

/**
 * Interactive Network / Communication Topology Graphic
 * Features interactive canvas with responsive nodes, laser connections,
 * and mouse-proximity pulse.
 */
export function NetworkTopologyGraphic({
  interactive = true,
  height = 240,
}: {
  interactive?: boolean
  height?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio)
    let heightPx = (canvas.height = canvas.offsetHeight * window.devicePixelRatio)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      heightPx = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    window.addEventListener('resize', handleResize)

    // Base nodes
    const nodes = [
      { x: 0.18, y: 0.32, label: 'NODE.01', pulse: 0, speed: 0.02 },
      { x: 0.45, y: 0.22, label: 'GATEWAY', pulse: 1.5, speed: 0.015 },
      { x: 0.78, y: 0.35, label: 'HOST.AWS', pulse: 3.0, speed: 0.018 },
      { x: 0.25, y: 0.72, label: 'TELEMETRY', pulse: 0.8, speed: 0.022 },
      { x: 0.54, y: 0.68, label: 'CORE.AI', pulse: 2.2, speed: 0.012, isCore: true },
      { x: 0.82, y: 0.78, label: 'INGEST.DB', pulse: 1.1, speed: 0.025 },
    ]

    const edges = [
      [0, 1],
      [1, 2],
      [0, 3],
      [1, 4],
      [2, 5],
      [3, 4],
      [4, 5],
    ]

    let time = 0

    const render = () => {
      time += 0.03
      ctx.clearRect(0, 0, width, heightPx)

      // Fetch dynamic theme color & rgb from root
      const rootStyles = getComputedStyle(document.documentElement)
      const themeColor = rootStyles.getPropertyValue('--theme-color').trim() || '#ff1e38'
      const themeRgb = rootStyles.getPropertyValue('--theme-color-rgb').trim() || '255, 30, 56'

      // Draw subtle grid dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      const step = 28 * window.devicePixelRatio
      for (let x = step / 2; x < width; x += step) {
        for (let y = step / 2; y < heightPx; y += step) {
          ctx.beginPath()
          ctx.arc(x, y, 1 * window.devicePixelRatio, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw connecting lines
      edges.forEach(([from, to]) => {
        const n1 = nodes[from]
        const n2 = nodes[to]

        // Dynamic mouse attraction
        const mx = mousePos.x
        const my = mousePos.y
        const x1 = (n1.x + (mx - 0.5) * 0.04) * width
        const y1 = (n1.y + (my - 0.5) * 0.04) * heightPx
        const x2 = (n2.x + (mx - 0.5) * 0.04) * width
        const y2 = (n2.y + (my - 0.5) * 0.04) * heightPx

        // Base line
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1 * window.devicePixelRatio
        ctx.setLineDash([4 * window.devicePixelRatio, 4 * window.devicePixelRatio])
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.setLineDash([])

        // Moving data packet animation
        const t = (Math.sin(time + from * 2 + to) + 1) / 2
        const px = x1 + (x2 - x1) * t
        const py = y1 + (y2 - y1) * t

        ctx.beginPath()
        ctx.fillStyle = themeColor
        ctx.shadowColor = themeColor
        ctx.shadowBlur = 6 * window.devicePixelRatio
        ctx.arc(px, py, 1.8 * window.devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw Nodes
      nodes.forEach((n, idx) => {
        const mx = mousePos.x
        const my = mousePos.y
        const nx = (n.x + (mx - 0.5) * 0.04) * width
        const ny = (n.y + (my - 0.5) * 0.04) * heightPx

        // Outer ring
        const r = (n.isCore ? 6 : 4) * window.devicePixelRatio
        ctx.beginPath()
        ctx.strokeStyle = n.isCore ? themeColor : 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth = 1.2 * window.devicePixelRatio
        ctx.fillStyle = '#0a0a0c'
        ctx.arc(nx, ny, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Core center dot
        ctx.beginPath()
        ctx.fillStyle = n.isCore ? themeColor : 'rgba(255, 255, 255, 0.6)'
        ctx.arc(nx, ny, (n.isCore ? 2.5 : 1.5) * window.devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()

        // Subtle pulsing halo animation
        if (n.isCore) {
          const pulseR = r + (Math.sin(time * 2) + 1) * 3 * window.devicePixelRatio
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${themeRgb}, ${Math.max(0.1, 0.35 - (pulseR - r) * 0.05)})`
          ctx.lineWidth = 1 * window.devicePixelRatio
          ctx.arc(nx, ny, pulseR, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Node label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.font = `${8 * window.devicePixelRatio}px JetBrains Mono, monospace`
        ctx.fillText(n.label, nx + 8 * window.devicePixelRatio, ny + 3 * window.devicePixelRatio)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mousePos])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ height }}
      className="relative w-full rounded-xl border border-white/10 bg-[#070709] overflow-hidden group select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Telemetry overlay info */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase tracking-widest pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-ping transition-colors duration-500" style={{ backgroundColor: 'var(--theme-color, #ff1e38)' }} />
          <span className="text-white font-bold">TOPOLOGY // ACTIVE MESH</span>
        </span>
        <span className="text-neutral-400">LATENCY: 1.2ms</span>
      </div>
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[8.5px] text-neutral-600 uppercase pointer-events-none">
        <span>ENCRYPT: AES-GCM-256</span>
        <span>STATUS: SYNCHRONIZED</span>
      </div>
    </div>
  )
}

/**
 * Purposeful Line-Based Abstract Geometric Graphics
 * Strictly engineering / architectural visuals (NO generic clip art)
 */
export function GeometricAchievementGraphic({
  type,
}: {
  type: 'patent' | 'publication' | 'conference' | 'award' | 'certification'
}) {
  const iconStyle = { color: 'var(--theme-color, #ff1e38)' }

  switch (type) {
    case 'patent':
      // Isometric schematic circuit with central angular node
      return (
        <svg className="w-10 h-10 transition-colors duration-500" style={iconStyle} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" fill="currentColor" fillOpacity="0.04" />
          <polygon points="24,12 34,18 34,30 24,36 14,30 14,18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="1.2" />
          <line x1="42" y1="14" x2="34" y2="18" stroke="currentColor" strokeWidth="1.2" />
          <line x1="42" y1="34" x2="34" y2="30" stroke="currentColor" strokeWidth="1.2" />
          <line x1="24" y1="44" x2="24" y2="36" stroke="currentColor" strokeWidth="1.2" />
          <line x1="6" y1="34" x2="14" y2="30" stroke="currentColor" strokeWidth="1.2" />
          <line x1="6" y1="14" x2="14" y2="18" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
        </svg>
      )

    case 'publication':
      // Structural Matrix / Tensor Grid with highlight coordinates
      return (
        <svg className="w-10 h-10 transition-colors duration-500" style={iconStyle} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
          <line x1="6" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="6" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="18" y1="6" x2="18" y2="42" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="30" y1="6" x2="30" y2="42" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="19" y="19" width="10" height="10" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
          <line x1="31" y1="11" x2="37" y2="11" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )

    case 'conference':
      // Radial Frequency Emitter / Radar Waveform
      return (
        <svg className="w-10 h-10 transition-colors duration-500" style={iconStyle} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3" />
          <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
          <line x1="24" y1="6" x2="24" y2="0" stroke="currentColor" strokeWidth="1.5" />
          <line x1="42" y1="24" x2="48" y2="24" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="42" x2="24" y2="48" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6" y1="24" x2="0" y2="24" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )

    case 'award':
      // Geometric Stepped Vertex / Podium Polygon
      return (
        <svg className="w-10 h-10 transition-colors duration-500" style={iconStyle} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="24,6 38,18 32,40 16,40 10,18" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" fill="currentColor" fillOpacity="0.05" />
          <polygon points="24,14 32,22 28,34 20,34 16,22" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="14" x2="24" y2="34" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="24" cy="24" r="2.5" fill="currentColor" />
        </svg>
      )

    case 'certification':
      // Calibration Dual Rings with Metric Marks
      return (
        <svg className="w-10 h-10 transition-colors duration-500" style={iconStyle} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
          <circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
          <line x1="24" y1="2" x2="24" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="42" x2="24" y2="46" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="24" x2="6" y2="24" stroke="currentColor" strokeWidth="1.5" />
          <line x1="42" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
  }
}
