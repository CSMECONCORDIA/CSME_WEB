'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface GearProps {
  innerRadius?: number
  outerRadius?: number
  teeth?: number
  thickness?: number
  color?: string
  metalness?: number
  roughness?: number
}

function createGearShape(innerRadius: number, outerRadius: number, teeth: number): THREE.Shape {
  const shape = new THREE.Shape()
  const toothDepth = (outerRadius - innerRadius) * 0.4
  const toothWidth = (2 * Math.PI) / teeth / 2

  // Start at the first tooth
  const startAngle = 0
  const baseRadius = outerRadius - toothDepth

  shape.moveTo(
    Math.cos(startAngle) * baseRadius,
    Math.sin(startAngle) * baseRadius
  )

  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2

    // Tooth base left
    const baseLeftAngle = angle
    // Tooth tip left
    const tipLeftAngle = angle + toothWidth * 0.3
    // Tooth tip right
    const tipRightAngle = angle + toothWidth * 0.7
    // Tooth base right
    const baseRightAngle = angle + toothWidth
    // Valley
    const valleyAngle = angle + toothWidth * 1.5
    // Next tooth start
    const nextBaseAngle = angle + (2 * Math.PI) / teeth

    // Draw tooth profile
    shape.lineTo(
      Math.cos(baseLeftAngle) * baseRadius,
      Math.sin(baseLeftAngle) * baseRadius
    )
    shape.lineTo(
      Math.cos(tipLeftAngle) * outerRadius,
      Math.sin(tipLeftAngle) * outerRadius
    )
    shape.lineTo(
      Math.cos(tipRightAngle) * outerRadius,
      Math.sin(tipRightAngle) * outerRadius
    )
    shape.lineTo(
      Math.cos(baseRightAngle) * baseRadius,
      Math.sin(baseRightAngle) * baseRadius
    )

    // Valley between teeth
    if (i < teeth - 1) {
      shape.lineTo(
        Math.cos(nextBaseAngle) * baseRadius,
        Math.sin(nextBaseAngle) * baseRadius
      )
    }
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

export function Gear({
  innerRadius = 0.2,
  outerRadius = 1,
  teeth = 16,
  thickness = 0.3,
  color = '#1e4b7a',
  metalness = 0.85,
  roughness = 0.2,
}: GearProps) {
  const geometry = useMemo(() => {
    const shape = createGearShape(innerRadius, outerRadius, teeth)
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
  }, [innerRadius, outerRadius, teeth, thickness])

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
