'use client'

/**
 * ProjectDetail3DBackground
 *
 * Visual: Transparent Prism / Glass Layer Composition
 *
 * Description:
 * Layered translucent geometric planes and triangular glass prisms floating
 * at staggered depths behind the project case study. Features subtle refraction,
 * delicate clearcoat reflections, and gentle scroll-based depth separation.
 *
 * Animation:
 * - Extremely slow ambient rotation
 * - Subtle glass refraction and reflection
 * - Gentle depth separation as the user scrolls
 * - Fully respects prefers-reduced-motion
 * - 100% pointer-events: none
 */

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobalTheme } from './theme-provider'

function PrismLayers({
  themeColor,
  scrollProgress,
  reducedMotion,
}: {
  themeColor: string
  scrollProgress: number
  reducedMotion: boolean
}) {
  const layer1Ref = useRef<THREE.Group>(null!)
  const layer2Ref = useRef<THREE.Group>(null!)
  const layer3Ref = useRef<THREE.Group>(null!)
  const prismRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.getElapsedTime()

    // Layer 1: Front Translucent Plane
    if (layer1Ref.current) {
      layer1Ref.current.rotation.z = Math.sin(t * 0.08) * 0.12
      layer1Ref.current.rotation.y = t * 0.012
      layer1Ref.current.position.z = -1.5 - scrollProgress * 0.8
    }

    // Layer 2: Mid Triangular Glass Prism
    if (layer2Ref.current) {
      layer2Ref.current.rotation.y = -t * 0.015
      layer2Ref.current.rotation.x = Math.sin(t * 0.09) * 0.08
      layer2Ref.current.position.z = -3.5 - scrollProgress * 1.4
    }

    // Layer 3: Deep Angled Plane
    if (layer3Ref.current) {
      layer3Ref.current.rotation.z = -Math.sin(t * 0.07) * 0.15
      layer3Ref.current.rotation.x = t * 0.010
      layer3Ref.current.position.z = -5.8 - scrollProgress * 2.0
    }

    // Rotating Center Prism
    if (prismRef.current) {
      prismRef.current.rotation.y = t * 0.02
      prismRef.current.rotation.z = t * 0.014
    }
  })

  return (
    <group position={[1.5, 0, -3]}>
      {/* Layer 1: Front Angled Glass Plane */}
      <group ref={layer1Ref} position={[-2.8, 1.2, -1.5]}>
        <mesh rotation={[0.2, 0.4, -0.1]}>
          <boxGeometry args={[4.5, 3.2, 0.06]} />
          <meshPhysicalMaterial
            color="#141724"
            roughness={0.08}
            metalness={0.15}
            transmission={0.72}
            transparent
            opacity={0.38}
            clearcoat={1.0}
          />
        </mesh>
        <mesh rotation={[0.2, 0.4, -0.1]}>
          <boxGeometry args={[4.51, 3.21, 0.062]} />
          <meshBasicMaterial color="#2d3345" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Layer 2: Triangular Glass Prism & Outer Ring */}
      <group ref={layer2Ref} position={[2.4, -0.8, -3.5]}>
        {/* Triangular Prism */}
        <mesh ref={prismRef} rotation={[0.4, 0.2, 0.5]}>
          <cylinderGeometry args={[1.6, 1.6, 0.4, 3]} />
          <meshPhysicalMaterial
            color="#161a28"
            roughness={0.12}
            metalness={0.2}
            transmission={0.68}
            transparent
            opacity={0.45}
            clearcoat={1.0}
          />
        </mesh>
        {/* Theme-colored Prism Edges */}
        <mesh rotation={[0.4, 0.2, 0.5]}>
          <cylinderGeometry args={[1.605, 1.605, 0.405, 3]} />
          <meshBasicMaterial color={themeColor} wireframe transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Layer 3: Deep Hexagonal Glass Plate */}
      <group ref={layer3Ref} position={[0, 0.5, -5.8]}>
        <mesh rotation={[-0.3, 0.5, 0.2]}>
          <cylinderGeometry args={[3.2, 3.2, 0.05, 6]} />
          <meshPhysicalMaterial
            color="#0f121d"
            roughness={0.1}
            metalness={0.25}
            transmission={0.65}
            transparent
            opacity={0.3}
            clearcoat={0.8}
          />
        </mesh>
        <mesh rotation={[-0.3, 0.5, 0.2]}>
          <cylinderGeometry args={[3.21, 3.21, 0.052, 6]} />
          <meshBasicMaterial color={themeColor} wireframe transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  )
}

function CameraController({
  reducedMotion,
}: {
  reducedMotion: boolean
}) {
  useFrame(({ clock, camera }) => {
    if (reducedMotion) {
      camera.position.set(0, 0, 9.5)
      camera.lookAt(0, 0, 0)
      return
    }

    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.09) * 0.2
    camera.position.y = Math.cos(t * 0.07) * 0.15
    camera.position.z = 9.5 + Math.sin(t * 0.05) * 0.12
    camera.lookAt(0, 0, 0)
  })

  return null
}

function Scene({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: number
  reducedMotion: boolean
}) {
  const { currentTheme } = useGlobalTheme()
  const themeColor = currentTheme?.color || '#ff1e38'

  return (
    <>
      <CameraController reducedMotion={reducedMotion} />

      <ambientLight color="#0e1017" intensity={0.8} />
      <directionalLight position={[6, 8, 4]} color="#32384a" intensity={1.1} />
      <directionalLight position={[-6, -6, -4]} color="#131520" intensity={0.5} />

      <pointLight
        position={[2, 2, 2]}
        color={themeColor}
        intensity={0.7}
        distance={16}
        decay={2}
      />

      <PrismLayers
        themeColor={themeColor}
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />
    </>
  )
}

export default function ProjectDetail3DBackground() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handleMQ = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handleMQ)

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) {
        setScrollProgress(window.scrollY / maxScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      mq.removeEventListener('change', handleMQ)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 46 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      >
        <Scene scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
