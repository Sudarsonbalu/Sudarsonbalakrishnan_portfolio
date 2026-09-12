'use client'

/**
 * TimelineBackground3D
 *
 * Cinematic, dark futuristic 3D engineering / data structure floating
 * deep in the background BEHIND the About page timeline.
 *
 * Concept:
 * - AI + DATA + ENGINEERING + FUTURE
 * - Nested concentric orbital gimbal rings with telemetry ticks
 * - Abstract geometric crystalline / polyhedral wireframe core
 * - Subtle ground datum grid
 * - Delicate node network with laser hairline connections
 * - Coordinate datum axes
 *
 * Characteristics:
 * - Low-contrast, charcoal / dark metallic / subtle white
 * - Only 5–15% theme color (rim highlights, beacon nodes, orbital accent)
 * - Ultra-slow ambient cinematic rotation & gentle breathing motion
 * - Subtle, non-distracting scroll parallax
 * - Respects prefers-reduced-motion (stops motion completely)
 * - 100% pointer-events: none — zero interference with timeline interaction
 * - Reacts live to the global multi-color theme system
 */

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

// ─── Concentric Orbital Rings & Telemetry Notches ─────────────────────────────
function OrbitalRings({ themeColor, reducedMotion }: { themeColor: string; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerRingRef = useRef<THREE.Group>(null!)

  // Ring definitions: various radii, angles and line weights
  const rings = useMemo(() => [
    { radius: 6.8, tube: 0.016, segs: 140, rot: [0.35, 0.2, 0.1] as [number, number, number], opacity: 0.28, isAccent: true },
    { radius: 8.5, tube: 0.010, segs: 160, rot: [0.85, -0.4, 0.3] as [number, number, number], opacity: 0.16, isAccent: false },
    { radius: 10.4, tube: 0.008, segs: 180, rot: [1.3, 0.6, -0.2] as [number, number, number], opacity: 0.12, isAccent: false },
    { radius: 5.0, tube: 0.020, segs: 120, rot: [-0.4, 0.5, 0.6] as [number, number, number], opacity: 0.22, isAccent: false },
    { radius: 12.2, tube: 0.006, segs: 180, rot: [0.15, -0.8, 0.4] as [number, number, number], opacity: 0.08, isAccent: false },
  ], [])

  // Orbiting coordinate notch points on the accent ring
  const ticksCount = 24
  const tickPositions = useMemo(() => {
    const pts: [number, number, number][] = []
    const r = 6.8
    for (let i = 0; i < ticksCount; i++) {
      const theta = (i / ticksCount) * Math.PI * 2
      pts.push([Math.cos(theta) * r, Math.sin(theta) * r, 0])
    }
    return pts
  }, [])

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.022
      groupRef.current.rotation.x = Math.sin(t * 0.012) * 0.08
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.035
      innerRingRef.current.rotation.y = t * 0.018
    }
  })

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <group key={i} rotation={ring.rot}>
          <mesh>
            <torusGeometry args={[ring.radius, ring.tube, 12, ring.segs]} />
            <meshBasicMaterial
              color={ring.isAccent ? themeColor : '#222530'}
              transparent
              opacity={ring.opacity}
            />
          </mesh>
        </group>
      ))}

      {/* Orbiting Telemetry Notches on the accent gimbal ring */}
      <group ref={innerRingRef} rotation={[0.35, 0.2, 0.1]}>
        {tickPositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshBasicMaterial
              color={idx % 4 === 0 ? themeColor : '#323644'}
              transparent
              opacity={idx % 4 === 0 ? 0.7 : 0.35}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ─── Abstract Polyhedral Engineering Core ─────────────────────────────────────
function FuturisticCore({ themeColor, reducedMotion }: { themeColor: string; reducedMotion: boolean }) {
  const outerCoreRef = useRef<THREE.Mesh>(null!)
  const innerCoreRef = useRef<THREE.Mesh>(null!)
  const nestedOctaRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    if (outerCoreRef.current) {
      outerCoreRef.current.rotation.x = t * 0.018
      outerCoreRef.current.rotation.y = t * 0.028
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x = -t * 0.024
      innerCoreRef.current.rotation.z = t * 0.020
    }
    if (nestedOctaRef.current) {
      nestedOctaRef.current.rotation.y = -t * 0.032
      nestedOctaRef.current.rotation.x = t * 0.015
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Icosahedral wireframe cage */}
      <mesh ref={outerCoreRef}>
        <icosahedronGeometry args={[2.8, 1]} />
        <meshBasicMaterial color="#1a1c24" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Mid-layer Dodecahedron wireframe */}
      <mesh ref={innerCoreRef}>
        <dodecahedronGeometry args={[2.0, 0]} />
        <meshBasicMaterial color="#2d3142" wireframe transparent opacity={0.45} />
      </mesh>

      {/* Inner suspended crystal with theme-tinted rim highlight */}
      <mesh ref={nestedOctaRef}>
        <octahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial color={themeColor} wireframe transparent opacity={0.38} />
      </mesh>

      {/* Subtle core atmospheric volumetric glow sphere */}
      <mesh>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

// ─── Subtle Engineering Datum Data-Grid ───────────────────────────────────────
function EngineeringDataGrid({ reducedMotion }: { reducedMotion: boolean }) {
  const gridRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    if (gridRef.current) {
      gridRef.current.position.y = -6.0 + Math.sin(t * 0.018) * 0.12
      gridRef.current.rotation.x = -Math.PI / 2.3 + Math.sin(t * 0.012) * 0.02
    }
  })

  return (
    <mesh ref={gridRef} position={[0, -6.0, 0]}>
      <planeGeometry args={[36, 36, 32, 32]} />
      <meshBasicMaterial color="#13151c" wireframe transparent opacity={0.16} />
    </mesh>
  )
}

// ─── Constellation Node Network with Hairline Connectors ─────────────────────
function NodeNetwork({ themeColor, reducedMotion }: { themeColor: string; reducedMotion: boolean }) {
  const networkRef = useRef<THREE.Group>(null!)

  // Mathematical spatial nodes surrounding the structure
  const nodeCoords = useMemo(() => {
    const raw: [number, number, number][] = [
      [6.5, 3.2, -2.4],
      [-5.8, 4.1, -1.8],
      [4.2, -4.6, 2.5],
      [-4.5, -3.8, -3.2],
      [2.8, 6.2, -3.5],
      [-3.2, 5.8, 2.1],
      [6.8, -2.2, 3.6],
      [-6.2, -1.8, 2.8],
      [5.1, 4.5, 2.9],
      [-2.4, -5.5, -2.1],
      [1.8, -6.8, -1.4],
      [-7.4, 2.2, 1.2],
      [3.6, -1.5, -5.2],
      [-1.5, 3.8, -5.5],
    ]
    return raw
  }, [])

  // Pre-calculate line connections between nearby spatial nodes
  const lineGeo = useMemo(() => {
    const coords: number[] = []
    const maxDist = 7.2
    for (let i = 0; i < nodeCoords.length; i++) {
      for (let j = i + 1; j < nodeCoords.length; j++) {
        const [x1, y1, z1] = nodeCoords[i]
        const [x2, y2, z2] = nodeCoords[j]
        const d = Math.hypot(x1 - x2, y1 - y2, z1 - z2)
        if (d < maxDist) {
          coords.push(x1, y1, z1, x2, y2, z2)
        }
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3))
    return geometry
  }, [nodeCoords])

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    if (networkRef.current) {
      networkRef.current.rotation.y = -t * 0.016
      networkRef.current.rotation.z = Math.sin(t * 0.010) * 0.04
    }
  })

  return (
    <group ref={networkRef}>
      {/* Hairline geometric connection vectors */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#1e212c" transparent opacity={0.32} />
      </lineSegments>

      {/* Nodes: subtle graphite cubes + rare beacon nodes in theme color */}
      {nodeCoords.map((pos, idx) => {
        const isBeacon = idx === 0 || idx === 6
        return (
          <mesh key={idx} position={pos}>
            <octahedronGeometry args={[isBeacon ? 0.12 : 0.06, 0]} />
            <meshBasicMaterial
              color={isBeacon ? themeColor : '#363a4a'}
              transparent
              opacity={isBeacon ? 0.75 : 0.38}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Technical Spatial Datum Axes ─────────────────────────────────────────────
function TechnicalAxes({ themeColor, reducedMotion }: { themeColor: string; reducedMotion: boolean }) {
  const axesGroup = useRef<THREE.Group>(null!)

  const axisData = useMemo(() => {
    const makeLine = (dir: [number, number, number], len: number) => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([0, 0, 0, dir[0] * len, dir[1] * len, dir[2] * len], 3)
      )
      return geo
    }
    return [
      { geo: makeLine([1, 0, 0], 14), color: '#1a1c24', opacity: 0.15 },
      { geo: makeLine([0, 1, 0], 14), color: themeColor, opacity: 0.25 }, // Elevation datum
      { geo: makeLine([0, 0, 1], 14), color: '#1a1c24', opacity: 0.15 },
      { geo: makeLine([-1, 0, 0], 14), color: '#1a1c24', opacity: 0.12 },
      { geo: makeLine([0, -1, 0], 14), color: '#1a1c24', opacity: 0.12 },
      { geo: makeLine([0, 0, -1], 14), color: '#1a1c24', opacity: 0.12 },
    ]
  }, [themeColor])

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    if (axesGroup.current) {
      axesGroup.current.rotation.y = t * 0.009
    }
  })

  return (
    <group ref={axesGroup} position={[0, -0.5, -2]}>
      {axisData.map((axis, i) => (
        <lineSegments key={i} geometry={axis.geo}>
          <lineBasicMaterial color={axis.color} transparent opacity={axis.opacity} />
        </lineSegments>
      ))}
    </group>
  )
}

// ─── Depth Field Octahedron Enclosure ─────────────────────────────────────────
function DeepSpaceChamber({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.006
      meshRef.current.rotation.x = t * 0.004
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -4]}>
      <octahedronGeometry args={[14.5, 0]} />
      <meshBasicMaterial color="#0f1117" wireframe transparent opacity={0.06} />
    </mesh>
  )
}

// ─── Ambient Camera & Micro-Parallax Controller ───────────────────────────────
function AmbientCameraController({ scrollY, reducedMotion }: { scrollY: number; reducedMotion: boolean }) {
  useFrame(({ clock, camera }) => {
    if (reducedMotion) {
      camera.position.set(0, 0, 17.5)
      camera.lookAt(0, 0, 0)
      return
    }

    const t = clock.getElapsedTime()
    // Very gentle ambient breathing motion
    const breathY = Math.sin(t * 0.22) * 0.09
    const breathX = Math.cos(t * 0.16) * 0.07

    // Ultra-subtle scroll parallax: maximum ~0.8 units over entire scroll length
    const parallaxY = -Math.min(scrollY * 0.00045, 1.2)

    camera.position.y = breathY + parallaxY
    camera.position.x = breathX
    camera.position.z = 17.5 + Math.sin(t * 0.12) * 0.15 // Gentle depth shift
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Full 3D Scene Assembly ───────────────────────────────────────────────────
function SceneContent({ scrollY, reducedMotion }: { scrollY: number; reducedMotion: boolean }) {
  const { currentTheme } = useGlobalTheme()
  const themeColor = currentTheme?.color || '#ff1e38'

  return (
    <>
      <AmbientCameraController scrollY={scrollY} reducedMotion={reducedMotion} />
      <DeepSpaceChamber reducedMotion={reducedMotion} />
      <EngineeringDataGrid reducedMotion={reducedMotion} />
      <OrbitalRings themeColor={themeColor} reducedMotion={reducedMotion} />
      <FuturisticCore themeColor={themeColor} reducedMotion={reducedMotion} />
      <NodeNetwork themeColor={themeColor} reducedMotion={reducedMotion} />
      <TechnicalAxes themeColor={themeColor} reducedMotion={reducedMotion} />
    </>
  )
}

// ─── TimelineBackground3D Component (Exported) ────────────────────────────────
export default function TimelineBackground3D({
  scrollY = 0,
  reducedMotion = false,
}: {
  scrollY?: number
  reducedMotion?: boolean
}) {
  return (
    <div className="w-full h-full relative pointer-events-none select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 17.5], fov: 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      >
        <SceneContent scrollY={scrollY} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
