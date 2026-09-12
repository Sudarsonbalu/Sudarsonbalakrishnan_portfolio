'use client'

import { Float, MeshDistortMaterial } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function CoreOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame(({ clock, pointer }, delta) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    targetRotation.current.x = t * 0.14 + pointer.y * 0.35
    targetRotation.current.y = t * 0.2 + pointer.x * 0.4

    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotation.current.x, 3, delta)
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotation.current.y, 3, delta)
  })

  return (
    <mesh ref={meshRef} scale={1.32}>
      <icosahedronGeometry args={[1.1, 4]} />
      <MeshDistortMaterial
        color="#ff1e38"
        roughness={0.15}
        metalness={0.85}
        distort={0.36}
        speed={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.12}
      />
    </mesh>
  )
}

function OrbitalRing({ radius, speed, rotationAxis }: { radius: number; speed: number; rotationAxis: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const t = clock.elapsedTime * speed
    ringRef.current.rotation.x = t * rotationAxis[0]
    ringRef.current.rotation.y = t * rotationAxis[1]
    ringRef.current.rotation.z = t * rotationAxis[2]
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshStandardMaterial
        color="#ff334b"
        roughness={0.2}
        metalness={0.95}
        emissive="#b80c20"
        emissiveIntensity={0.4}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function StarDust() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 110

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return pos
  }, [count])

  useFrame(({ pointer }, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = THREE.MathUtils.damp(pointsRef.current.rotation.y, pointer.x * 0.15, 2, delta)
    pointsRef.current.rotation.x = THREE.MathUtils.damp(pointsRef.current.rotation.x, -pointer.y * 0.15, 2, delta)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ff4458"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 3, 3]} intensity={3.8} color="#ffffff" />
      <directionalLight position={[-4, -2, -2]} intensity={2.2} color="#ff2a3f" />
      <pointLight position={[0, -2, 2]} intensity={6} color="#ff1e38" distance={7} />
      <pointLight position={[2, 3, 1]} intensity={8} color="#ffffff" distance={8} />

      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.65} floatingRange={[-0.1, 0.1]}>
        <group>
          <CoreOrb />
          <OrbitalRing radius={1.75} speed={0.4} rotationAxis={[1, 0.6, 0.2]} />
          <OrbitalRing radius={2.05} speed={-0.3} rotationAxis={[0.3, 1, 0.5]} />
        </group>
      </Float>

      <StarDust />
    </Canvas>
  )
}
