'use client'

/**
 * HireMe3DBackground
 *
 * Premium 3D Topographic / Contour Terrain + Receding Perspective Grid
 * specifically designed as an ambient background layer for the HIRE ME section.
 *
 * Features:
 *  - 3D Digital Topographic Landscape with flowing elevation contours
 *  - Receding perspective engineering datum grid
 *  - Low-contrast dark metallic / charcoal palette (#0b0d13, #191c26)
 *  - 5–15% theme-color highlights (contour peaks, subtle grid line, soft rim lighting)
 *  - Very slow, hypnotic continuous ambient animation
 *  - Subtle mouse parallax on desktop (disabled on touch)
 *  - Section scroll-in transition (visibility & micro-parallax)
 *  - Automatically pauses WebGL renderloop when section is out of viewport (high performance)
 *  - Full prefers-reduced-motion support
 *  - 100% pointer-events: none — zero disruption to foreground clicks or page scroll
 */

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

// ─── Custom Topographic Shader Material ───────────────────────────────────────
function createTerrainMaterial() {
  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vViewPosition;

    uniform float uTime;
    uniform float uReducedMotion;

    // Smooth overlapping harmonic waves for digital engineering topography
    float calculateElevation(vec2 p, float t) {
      float e = 0.0;
      e += sin(p.x * 0.18 + t * 0.14) * cos(p.y * 0.15 + t * 0.10) * 1.6;
      e += sin(p.x * 0.09 - p.y * 0.11 + t * 0.08) * 1.3;
      e += cos(p.x * 0.30 + p.y * 0.22 + t * 0.05) * 0.55;
      return e;
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float t = (uReducedMotion > 0.5) ? 0.0 : uTime;
      
      float elev = calculateElevation(pos.xy, t);
      pos.z += elev;
      vElevation = pos.z;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vViewPosition;

    uniform vec3 uThemeColor;
    uniform float uTime;

    void main() {
      // Depth / Distance fade
      float dist = length(vViewPosition);
      float distFade = smoothstep(36.0, 8.0, dist);

      // Edge falloff on the plane
      float edgeFadeX = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
      float edgeFadeY = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
      float totalFade = distFade * edgeFadeX * edgeFadeY;

      // Base dark charcoal / metallic tone
      vec3 baseColor = vec3(0.04, 0.045, 0.058);

      // Primary Contour lines (topographic isolines)
      float contourVal = fract(vElevation * 0.85);
      float contourLine = smoothstep(0.055, 0.0, abs(contourVal - 0.5) - 0.008);

      // Secondary fine contour lines
      float subVal = fract(vElevation * 3.4);
      float subLine = smoothstep(0.04, 0.0, abs(subVal - 0.5) - 0.004) * 0.45;

      // Higher peaks receive subtle theme color accent (~10% of surface)
      float peakFactor = smoothstep(1.1, 2.6, vElevation);
      vec3 peakAccent = mix(vec3(0.20, 0.23, 0.30), uThemeColor, peakFactor * 0.85);

      // Fine wireframe grid along UV axes (engineering matrix look)
      float uvGridX = smoothstep(0.035, 0.0, abs(fract(vUv.x * 24.0) - 0.5) - 0.002);
      float uvGridY = smoothstep(0.035, 0.0, abs(fract(vUv.y * 18.0) - 0.5) - 0.002);
      float uvGrid = max(uvGridX, uvGridY) * 0.35;

      vec3 color = baseColor;
      // Layer isolines
      color += peakAccent * contourLine * 0.92;
      color += vec3(0.12, 0.14, 0.19) * subLine * 0.6;
      color += vec3(0.10, 0.12, 0.16) * uvGrid * 0.4;

      // Subtle atmospheric rim sheen
      color += uThemeColor * (peakFactor * 0.12);

      float alpha = totalFade * (0.62 + contourLine * 0.38 + uvGrid * 0.12);
      gl_FragColor = vec4(color, alpha);
    }
  `

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uReducedMotion: { value: 0 },
      uThemeColor: { value: new THREE.Color('#ff1e38') },
    },
  })
}

// ─── 3D Topographic Terrain Mesh ──────────────────────────────────────────────
function TopographicTerrain({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const material = useMemo(() => createTerrainMaterial(), [])

  // Update theme color smoothly
  useEffect(() => {
    material.uniforms.uThemeColor.value.set(themeColor)
  }, [themeColor, material])

  useEffect(() => {
    material.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0
  }, [reducedMotion, material])

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    material.uniforms.uTime.value = t
  })

  return (
    // Angled terrain surface extending across the section
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.35, 0, 0]}
      position={[0, -0.6, -1.2]}
      material={material}
    >
      <planeGeometry args={[34, 26, 64, 48]} />
    </mesh>
  )
}

// ─── Receding Perspective Datum Grid ──────────────────────────────────────────
function PerspectiveGrid({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const gridGroup = useRef<THREE.Group>(null!)

  // Build thin grid line segments
  const { lineGeo, accentLineGeo } = useMemo(() => {
    const lines: number[] = []
    const accentLines: number[] = []
    const width = 42
    const depth = 38
    const step = 1.4

    // Longitudinal lines (receding into distance)
    for (let x = -width / 2; x <= width / 2; x += step) {
      const isCenter = Math.abs(x) < 0.1 || Math.abs(x - 7.0) < 0.1 || Math.abs(x + 7.0) < 0.1
      const target = isCenter ? accentLines : lines
      target.push(x, 0, -depth / 2, x, 0, depth / 2)
    }

    // Transverse lines (across width)
    for (let z = -depth / 2; z <= depth / 2; z += step) {
      lines.push(-width / 2, 0, z, width / 2, 0, z)
    }

    const g1 = new THREE.BufferGeometry()
    g1.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))

    const g2 = new THREE.BufferGeometry()
    g2.setAttribute('position', new THREE.Float32BufferAttribute(accentLines, 3))

    return { lineGeo: g1, accentLineGeo: g2 }
  }, [])

  useFrame(({ clock }) => {
    if (reducedMotion || !gridGroup.current) return
    const t = clock.getElapsedTime()
    // Very subtle slow drift through perspective
    gridGroup.current.position.z = -5.0 + Math.sin(t * 0.08) * 0.35
    gridGroup.current.position.y = -3.4 + Math.cos(t * 0.06) * 0.08
  })

  return (
    <group ref={gridGroup} position={[0, -3.4, -5.0]} rotation={[-0.08, 0, 0]}>
      {/* Base charcoal grid lines */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#191c26" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      {/* Subtle theme-color datum lines (center and key corridors) */}
      <lineSegments geometry={accentLineGeo}>
        <lineBasicMaterial color={themeColor} transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// ─── Technical Datum Elevation Crosshairs ─────────────────────────────────────
function ElevationCrosshairs({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)

  const markers = useMemo(() => [
    { pos: [-6.8, 1.2, -3.2] as [number, number, number], size: 0.14 },
    { pos: [7.2, 0.8, -4.5]  as [number, number, number], size: 0.14 },
    { pos: [-2.5, 2.1, -6.0] as [number, number, number], size: 0.12 },
    { pos: [3.8, 1.6, -2.8]  as [number, number, number], size: 0.12 },
  ], [])

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.15) * 0.08
  })

  return (
    <group ref={groupRef}>
      {markers.map((m, i) => (
        <group key={i} position={m.pos}>
          {/* Subtle diamond marker */}
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <octahedronGeometry args={[m.size, 0]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? themeColor : '#2f3445'}
              transparent
              opacity={i % 2 === 0 ? 0.65 : 0.35}
              depthWrite={false}
            />
          </mesh>
          {/* Subtle vertical coordinate datum drop-line */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0, 0, 0, 0, -2.2, 0]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={i % 2 === 0 ? themeColor : '#1d212c'}
              transparent
              opacity={0.18}
              depthWrite={false}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  )
}

// ─── Camera Controller (Parallax & Ambient Cinematic Drift) ───────────────────
function CameraController({
  mouseOffset,
  scrollProgress,
  reducedMotion,
  isMobile,
}: {
  mouseOffset: { x: number; y: number }
  scrollProgress: number
  reducedMotion: boolean
  isMobile: boolean
}) {
  const mouseSmooth = useRef({ x: 0, y: 0 })

  useFrame(({ clock, camera }) => {
    if (reducedMotion) {
      camera.position.set(0, 3.4, 11.8)
      camera.lookAt(0, 0, 0)
      return
    }

    const t = clock.getElapsedTime()

    // Smooth mouse parallax (disabled on mobile)
    if (!isMobile) {
      mouseSmooth.current.x += (mouseOffset.x - mouseSmooth.current.x) * 0.04
      mouseSmooth.current.y += (mouseOffset.y - mouseSmooth.current.y) * 0.04
    } else {
      mouseSmooth.current = { x: 0, y: 0 }
    }

    // Very gentle ambient cinematic drift
    const driftX = Math.sin(t * 0.12) * 0.35
    const driftY = Math.cos(t * 0.08) * 0.18
    const driftZ = Math.sin(t * 0.06) * 0.22

    // Subtle scroll-in elevation perspective adjustment
    const scrollParallaxY = (scrollProgress - 0.5) * 0.5

    camera.position.x = driftX + mouseSmooth.current.x * 0.9
    camera.position.y = 3.4 + driftY - mouseSmooth.current.y * 0.6 + scrollParallaxY
    camera.position.z = 11.8 + driftZ
    camera.lookAt(0, 0.1, 0)
  })

  return null
}

// ─── Scene Assembly ───────────────────────────────────────────────────────────
function SceneContent({
  mouseOffset,
  scrollProgress,
  reducedMotion,
  isMobile,
}: {
  mouseOffset: { x: number; y: number }
  scrollProgress: number
  reducedMotion: boolean
  isMobile: boolean
}) {
  const { currentTheme } = useGlobalTheme()
  const themeColor = currentTheme?.color || '#ff1e38'

  return (
    <>
      <CameraController
        mouseOffset={mouseOffset}
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />

      {/* Subtle cinematic lights */}
      <ambientLight color="#12141c" intensity={0.7} />
      <directionalLight position={[-8, 12, 6]} color="#242838" intensity={0.8} />
      {/* Soft theme-tinted point light casting faint rim glow */}
      <pointLight
        position={[0, 1.5, 2.0]}
        color={themeColor}
        intensity={0.65}
        distance={18}
        decay={2}
      />

      {/* 3D Topographic Terrain with Contour Isolines */}
      <TopographicTerrain themeColor={themeColor} reducedMotion={reducedMotion} />

      {/* Receding Perspective Datum Grid */}
      <PerspectiveGrid themeColor={themeColor} reducedMotion={reducedMotion} />

      {/* Technical Elevation Crosshair Datum Beacons */}
      {!isMobile && (
        <ElevationCrosshairs themeColor={themeColor} reducedMotion={reducedMotion} />
      )}
    </>
  )
}

// ─── Exported HireMe3DBackground Component ─────────────────────────────────────
export interface HireMe3DBackgroundProps {
  inView?: boolean
  scrollProgress?: number
  mouseOffset?: { x: number; y: number }
  reducedMotion?: boolean
}

export default function HireMe3DBackground({
  inView = true,
  scrollProgress = 0.5,
  mouseOffset = { x: 0, y: 0 },
  reducedMotion = false,
}: HireMe3DBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden transition-opacity duration-1000 ease-out"
      style={{
        opacity: inView ? (isMobile ? 0.65 : 0.88) : 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 3.4, 11.8], fov: isMobile ? 54 : 46 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
        // Performance: Pause rendering completely when section is not in view
        frameloop={inView ? 'always' : 'demand'}
      >
        <SceneContent
          mouseOffset={mouseOffset}
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  )
}
