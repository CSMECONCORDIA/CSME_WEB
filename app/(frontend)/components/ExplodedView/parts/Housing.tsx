'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface HousingProps {
  width?: number
  height?: number
  depth?: number
  holeRadius?: number
  color?: string
  metalness?: number
  roughness?: number
}

export function Housing({
  width = 2.5,
  height = 2,
  depth = 1.5,
  holeRadius = 0.6,
  color = '#153658',
  metalness = 0.7,
  roughness = 0.4,
}: HousingProps) {
  const geometry = useMemo(() => {
    // Create rounded box shape
    const shape = new THREE.Shape()
    const radius = 0.2
    const w = width / 2
    const h = height / 2

    shape.moveTo(-w + radius, -h)
    shape.lineTo(w - radius, -h)
    shape.quadraticCurveTo(w, -h, w, -h + radius)
    shape.lineTo(w, h - radius)
    shape.quadraticCurveTo(w, h, w - radius, h)
    shape.lineTo(-w + radius, h)
    shape.quadraticCurveTo(-w, h, -w, h - radius)
    shape.lineTo(-w, -h + radius)
    shape.quadraticCurveTo(-w, -h, -w + radius, -h)

    // Add center hole
    const holePath = new THREE.Path()
    const segments = 32
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * holeRadius
      const y = Math.sin(angle) * holeRadius
      if (i === 0) {
        holePath.moveTo(x, y)
      } else {
        holePath.lineTo(x, y)
      }
    }
    shape.holes.push(holePath)

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.center()
    return geo
  }, [width, height, depth, holeRadius])

  // Add mounting holes/details
  const mountingHolePositions: [number, number, number][] = [
    [width / 2 - 0.3, height / 2 - 0.3, depth / 2 + 0.01],
    [-width / 2 + 0.3, height / 2 - 0.3, depth / 2 + 0.01],
    [width / 2 - 0.3, -height / 2 + 0.3, depth / 2 + 0.01],
    [-width / 2 + 0.3, -height / 2 + 0.3, depth / 2 + 0.01],
  ]

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      {/* Mounting hole indicators */}
      {mountingHolePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial
            color="#111111"
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}
