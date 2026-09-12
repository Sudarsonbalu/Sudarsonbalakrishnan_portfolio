'use client'

/**
 * Home3DBackground
 *
 * Visual: Floating Abstract Glass Sculpture
 *
 * Description:
 * An artistic, sculptural composition of connected translucent geometric forms
 * floating deep in the background. Features delicate glass refraction, subtle white
 * specular highlights, dark metallic accents, and soft theme-color rim lighting.
 *
 * Animation:
 * - Very slow ambient rotation & gentle breathing float
 * - Soft specular light movement
 * - Smooth desktop mouse parallax
 * - Fully respects prefers-reduced-motion
 * - 100% pointer-events: none
 */

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

// ─── Glass Geometric Sculpture Cluster ────────────────────────────────────────
function GlassSculpture({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerRef = useRef<THREE.Group>(null!)
  const slabRef = useRef<THREE.Mesh>(null!)
  const arcRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return
    const t = clock.getElapsedTime()

    // Ultra-slow ambient sculptural rotation
    groupRef.current.rotation.y = t * 0.018
    groupRef.current.rotation.x = Math.sin(t * 0.012) * 0.06
    groupRef.current.position.y = Math.sin(t * 0.18) * 0.15

    if (innerRef.current) {
      innerRef.current.rotation.z = -t * 0.014
      innerRef.current.rotation.y = t * 0.010
    }
    if (slabRef.current) {
      slabRef.current.rotation.x = t * 0.012
    }
    if (arcRef.current) {
      arcRef.current.rotation.z = t * 0.016
    }
  })

  return (
    <group ref={groupRef} position={[2.5, 0.2, -2.5]}>
      {/* Primary Faceted Glass Form (Beveled Icosahedron) */}
      <mesh>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshPhysicalMaterial
          color="#12151f"
          roughness={0.12}
          metalness={0.15}
          transmission={0.65}
          thickness={1.8}
          transparent
          opacity={0.45}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={0.8}
        />
      </mesh>

      {/* Outer Fine Wireframe Rim Highlight (Reflects Theme Color) */}
      <mesh>
        <icosahedronGeometry args={[2.408, 0]} />
        <meshBasicMaterial
          color={themeColor}
          wireframe
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* Floating Translucent Glass Ring / Curved Horizon Arc */}
      <mesh ref={arcRef} rotation={[0.6, 0.4, 0.2]}>
        <torusGeometry args={[3.8, 0.04, 16, 120]} />
        <meshStandardMaterial
          color={themeColor}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Secondary Floating Glass Slab (Faceted Rectangular Obelisk) */}
      <mesh ref={slabRef} position={[-2.8, 1.4, -1.2]} rotation={[0.4, 0.2, 0.8]}>
        <boxGeometry args={[1.2, 2.8, 0.18]} />
        <meshPhysicalMaterial
          color="#161822"
          roughness={0.08}
          metalness={0.2}
          transmission={0.7}
          thickness={1.2}
          transparent
          opacity={0.42}
          clearcoat={1.0}
        />
      </mesh>

      {/* Thin Metallic Edge on the Glass Slab */}
      <mesh position={[-2.8, 1.4, -1.2]} rotation={[0.4, 0.2, 0.8]}>
        <boxGeometry args={[1.205, 2.805, 0.185]} />
        <meshBasicMaterial color="#2d3242" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Inner Suspended Floating Crystal */}
      <group ref={innerRef}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color="#0b0d14"
            roughness={0.2}
            metalness={0.9}
            transparent
            opacity={0.65}
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.106, 0]} />
          <meshBasicMaterial
            color={themeColor}
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>

      {/* Delicate floating glass satellite gem */}
      <mesh position={[2.6, -1.8, 1.2]} rotation={[0.3, 0.5, 0]}>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshPhysicalMaterial
          color="#141722"
          roughness={0.1}
          metalness={0.3}
          transmission={0.75}
          transparent
          opacity={0.5}
          clearcoat={0.8}
        />
      </mesh>
    </group>
  )
}

// ─── Camera Controller with Desktop Mouse Parallax ────────────────────────────
function CameraParallax({
  mouse,
  reducedMotion,
  isMobile,
}: {
  mouse: { x: number; y: number }
  reducedMotion: boolean
  isMobile: boolean
}) {
  const mouseSmooth = useRef({ x: 0, y: 0 })

  useFrame(({ clock, camera }) => {
    if (reducedMotion) {
      camera.position.set(0, 0, 9.5)
      camera.lookAt(0, 0, 0)
      return
    }

    const t = clock.getElapsedTime()

    if (!isMobile) {
      mouseSmooth.current.x += (mouse.x - mouseSmooth.current.x) * 0.035
      mouseSmooth.current.y += (mouse.y - mouseSmooth.current.y) * 0.035
    } else {
      mouseSmooth.current = { x: 0, y: 0 }
    }

    const driftX = Math.sin(t * 0.14) * 0.25
    const driftY = Math.cos(t * 0.10) * 0.18

    camera.position.x = driftX + mouseSmooth.current.x * 0.75
    camera.position.y = driftY - mouseSmooth.current.y * 0.45
    camera.position.z = 9.5 + Math.sin(t * 0.08) * 0.15
    camera.lookAt(0.5, 0, 0)
  })

  return null
}

// ─── Scene Content ────────────────────────────────────────────────────────────
function Scene({
  mouse,
  reducedMotion,
  isMobile,
}: {
  mouse: { x: number; y: number }
  reducedMotion: boolean
  isMobile: boolean
}) {
  const { currentTheme } = useGlobalTheme()
  const themeColor = currentTheme?.color || '#ff1e38'

  return (
    <>
      <CameraParallax mouse={mouse} reducedMotion={reducedMotion} isMobile={isMobile} />

      {/* Cinematic Lighting */}
      <ambientLight color="#0e1017" intensity={0.9} />
      <directionalLight position={[6, 8, 4]} color="#363d52" intensity={1.2} />
      <directionalLight position={[-8, -4, -2]} color="#1a1c26" intensity={0.6} />

      {/* Theme-colored rim specular light */}
      <pointLight
        position={[2.5, 3.0, 1.0]}
        color={themeColor}
        intensity={0.8}
        distance={14}
        decay={2}
      />

      <GlassSculpture themeColor={themeColor} reducedMotion={reducedMotion} />
    </>
  )
}

// ─── Exported Component ───────────────────────────────────────────────────────
export default function Home3DBackground() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handleMQ = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handleMQ)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })

    const handleMouseMove = (e: MouseEvent) => {
      if (mq.matches || isMobile) return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMouse({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      mq.removeEventListener('change', handleMQ)
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile])

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: isMobile ? 54 : 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      >
        <Scene mouse={mouse} reducedMotion={reducedMotion} isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
