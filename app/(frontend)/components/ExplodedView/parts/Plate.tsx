'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface PlateProps {
  width?: number
  height?: number
  thickness?: number
  holeRadius?: number
  color?: string
  metalness?: number
  roughness?: number
}

export function Plate({
  width = 2,
  height = 1.6,
  thickness = 0.15,
  holeRadius = 0.4,
  color = '#1e4b7a',
  metalness = 0.75,
  roughness = 0.35,
}: PlateProps) {
  const geometry = useMemo(() => {
    // Create rounded rectangle shape
    const shape = new THREE.Shape()
    const radius = 0.15
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
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.center()
    return geo
  }, [width, height, thickness, holeRadius])

  // Bolt positions
  const boltPositions: [number, number, number][] = [
    [width / 2 - 0.25, height / 2 - 0.25, thickness / 2 + 0.05],
    [-width / 2 + 0.25, height / 2 - 0.25, thickness / 2 + 0.05],
    [width / 2 - 0.25, -height / 2 + 0.25, thickness / 2 + 0.05],
    [-width / 2 + 0.25, -height / 2 + 0.25, thickness / 2 + 0.05],
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

      {/* Bolt heads */}
      {boltPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.06, 0.07, 0.08, 6]} />
          <meshStandardMaterial
            color="#4A5568"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}
