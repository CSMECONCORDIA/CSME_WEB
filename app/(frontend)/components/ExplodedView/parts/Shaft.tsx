'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface ShaftProps {
  radius?: number
  length?: number
  color?: string
  metalness?: number
  roughness?: number
}

export function Shaft({
  radius = 0.15,
  length = 3,
  color = '#C0C0C0',
  metalness = 0.95,
  roughness = 0.1,
}: ShaftProps) {
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(radius, radius, length, 32)
  }, [radius, length])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  )
}
