'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { Gear, Shaft, Bearing, Housing, Plate } from './parts'
import type { AssemblyPartConfig } from './parts'

interface AssemblyPartProps {
  config: AssemblyPartConfig
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function AssemblyPart({ config }: AssemblyPartProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!groupRef.current) return

    // Calculate progress within this part's scroll range
    const scrollLength = config.scrollEnd - config.scrollStart
    const rawProgress = scroll.range(config.scrollStart, scrollLength)

    // Apply easing for smoother animation
    const progress = easeInOutCubic(Math.min(1, Math.max(0, rawProgress)))

    // Interpolate position
    groupRef.current.position.x = lerp(
      config.assembledPosition[0],
      config.explodedPosition[0],
      progress
    )
    groupRef.current.position.y = lerp(
      config.assembledPosition[1],
      config.explodedPosition[1],
      progress
    )
    groupRef.current.position.z = lerp(
      config.assembledPosition[2],
      config.explodedPosition[2],
      progress
    )

    // Interpolate rotation
    groupRef.current.rotation.x = lerp(
      config.assembledRotation[0],
      config.explodedRotation[0],
      progress
    )
    groupRef.current.rotation.y = lerp(
      config.assembledRotation[1],
      config.explodedRotation[1],
      progress
    )
    groupRef.current.rotation.z = lerp(
      config.assembledRotation[2],
      config.explodedRotation[2],
      progress
    )
  })

  const scale = config.scale || 1

  const renderGeometry = () => {
    switch (config.geometry) {
      case 'gear':
        return (
          <Gear
            teeth={config.gearTeeth || 16}
            color={config.color}
            metalness={config.metalness}
            roughness={config.roughness}
          />
        )
      case 'shaft':
        return (
          <Shaft
            color={config.color}
            metalness={config.metalness}
            roughness={config.roughness}
          />
        )
      case 'bearing':
        return (
          <Bearing
            color={config.color}
            metalness={config.metalness}
            roughness={config.roughness}
          />
        )
      case 'housing':
        return (
          <Housing
            color={config.color}
            metalness={config.metalness}
            roughness={config.roughness}
          />
        )
      case 'plate':
        return (
          <Plate
            color={config.color}
            metalness={config.metalness}
            roughness={config.roughness}
          />
        )
      default:
        return null
    }
  }

  return (
    <group ref={groupRef} scale={scale}>
      {renderGeometry()}
    </group>
  )
}
