'use client'

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

interface ProjectCardVisualProps {
  slug: string
  className?: string
  isHovered?: boolean
}

export function ProjectCardVisual({ slug, className, isHovered }: ProjectCardVisualProps) {
  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden transition-all duration-700 ease-out',
        className
      )}
      style={{
        filter: 'hue-rotate(var(--theme-hue-rotate, 0deg))',
      }}
    >
      {/* Dynamic scan-line overlay on hover */}
      <div
        className={cn(
          'absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          backgroundColor: 'rgba(var(--theme-color-rgb, 255, 30, 56), 0.05)',
        }}
      />

      {/* Grid overlay */}
      <div
        className={cn(
          'absolute inset-0 z-10 pointer-events-none transition-opacity duration-500',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(var(--theme-color-rgb, 255,30,56), 0.06) 0px, rgba(var(--theme-color-rgb, 255,30,56), 0.06) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(var(--theme-color-rgb, 255,30,56), 0.06) 0px, rgba(var(--theme-color-rgb, 255,30,56), 0.06) 1px, transparent 1px, transparent 32px)',
        }}
      />

      {slug === 'medi-nexus' && <MediNexusVisual isHovered={isHovered} />}
      {slug === 'codeguardian' && <CodeGuardianVisual isHovered={isHovered} />}
      {slug === 'turbofan-rul' && <TurbofanVisual isHovered={isHovered} />}
      {slug === 'ibpfm-mission' && <IBPFMVisual isHovered={isHovered} />}
    </div>
  )
}

/* ─────────────────────────────────────────
   01 — MEDI NEXUS
   Healthcare AI data flow: patient nodes
   routing through an AI clinical pipeline
───────────────────────────────────────── */
function MediNexusVisual({ isHovered }: { isHovered?: boolean }) {
  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ background: '#070809' }}
    >
      <defs>
        <radialGradient id="mn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff1e38" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#070809" stopOpacity="0" />
        </radialGradient>
        <filter id="mn-blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="mn-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff1e38" stopOpacity="0" />
          <stop offset="50%" stopColor="#ff1e38" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff1e38" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="300" cy="190" rx="220" ry="140" fill="url(#mn-glow)" filter="url(#mn-blur)" />

      {/* Background grid lines */}
      {[60, 120, 180, 240, 300, 360].map((y) => (
        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="380" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Central AI Core Hexagon */}
      <polygon
        points="300,110 340,132 340,178 300,200 260,178 260,132"
        fill="none"
        stroke={isHovered ? '#ff1e38' : 'rgba(255,255,255,0.25)'}
        strokeWidth={isHovered ? '1.5' : '1'}
        style={{ transition: 'stroke 0.5s, stroke-width 0.5s' }}
      />
      <polygon
        points="300,122 330,138 330,172 300,188 270,172 270,138"
        fill="rgba(255,30,56,0.07)"
        stroke="rgba(255,30,56,0.3)"
        strokeWidth="0.5"
      />
      <text x="300" y="158" textAnchor="middle" fill="#ff1e38" fontSize="9" fontFamily="monospace" letterSpacing="2">
        GEMINI
      </text>
      <text x="300" y="172" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace" letterSpacing="1">
        AI CORE
      </text>

      {/* Patient nodes — left side */}
      {[
        { cx: 90, cy: 130, label: 'PT-001' },
        { cx: 90, cy: 190, label: 'PT-442' },
        { cx: 90, cy: 250, label: 'PT-783' },
      ].map(({ cx, cy, label }) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="5" fill="rgba(255,255,255,0.4)" />
          <text x={cx} y={cy + 30} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">
            {label}
          </text>
          {/* Flow line to center */}
          <line
            x1={cx + 18}
            y1={cy}
            x2="258"
            y2="155"
            stroke="url(#mn-line)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        </g>
      ))}

      {/* Doctor / DB nodes — right side */}
      {[
        { cx: 510, cy: 130, label: 'DR PORTAL', shape: 'rect' },
        { cx: 510, cy: 200, label: 'MySQL DB', shape: 'rect' },
        { cx: 510, cy: 270, label: 'JWT AUTH', shape: 'rect' },
      ].map(({ cx, cy, label }) => (
        <g key={label}>
          <rect x={cx - 28} y={cy - 16} width="56" height="32" rx="4"
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x={cx} y={cy + 4} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="monospace" letterSpacing="0.5">
            {label}
          </text>
          <line
            x1={cx - 28}
            y1={cy}
            x2="342"
            y2="155"
            stroke="url(#mn-line)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        </g>
      ))}

      {/* FastAPI label bottom */}
      <text x="300" y="345" textAnchor="middle" fill="rgba(255,30,56,0.5)" fontSize="8" fontFamily="monospace" letterSpacing="3">
        FASTAPI · REST · ASYNC
      </text>

      {/* Scan line */}
      <line x1="0" y1="190" x2="600" y2="190"
        stroke={isHovered ? 'rgba(255,30,56,0.15)' : 'rgba(255,30,56,0.06)'}
        strokeWidth="1"
        style={{ transition: 'stroke 0.5s' }}
      />
    </svg>
  )
}

/* ─────────────────────────────────────────
   02 — CODEGUARDIAN
   AST security network: code nodes, edges,
   vulnerability markers, patch flow
───────────────────────────────────────── */
function CodeGuardianVisual({ isHovered }: { isHovered?: boolean }) {
  const nodes = [
    { cx: 300, cy: 180, r: 28, main: true },
    { cx: 160, cy: 100, r: 14 },
    { cx: 440, cy: 100, r: 14 },
    { cx: 120, cy: 220, r: 10 },
    { cx: 200, cy: 280, r: 10 },
    { cx: 400, cy: 280, r: 10 },
    { cx: 480, cy: 220, r: 10 },
    { cx: 300, cy: 330, r: 10 },
    { cx: 95, cy: 155, r: 7 },
    { cx: 505, cy: 155, r: 7 },
  ]
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2],
    [1, 8], [2, 9], [3, 4], [5, 6], [4, 7], [5, 7],
  ]

  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ background: '#070809' }}>
      <defs>
        <radialGradient id="cg-glow" cx="50%" cy="48%" r="45%">
          <stop offset="0%" stopColor="#ff1e38" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#070809" stopOpacity="0" />
        </radialGradient>
        <filter id="cg-blur"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      <ellipse cx="300" cy="185" rx="230" ry="150" fill="url(#cg-glow)" filter="url(#cg-blur)" />

      {/* Background */}
      {[50, 100, 150, 200, 250, 300, 350].map(y => (
        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}

      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke={isHovered ? 'rgba(255,30,56,0.3)' : 'rgba(255,255,255,0.1)'}
          strokeWidth="1"
          style={{ transition: 'stroke 0.5s' }}
        />
      ))}

      {/* Vulnerability marker — highlight one node */}
      <circle cx={nodes[3].cx} cy={nodes[3].cy} r="18" fill="rgba(255,30,56,0.1)" stroke="#ff1e38" strokeWidth="1" strokeDasharray="3 2" />
      <text x={nodes[3].cx} y={nodes[3].cy - 22} textAnchor="middle" fill="#ff1e38" fontSize="7" fontFamily="monospace">CWE-89</text>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          {n.main ? (
            <>
              <circle cx={n.cx} cy={n.cy} r={n.r + 8} fill="rgba(255,30,56,0.06)" />
              <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(20,12,14,0.9)" stroke={isHovered ? '#ff1e38' : 'rgba(255,255,255,0.25)'} strokeWidth={isHovered ? '1.5' : '1'} style={{ transition: 'stroke 0.4s' }} />
              <text x={n.cx} y={n.cy - 4} textAnchor="middle" fill="#ff1e38" fontSize="8" fontFamily="monospace">GUARD</text>
              <text x={n.cx} y={n.cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6.5" fontFamily="monospace">CORE</text>
            </>
          ) : (
            <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          )}
        </g>
      ))}

      {/* Patch label */}
      <rect x="232" y="346" width="136" height="22" rx="3" fill="rgba(255,30,56,0.08)" stroke="rgba(255,30,56,0.3)" strokeWidth="1" />
      <text x="300" y="361" textAnchor="middle" fill="rgba(255,30,56,0.7)" fontSize="7.5" fontFamily="monospace" letterSpacing="2">
        OPENAI · AST ANALYSIS
      </text>

      {/* Scan line */}
      <line x1="0" y1="190" x2="600" y2="190"
        stroke={isHovered ? 'rgba(255,30,56,0.12)' : 'rgba(255,30,56,0.04)'}
        strokeWidth="1"
        style={{ transition: 'stroke 0.5s' }}
      />
    </svg>
  )
}

/* ─────────────────────────────────────────
   03 — TURBOFAN RUL
   Sensor degradation curve: waveform +
   health indicator bars + threshold line
───────────────────────────────────────── */
function TurbofanVisual({ isHovered }: { isHovered?: boolean }) {
  // Simulate a degradation curve: starts high, drops toward failure
  const points = Array.from({ length: 42 }, (_, i) => {
    const x = 60 + i * 12
    const base = 280 - i * 3.4
    const noise = Math.sin(i * 0.7) * 8 + Math.sin(i * 1.4) * 4
    const y = Math.max(100, base + noise)
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `60,310 ${points} ${60 + 41 * 12},310`

  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ background: '#070809' }}>
      <defs>
        <linearGradient id="tf-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff1e38" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ff1e38" stopOpacity="0" />
        </linearGradient>
        <filter id="tf-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {[100, 150, 200, 250, 310].map(y => (
        <line key={y} x1="60" y1={y} x2="555" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {[60, 150, 250, 350, 450, 555].map(x => (
        <line key={x} x1={x} y1="80" x2={x} y2="320" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}

      {/* Y-axis */}
      <line x1="60" y1="80" x2="60" y2="320" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* X-axis */}
      <line x1="60" y1="310" x2="555" y2="310" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#tf-fill)" />

      {/* Degradation curve */}
      <polyline
        points={points}
        fill="none"
        stroke={isHovered ? '#ff1e38' : 'rgba(255,30,56,0.7)'}
        strokeWidth={isHovered ? '2' : '1.5'}
        filter={isHovered ? 'url(#tf-glow)' : undefined}
        style={{ transition: 'stroke 0.4s, stroke-width 0.4s' }}
      />

      {/* Failure threshold horizontal line */}
      <line x1="60" y1="112" x2="555" y2="112"
        stroke={isHovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)'}
        strokeWidth="1"
        strokeDasharray="6 4"
        style={{ transition: 'stroke 0.5s' }}
      />
      <text x="562" y="116" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace">FAIL</text>

      {/* Current position marker */}
      <circle cx="437" cy="165" r="5" fill="#ff1e38" />
      <line x1="437" y1="165" x2="437" y2="310" stroke="rgba(255,30,56,0.25)" strokeWidth="1" strokeDasharray="3 2" />
      <text x="420" y="150" fill="#ff1e38" fontSize="7.5" fontFamily="monospace">NOW</text>

      {/* Labels */}
      <text x="60" y="340" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace">CYCLE 0</text>
      <text x="490" y="340" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace">CYCLE 252</text>
      <text x="24" y="116" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace" transform="rotate(-90 24 116)">HEALTH</text>

      {/* Sensor bars bottom */}
      {['T24', 'T30', 'P30', 'Nf', 'Ps30'].map((label, i) => {
        const bx = 85 + i * 97
        const bh = 20 + i * 8
        return (
          <g key={label}>
            <rect x={bx} y={310 - bh} width="18" height={bh} rx="2"
              fill={isHovered ? 'rgba(255,30,56,0.3)' : 'rgba(255,30,56,0.15)'}
              style={{ transition: 'fill 0.4s' }}
            />
            <text x={bx + 9} y="330" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="monospace">{label}</text>
          </g>
        )
      })}

      <text x="300" y="368" textAnchor="middle" fill="rgba(255,30,56,0.45)" fontSize="7.5" fontFamily="monospace" letterSpacing="2">
        NASA C-MAPSS · RUL REGRESSION · 21 SENSORS
      </text>
    </svg>
  )
}

/* ─────────────────────────────────────────
   04 — IBPFM MISSION
   Environmental heatmap topology:
   geographic nodes, pollution density rings
───────────────────────────────────────── */
function IBPFMVisual({ isHovered }: { isHovered?: boolean }) {
  const hotspots = [
    { cx: 200, cy: 160, r: 45, intensity: 0.5 },
    { cx: 360, cy: 200, r: 60, intensity: 0.7 },
    { cx: 280, cy: 270, r: 35, intensity: 0.35 },
    { cx: 460, cy: 140, r: 30, intensity: 0.45 },
    { cx: 140, cy: 260, r: 28, intensity: 0.3 },
  ]

  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ background: '#070809' }}>
      <defs>
        {hotspots.map((h, i) => (
          <radialGradient key={i} id={`hs-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff1e38" stopOpacity={h.intensity} />
            <stop offset="100%" stopColor="#ff1e38" stopOpacity="0" />
          </radialGradient>
        ))}
        <filter id="hs-blur"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>

      {/* Base map grid */}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`h${i}`} x1="40" y1={40 + i * 26} x2="560" y2={40 + i * 26}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {Array.from({ length: 20 }, (_, i) => (
        <line key={`v${i}`} x1={40 + i * 28} y1="40" x2={40 + i * 28} y2="340"
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Heatmap blobs */}
      {hotspots.map((h, i) => (
        <g key={i}>
          <ellipse cx={h.cx} cy={h.cy} rx={h.r * 1.8} ry={h.r * 1.4}
            fill={`url(#hs-${i})`} filter="url(#hs-blur)"
          />
          <circle cx={h.cx} cy={h.cy} r={8}
            fill={isHovered ? '#ff1e38' : 'rgba(255,30,56,0.8)'}
            style={{ transition: 'fill 0.4s' }}
          />
          <circle cx={h.cx} cy={h.cy} r={isHovered ? h.r * 0.6 : h.r * 0.4}
            fill="none" stroke="rgba(255,30,56,0.25)" strokeWidth="1" strokeDasharray="4 3"
            style={{ transition: 'r 0.5s' }}
          />
        </g>
      ))}

      {/* Connection lines between hotspots */}
      {[[0, 1], [1, 2], [2, 0], [1, 3], [2, 4]].map(([a, b], i) => (
        <line
          key={i}
          x1={hotspots[a].cx} y1={hotspots[a].cy}
          x2={hotspots[b].cx} y2={hotspots[b].cy}
          stroke={isHovered ? 'rgba(255,30,56,0.25)' : 'rgba(255,30,56,0.1)'}
          strokeWidth="1" strokeDasharray="5 3"
          style={{ transition: 'stroke 0.5s' }}
        />
      ))}

      {/* Coordinate markers */}
      <text x="55" y="360" fill="rgba(255,255,255,0.2)" fontSize="6.5" fontFamily="monospace">10°51'N · 78°41'E</text>
      <text x="400" y="360" fill="rgba(255,255,255,0.2)" fontSize="6.5" fontFamily="monospace">TIRUCHIRAPPALLI ZONE</text>

      {/* AQI Indicator */}
      <rect x="470" y="48" width="80" height="36" rx="3"
        fill="rgba(255,30,56,0.08)" stroke="rgba(255,30,56,0.3)" strokeWidth="1"
      />
      <text x="510" y="64" textAnchor="middle" fill="#ff1e38" fontSize="10" fontFamily="monospace" fontWeight="bold">AQI 72</text>
      <text x="510" y="76" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="6.5" fontFamily="monospace">MODERATE</text>

      <text x="300" y="368" textAnchor="middle" fill="rgba(255,30,56,0.45)" fontSize="7.5" fontFamily="monospace" letterSpacing="2">
        GEMINI AI · HEATMAP ENGINE · PHP + MYSQL
      </text>
    </svg>
  )
}
