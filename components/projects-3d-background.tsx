'use client'

/**
 * Projects3DBackground
 *
 * Visual: Floating Abstract Geometric Sculptures
 *
 * Description:
 * A curated spatial composition of abstract glass cubes, rounded metallic forms,
 * and translucent geometric panels floating deep in the background.
 * Low contrast, dark metallic and glass materials, subtle theme rim accents.
 *
 * Animation:
 * - Slow floating and independent rotational drift
 * - Gentle depth separation
 * - Desktop mouse parallax
 * - Respects prefers-reduced-motion
 * - 100% pointer-events: none
 */

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

function FloatingSculptures({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const cubeRef = useRef<THREE.Group>(null!)
  const pebbleRef = useRef<THREE.Mesh>(null!)
  const panelRef = useRef<THREE.Group>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const prismRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()

    // 1. Glass Cube
    if (cubeRef.current) {
      cubeRef.current.rotation.x = t * 0.024
      cubeRef.current.rotation.y = t * 0.018
      cubeRef.current.position.y = 2.4 + Math.sin(t * 0.22) * 0.2
    }

    // 2. Rounded Metallic Pebble
    if (pebbleRef.current) {
      pebbleRef.current.rotation.y = -t * 0.02
      pebbleRef.current.rotation.z = t * 0.015
      pebbleRef.current.position.y = -3.2 + Math.cos(t * 0.18) * 0.25
    }

    // 3. Translucent Geometric Panel
    if (panelRef.current) {
      panelRef.current.rotation.y = Math.sin(t * 0.12) * 0.25 + 0.4
      panelRef.current.position.y = 0.5 + Math.sin(t * 0.16 + 1.2) * 0.18
    }

    // 4. Thin Metallic Halo Loop
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.016
      ringRef.current.rotation.y = t * 0.022
      ringRef.current.position.y = -1.0 + Math.sin(t * 0.14 + 2.0) * 0.15
    }

    // 5. Faceted Prism
    if (prismRef.current) {
      prismRef.current.rotation.z = t * 0.018
      prismRef.current.rotation.x = t * 0.012
      prismRef.current.position.y = 3.6 + Math.cos(t * 0.15 + 0.8) * 0.2
    }
  })

  return (
    <group position={[0, 0, -4.5]}>
      {/* 1. Translucent Beveled Glass Cube */}
      <group ref={cubeRef} position={[-5.5, 2.4, -1.0]}>
        <mesh>
          <boxGeometry args={[2.0, 2.0, 2.0]} />
          <meshPhysicalMaterial
            color="#141724"
            roughness={0.1}
            metalness={0.2}
            transmission={0.65}
            thickness={1.5}
            transparent
            opacity={0.4}
            clearcoat={0.9}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[2.008, 2.008, 2.008]} />
          <meshBasicMaterial color="#2d3345" wireframe transparent opacity={0.25} />
        </mesh>
        {/* Subtle Theme Rim on Cube */}
        <mesh>
          <boxGeometry args={[2.012, 2.012, 2.012]} />
          <meshBasicMaterial color={themeColor} wireframe transparent opacity={0.15} />
        </mesh>
      </group>

      {/* 2. Rounded Dark Metallic Form (Pebble/Capsule) */}
      <mesh
        ref={pebbleRef}
        position={[6.2, -3.2, -2.0]}
        rotation={[0.4, 0.2, 0.6]}
      >
        <capsuleGeometry args={[0.9, 1.6, 16, 32]} />
        <meshPhysicalMaterial
          color="#0d0f17"
          roughness={0.2}
          metalness={0.9}
          clearcoat={0.9}
          reflectivity={0.9}
        />
      </mesh>

      {/* 3. Floating Translucent Geometric Panel */}
      <group ref={panelRef} position={[5.4, 0.5, -3.0]} rotation={[0.2, 0.4, -0.1]}>
        <mesh>
          <boxGeometry args={[2.8, 4.2, 0.08]} />
          <meshPhysicalMaterial
            color="#181b28"
            roughness={0.08}
            metalness={0.15}
            transmission={0.7}
            transparent
            opacity={0.35}
            clearcoat={1.0}
          />
        </mesh>
        {/* Thin Edge Contour */}
        <mesh>
          <boxGeometry args={[2.81, 4.21, 0.082]} />
          <meshBasicMaterial color={themeColor} wireframe transparent opacity={0.28} />
        </mesh>
      </group>

      {/* 4. Thin Metallic Halo Loop */}
      <mesh ref={ringRef} position={[-2.8, -1.0, -2.5]} rotation={[0.8, 0.3, 0]}>
        <torusGeometry args={[3.2, 0.025, 16, 120]} />
        <meshStandardMaterial
          color="#222736"
          roughness={0.25}
          metalness={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 5. Suspended Faceted Glass Prism */}
      <group ref={prismRef} position={[2.0, 3.6, -1.8]}>
        <mesh>
          <octahedronGeometry args={[1.2, 0]} />
          <meshPhysicalMaterial
            color="#131622"
            roughness={0.12}
            metalness={0.2}
            transmission={0.75}
            transparent
            opacity={0.45}
            clearcoat={1.0}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[1.206, 0]} />
          <meshBasicMaterial color={themeColor} wireframe transparent opacity={0.35} />
        </mesh>
      </group>
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

    camera.position.x = driftX + mouseSmooth.current.x * 0.65
    camera.position.y = driftY - mouseSmooth.current.y * 0.45
    camera.position.z = 11.0 + Math.sin(t * 0.06) * 0.18
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

      <ambientLight color="#0c0e16" intensity={0.8} />
      <directionalLight position={[8, 10, 6]} color="#2d3348" intensity={1.1} />
      <directionalLight position={[-8, -8, -4]} color="#151722" intensity={0.5} />

      <pointLight
        position={[-1, 2, 3]}
        color={themeColor}
        intensity={0.7}
        distance={18}
        decay={2}
      />

      <FloatingSculptures themeColor={themeColor} reducedMotion={reducedMotion} />
    </>
  )
}

export default function Projects3DBackground() {
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
