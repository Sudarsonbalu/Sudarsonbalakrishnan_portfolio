'use client'

/**
 * Achievements3DBackground
 *
 * Visual: Elegant Metallic Orbital Rings
 *
 * Description:
 * 3 large, thin metallic orbital rings floating deep in the background.
 * Polished dark metallic finish with soft white reflections and subtle
 * theme-color rim highlights.
 *
 * Animation:
 * - Very slow orbital rotation
 * - Subtle depth movement
 * - Desktop mouse parallax
 * - Respects prefers-reduced-motion
 * - 100% pointer-events: none
 */

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

function OrbitalRings({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const ring1Ref = useRef<THREE.Mesh>(null!)
  const ring2Ref = useRef<THREE.Mesh>(null!)
  const ring3Ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return
    const t = clock.getElapsedTime()

    groupRef.current.position.y = Math.sin(t * 0.14) * 0.2

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.018
      ring1Ref.current.rotation.x = Math.sin(t * 0.012) * 0.1
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.015
      ring2Ref.current.rotation.z = t * 0.008
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.012
      ring3Ref.current.rotation.y = t * 0.016
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -4.0]}>
      {/* Ring 1: Primary Thin Metallic Ring */}
      <mesh ref={ring1Ref} rotation={[0.6, 0.2, 0.1]}>
        <torusGeometry args={[5.2, 0.024, 16, 160]} />
        <meshStandardMaterial
          color="#1e2230"
          roughness={0.15}
          metalness={0.92}
        />
      </mesh>

      {/* Ring 1 Rim Highlight (Theme Color) */}
      <mesh rotation={[0.6, 0.2, 0.1]}>
        <torusGeometry args={[5.204, 0.008, 12, 140]} />
        <meshBasicMaterial
          color={themeColor}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Ring 2: Intersecting Mid Ring */}
      <mesh ref={ring2Ref} rotation={[-0.5, 0.7, -0.3]}>
        <torusGeometry args={[7.2, 0.018, 16, 180]} />
        <meshStandardMaterial
          color="#141722"
          roughness={0.2}
          metalness={0.88}
        />
      </mesh>

      {/* Ring 3: Deep Outer Ring */}
      <mesh ref={ring3Ref} rotation={[1.1, -0.4, 0.5]}>
        <torusGeometry args={[9.5, 0.014, 16, 200]} />
        <meshStandardMaterial
          color="#10121a"
          roughness={0.25}
          metalness={0.85}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Ring 3 Subtle Theme Glow Accent */}
      <mesh rotation={[1.1, -0.4, 0.5]}>
        <torusGeometry args={[9.503, 0.006, 12, 160]} />
        <meshBasicMaterial
          color={themeColor}
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  )
}

function CameraController({
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
      camera.position.set(0, 0, 11)
      camera.lookAt(0, 0, 0)
      return
    }

    const t = clock.getElapsedTime()

    if (!isMobile) {
      mouseSmooth.current.x += (mouse.x - mouseSmooth.current.x) * 0.035
      mouseSmooth.current.y += (mouse.y - mouseSmooth.current.y) * 0.035
    }

    const driftX = Math.sin(t * 0.1) * 0.2
    const driftY = Math.cos(t * 0.08) * 0.15

    camera.position.x = driftX + mouseSmooth.current.x * 0.6
    camera.position.y = driftY - mouseSmooth.current.y * 0.4
    camera.position.z = 11.0 + Math.sin(t * 0.06) * 0.15
    camera.lookAt(0, 0, 0)
  })

  return null
}

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
      <CameraController mouse={mouse} reducedMotion={reducedMotion} isMobile={isMobile} />

      <ambientLight color="#0c0e16" intensity={0.7} />
      <directionalLight position={[6, 10, 8]} color="#2d3348" intensity={1.2} />
      <directionalLight position={[-8, -8, -4]} color="#141622" intensity={0.5} />

      <pointLight
        position={[0, 1, 3]}
        color={themeColor}
        intensity={0.65}
        distance={16}
        decay={2}
      />

      <OrbitalRings themeColor={themeColor} reducedMotion={reducedMotion} />
    </>
  )
}

export default function Achievements3DBackground() {
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
        camera={{ position: [0, 0, 11], fov: isMobile ? 54 : 46 }}
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
