'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { AssemblyPart } from './AssemblyPart'
import { assemblyParts } from './parts'

export function MechanicalAssembly() {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!groupRef.current) return

    // Gentle global rotation based on scroll progress
    const offset = scroll.offset
    groupRef.current.rotation.y = offset * Math.PI * 0.4

    // Subtle tilt as we scroll
    groupRef.current.rotation.x = Math.sin(offset * Math.PI) * 0.1
  })

  return (
    <group ref={groupRef}>
      {assemblyParts.map((partConfig) => (
        <AssemblyPart key={partConfig.id} config={partConfig} />
      ))}
    </group>
  )
}
