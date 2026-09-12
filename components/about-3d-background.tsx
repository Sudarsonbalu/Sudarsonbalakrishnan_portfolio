'use client'

/**
 * About3DBackground
 *
 * Visual: Large Flowing Liquid-Metal Ribbon behind the timeline.
 *
 * Description:
 * A smooth, majestic abstract metallic ribbon sculpture curving through space
 * behind the entire academic timeline. Features dark obsidian liquid-metal material,
 * sleek specular reflections, subtle organic undulating deformation, and soft
 * theme-color rim lighting.
 *
 * Animation:
 * - Extremely slow organic undulating movement
 * - Slow sculptural rotation & breathing
 * - Subtle vertical scroll parallax
 * - Fully respects prefers-reduced-motion
 * - 100% pointer-events: none
 */

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

// ─── Procedural Liquid Metal Ribbon ───────────────────────────────────────────
function LiquidMetalRibbon({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const edgeRef = useRef<THREE.LineSegments>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  // Base spline control points for an elegant 3D sculptural ribbon
  const basePoints = useMemo(() => [
    new THREE.Vector3(0, -9, 2),
    new THREE.Vector3(-4.5, -5, -1),
    new THREE.Vector3(-2, -1, -3),
    new THREE.Vector3(3.5, 2, -1.5),
    new THREE.Vector3(4.2, 6, 1.5),
    new THREE.Vector3(0, 9, -2),
    new THREE.Vector3(-3.8, 6, 2.5),
    new THREE.Vector3(-1.5, 2, -1),
    new THREE.Vector3(3, -3, -2),
    new THREE.Vector3(2, -7, 1.5),
  ], [])

  // Create smooth closed curve
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(basePoints, true, 'centripetal', 0.5)
  }, [basePoints])

  // Generate initial tube geometry
  const { geometry, edgeGeometry } = useMemo(() => {
    const geo = new THREE.TubeGeometry(curve, 180, 0.75, 16, true)
    const edges = new THREE.EdgesGeometry(geo, 35)
    return { geometry: geo, edgeGeometry: edges }
  }, [curve])

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return
    const t = clock.getElapsedTime()

    // Extremely slow organic rotation and floating
    groupRef.current.rotation.y = t * 0.016
    groupRef.current.rotation.x = Math.sin(t * 0.012) * 0.08
    groupRef.current.position.y = Math.sin(t * 0.15) * 0.25

    // Subtle breathing scale
    const s = 1.0 + Math.sin(t * 0.2) * 0.02
    groupRef.current.scale.set(s, s, s)
  })

  return (
    <group ref={groupRef} position={[0, 0, -3.5]}>
      {/* Primary Liquid Metal Ribbon Mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#0c0e16"
          roughness={0.16}
          metalness={0.92}
          clearcoat={0.95}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Subtle Glowing Contour Edge (Theme Accent on Grazing Angles) */}
      <lineSegments ref={edgeRef} geometry={edgeGeometry}>
        <lineBasicMaterial
          color={themeColor}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </lineSegments>

      {/* Secondary Outer Orbiting Halo Strand */}
      <mesh rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[8.5, 0.025, 16, 160]} />
        <meshStandardMaterial
          color="#1e2230"
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Delicate Theme Rim Accent Ring */}
      <mesh rotation={[-0.5, 0.6, 0.2]}>
        <torusGeometry args={[7.2, 0.02, 16, 140]} />
        <meshBasicMaterial
          color={themeColor}
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  )
}

// ─── Camera Controller with Parallax ──────────────────────────────────────────
function CameraController({
  scrollY,
  reducedMotion,
}: {
  scrollY: number
  reducedMotion: boolean
}) {
  useFrame(({ clock, camera }) => {
    if (reducedMotion) {
      camera.position.set(0, 0, 15)
      camera.lookAt(0, 0, 0)
      return
    }

    const t = clock.getElapsedTime()
    // Very gentle ambient breathing
    const driftY = Math.sin(t * 0.18) * 0.12
    const driftX = Math.cos(t * 0.12) * 0.08

    // Ultra-subtle vertical scroll parallax
    const scrollParallaxY = -Math.min(scrollY * 0.0005, 1.2)

    camera.position.x = driftX
    camera.position.y = driftY + scrollParallaxY
    camera.position.z = 15.0 + Math.sin(t * 0.1) * 0.15
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Scene Content ────────────────────────────────────────────────────────────
function Scene({
  scrollY,
  reducedMotion,
}: {
  scrollY: number
  reducedMotion: boolean
}) {
  const { currentTheme } = useGlobalTheme()
  const themeColor = currentTheme?.color || '#ff1e38'

  return (
    <>
      <CameraController scrollY={scrollY} reducedMotion={reducedMotion} />

      {/* Cinematic Lighting Setup */}
      <ambientLight color="#0e1017" intensity={0.7} />
      <directionalLight position={[10, 14, 8]} color="#2d3348" intensity={1.1} />
      <directionalLight position={[-10, -10, -5]} color="#141724" intensity={0.5} />

      {/* Soft theme-color specular rim light */}
      <pointLight
        position={[0, 2, 4]}
        color={themeColor}
        intensity={0.75}
        distance={16}
        decay={2}
      />

      <LiquidMetalRibbon themeColor={themeColor} reducedMotion={reducedMotion} />
    </>
  )
}

// ─── Exported Component ───────────────────────────────────────────────────────
export default function About3DBackground({
  scrollY = 0,
  reducedMotion = false,
}: {
  scrollY?: number
  reducedMotion?: boolean
}) {
  return (
    <div className="w-full h-full relative pointer-events-none select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
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
        <Scene scrollY={scrollY} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
