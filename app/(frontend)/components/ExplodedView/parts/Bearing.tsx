'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface BearingProps {
  innerRadius?: number
  outerRadius?: number
  thickness?: number
  color?: string
  metalness?: number
  roughness?: number
}

export function Bearing({
  innerRadius = 0.2,
  outerRadius = 0.5,
  thickness = 0.2,
  color = '#71797E',
  metalness = 0.9,
  roughness = 0.15,
}: BearingProps) {
  const outerRingGeo = useMemo(() => {
    return new THREE.TorusGeometry(outerRadius, thickness / 2, 16, 48)
  }, [outerRadius, thickness])

  const innerRingGeo = useMemo(() => {
    return new THREE.TorusGeometry(innerRadius + 0.05, thickness / 3, 16, 48)
  }, [innerRadius, thickness])

  // Create ball bearings
  const balls = useMemo(() => {
    const ballPositions: [number, number, number][] = []
    const ballCount = 8
    const ballRadius = (outerRadius - innerRadius) / 4
    const centerRadius = (outerRadius + innerRadius) / 2

    for (let i = 0; i < ballCount; i++) {
      const angle = (i / ballCount) * Math.PI * 2
      ballPositions.push([
        Math.cos(angle) * centerRadius,
        Math.sin(angle) * centerRadius,
        0,
      ])
    }
    return { positions: ballPositions, radius: ballRadius }
  }, [outerRadius, innerRadius])

  return (
    <group>
      {/* Outer ring */}
      <mesh geometry={outerRingGeo}>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      {/* Inner ring */}
      <mesh geometry={innerRingGeo}>
        <meshStandardMaterial
          color={color}
          metalness={metalness + 0.05}
          roughness={roughness}
        />
      </mesh>

      {/* Ball bearings */}
      {balls.positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[balls.radius, 16, 16]} />
          <meshStandardMaterial
            color="#E8E8E8"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}
