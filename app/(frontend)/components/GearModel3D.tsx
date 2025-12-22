'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { Environment, Float } from '@react-three/drei'

function createGearShape(
  innerRadius: number,
  outerRadius: number,
  teeth: number,
  toothDepth: number
): THREE.Shape {
  const shape = new THREE.Shape()
  const anglePerTooth = (Math.PI * 2) / teeth

  for (let i = 0; i < teeth; i++) {
    const angle = i * anglePerTooth
    const nextAngle = (i + 1) * anglePerTooth
    const toothWidth = anglePerTooth * 0.35

    // Base of tooth (inner)
    const x1 = Math.cos(angle) * outerRadius
    const y1 = Math.sin(angle) * outerRadius

    // Tip of tooth (outer)
    const tipAngle1 = angle + toothWidth * 0.3
    const tipAngle2 = angle + toothWidth * 0.7
    const x2 = Math.cos(tipAngle1) * (outerRadius + toothDepth)
    const y2 = Math.sin(tipAngle1) * (outerRadius + toothDepth)
    const x3 = Math.cos(tipAngle2) * (outerRadius + toothDepth)
    const y3 = Math.sin(tipAngle2) * (outerRadius + toothDepth)

    // End of tooth (back to inner)
    const x4 = Math.cos(angle + toothWidth) * outerRadius
    const y4 = Math.sin(angle + toothWidth) * outerRadius

    // Valley between teeth
    const valleyAngle = angle + toothWidth + (anglePerTooth - toothWidth) / 2
    const x5 = Math.cos(nextAngle) * outerRadius
    const y5 = Math.sin(nextAngle) * outerRadius

    if (i === 0) {
      shape.moveTo(x1, y1)
    } else {
      shape.lineTo(x1, y1)
    }

    shape.lineTo(x2, y2)
    shape.lineTo(x3, y3)
    shape.lineTo(x4, y4)
    shape.lineTo(x5, y5)
  }

  shape.closePath()

  // Add center hole
  const holePath = new THREE.Path()
  const holeSegments = 32
  for (let i = 0; i <= holeSegments; i++) {
    const angle = (i / holeSegments) * Math.PI * 2
    const x = Math.cos(angle) * innerRadius
    const y = Math.sin(angle) * innerRadius
    if (i === 0) {
      holePath.moveTo(x, y)
    } else {
      holePath.lineTo(x, y)
    }
  }
  shape.holes.push(holePath)

  return shape
}

function Gear({ position = [0, 0, 0] as [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const shape = createGearShape(0.3, 0.8, 12, 0.25)
    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 3,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.003
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} position={position} castShadow receiveShadow>
      <meshStandardMaterial
        color="#1e4b7a"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  )
}

function SmallGear({ position = [0, 0, 0] as [number, number, number], reverse = false }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const shape = createGearShape(0.15, 0.4, 8, 0.15)
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 2,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += reverse ? -0.005 : 0.005
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} position={position} castShadow receiveShadow>
      <meshStandardMaterial
        color="#2d6aa3"
        metalness={0.7}
        roughness={0.3}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

function GearScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#4a90d9" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group>
          <Gear position={[0, 0, 0]} />
          <SmallGear position={[1.3, 0.5, 0.1]} />
          <SmallGear position={[-1.2, -0.6, -0.1]} reverse />
        </group>
      </Float>

      <Environment preset="studio" />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
    </div>
  )
}

interface GearModel3DProps {
  className?: string
}

export function GearModel3D({ className = '' }: GearModel3DProps) {
  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <GearScene />
        </Canvas>
      </Suspense>
    </div>
  )
}
