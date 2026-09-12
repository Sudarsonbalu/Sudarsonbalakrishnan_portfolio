'use client'

/**
 * Contact3DBackground
 *
 * Visual: Flowing 3D Silk / Fabric-Like Ribbon
 *
 * Description:
 * One elegant abstract 3D ribbon with a smooth silk-satin texture flowing
 * gently through the background of the Contact page. Features soft fabric-like
 * light reflections, subtle wave ripples, and delicate theme-color edge highlights.
 *
 * Animation:
 * - Smooth continuous wave motion
 * - Slow sculptural rotation
 * - Subtle light reflection
 * - Very gentle desktop mouse parallax
 * - Respects prefers-reduced-motion
 * - 100% pointer-events: none
 */

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

function SilkRibbon({
  themeColor,
  reducedMotion,
}: {
  themeColor: string
  reducedMotion: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  // Define an elegant flowing 3D S-curve spine for the silk ribbon
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(-9, -4.5, -2),
      new THREE.Vector3(-5, -1.0, 1),
      new THREE.Vector3(-1.5, 2.5, -1),
      new THREE.Vector3(2.5, 0.5, 1.5),
      new THREE.Vector3(6.5, -2.5, -0.5),
      new THREE.Vector3(9.5, 2.0, -2.5),
    ]
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
  }, [])

  // Generate flat ribbon geometry along the curve
  const { geometry, edgeGeometry } = useMemo(() => {
    // A flat ribbon tube (radialSegments 4 with flattened scale gives a wide satin ribbon)
    const geo = new THREE.TubeGeometry(curve, 160, 0.45, 12, false)
    geo.scale(1.0, 0.08, 1.8) // Flatten into a wide ribbon band
    const edges = new THREE.EdgesGeometry(geo, 30)
    return { geometry: geo, edgeGeometry: edges }
  }, [curve])

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return
    const t = clock.getElapsedTime()

    // Smooth wave motion & gentle sculptural sway
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.18 + 0.1
    groupRef.current.rotation.x = Math.cos(t * 0.09) * 0.1
    groupRef.current.position.y = Math.sin(t * 0.16) * 0.35
    groupRef.current.position.z = -3.5 + Math.sin(t * 0.08) * 0.25
  })

  return (
    <group ref={groupRef} position={[0, 0, -3.5]}>
      {/* Primary Silk Satin Ribbon Mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#0f111a"
          roughness={0.28}
          metalness={0.55}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          reflectivity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Delicate Theme Rim Edge on the Silk Ribbon */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color={themeColor}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </lineSegments>

      {/* Floating ambient halo hoop in deep background */}
      <mesh rotation={[0.4, 0.2, 0.6]} position={[1, 0, -2]}>
        <torusGeometry args={[6.5, 0.02, 16, 140]} />
        <meshStandardMaterial
          color="#1b1e2b"
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.2}
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
      camera.position.set(0, 0, 10.5)
      camera.lookAt(0, 0, 0)
      return
    }

    const t = clock.getElapsedTime()

    if (!isMobile) {
      mouseSmooth.current.x += (mouse.x - mouseSmooth.current.x) * 0.035
      mouseSmooth.current.y += (mouse.y - mouseSmooth.current.y) * 0.035
    }

    const driftX = Math.sin(t * 0.11) * 0.22
    const driftY = Math.cos(t * 0.08) * 0.16

    camera.position.x = driftX + mouseSmooth.current.x * 0.65
    camera.position.y = driftY - mouseSmooth.current.y * 0.45
    camera.position.z = 10.5 + Math.sin(t * 0.06) * 0.15
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

      <ambientLight color="#0d0f17" intensity={0.8} />
      <directionalLight position={[6, 8, 6]} color="#2d3348" intensity={1.1} />
      <directionalLight position={[-6, -6, -3]} color="#141724" intensity={0.5} />

      <pointLight
        position={[0, 1.5, 3]}
        color={themeColor}
        intensity={0.7}
        distance={16}
        decay={2}
      />

      <SilkRibbon themeColor={themeColor} reducedMotion={reducedMotion} />
    </>
  )
}

export default function Contact3DBackground() {
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
        camera={{ position: [0, 0, 10.5], fov: isMobile ? 54 : 46 }}
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
