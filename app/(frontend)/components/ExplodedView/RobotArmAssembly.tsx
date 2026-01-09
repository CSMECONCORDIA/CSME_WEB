'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

interface PartData {
  object: THREE.Object3D
  originalPosition: THREE.Vector3
  explodedOffset: THREE.Vector3
  // When this part completes (0-1), all parts start at 0
  completionPoint: number
}

// Easing function - ease out for immediate visual response
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// Easing for zoom/rotation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function RobotArmAssembly() {
  const groupRef = useRef<THREE.Group>(null)
  const scaleRef = useRef(0.3) // Start zoomed out
  const scroll = useScroll()
  const { scene: baseScene } = useGLTF('/models/robot-arm.glb')
  const { scene: upperScene } = useGLTF('/models/robot-arm-upper.glb')
  const partsDataRef = useRef<PartData[]>([])
  const initializedRef = useRef(false)

  // Clone and combine scenes
  const clonedScene = useMemo(() => {
    const group = new THREE.Group()

    const base = baseScene.clone(true)
    const upper = upperScene.clone(true)

    // Add both to the group - position can be adjusted later
    group.add(base)
    group.add(upper)

    console.log('Models loaded - base meshes:', base.children.length, 'upper meshes:', upper.children.length)

    return group
  }, [baseScene, upperScene])

  // Calculate bounding box and scaling
  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
    const c = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(c)
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    // Target size of about 5 units
    const scale = 5 / maxDim
    return { center: c, scaleFactor: scale, size }
  }, [clonedScene])

  // Set up parts for explosion - run once after mount
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const parts: PartData[] = []

    // Get all meshes from the scene
    const meshes: THREE.Object3D[] = []
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child)
      }
    })

    // If we have individual meshes, use those
    // Otherwise fall back to top-level children
    const objectsToExplode = meshes.length > 1 ? meshes : clonedScene.children

    console.log(`Found ${objectsToExplode.length} parts to explode`)

    objectsToExplode.forEach((obj, index) => {
      // Store original position
      const originalPos = obj.position.clone()

      // Calculate explosion direction based on object's position relative to center
      // First get the world position
      const worldPos = new THREE.Vector3()
      obj.getWorldPosition(worldPos)

      // Direction from center
      const direction = worldPos.clone().sub(center)

      // If the object is at the center, give it a unique direction
      if (direction.length() < 0.01) {
        const angle = (index / objectsToExplode.length) * Math.PI * 2
        direction.set(
          Math.cos(angle) * 2,
          (index % 3 - 1) * 0.5,
          Math.sin(angle) * 2
        )
      } else {
        direction.normalize()
      }

      // Calculate explosion offset - parts start completely offscreen
      // Since we scale the model down, offsets need to be in model's original coordinate space
      const explosionMagnitude = (30 + index * 5) / scaleFactor
      const explodedOffset = direction.multiplyScalar(explosionMagnitude)

      // Store magnitude temporarily
      parts.push({
        object: obj,
        originalPosition: originalPos,
        explodedOffset,
        completionPoint: explosionMagnitude, // Will be normalized below
      })
    })

    // Now normalize completion points based on distance
    // Closer parts (smaller magnitude) complete first, further parts complete later
    const magnitudes = parts.map(p => p.completionPoint)
    const minMag = Math.min(...magnitudes)
    const maxMag = Math.max(...magnitudes)
    const magRange = maxMag - minMag || 1

    parts.forEach(part => {
      // Normalize: 0 = closest, 1 = furthest
      const normalized = (part.completionPoint - minMag) / magRange
      // Map to completion range: closest completes at 0.15, furthest at 1.0
      // Wide range = more staggered, one-by-one arrivals
      part.completionPoint = 0.15 + normalized * 0.85
    })

    partsDataRef.current = parts
  }, [clonedScene, center, scaleFactor])

  useFrame(() => {
    if (!groupRef.current) return

    const offset = scroll.offset

    // ZOOM EFFECT: Start small and far, zoom in as we scroll
    const zoomProgress = easeInOutCubic(Math.min(offset * 1.5, 1))
    const targetScale = 0.4 + zoomProgress * 0.6 // Scale from 0.4 to 1.0
    scaleRef.current += (targetScale - scaleRef.current) * 0.1
    groupRef.current.scale.setScalar(scaleRef.current)

    // Dramatic rotation - full rotation as parts assemble
    groupRef.current.rotation.y = offset * Math.PI * 2

    // Tilt that settles as assembly completes
    groupRef.current.rotation.x = (1 - offset) * 0.3

    // Animate each part - all start at scroll 0, complete at staggered times
    partsDataRef.current.forEach((part) => {
      const { object, originalPosition, explodedOffset, completionPoint } = part

      // Progress from 0 to 1 based on scroll position and this part's completion point
      const progress = Math.min(offset / completionPoint, 1)

      // Apply easing - ease out for immediate visual response
      const easedProgress = easeOutCubic(progress)

      // assembleProgress: 1 = exploded, 0 = assembled
      const assembleProgress = 1 - easedProgress

      object.position.set(
        originalPosition.x + explodedOffset.x * assembleProgress,
        originalPosition.y + explodedOffset.y * assembleProgress,
        originalPosition.z + explodedOffset.z * assembleProgress
      )
    })
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} scale={scaleFactor} />
      </Center>
    </group>
  )
}

// Preload the models
useGLTF.preload('/models/robot-arm.glb')
useGLTF.preload('/models/robot-arm-upper.glb')
