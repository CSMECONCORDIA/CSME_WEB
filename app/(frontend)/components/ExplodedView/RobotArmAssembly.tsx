'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

interface PartData {
  object: THREE.Object3D
  originalPosition: THREE.Vector3
  explodedOffset: THREE.Vector3
  scrollStart: number
  scrollEnd: number
}

// Easing function for smooth animation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function RobotArmAssembly() {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const { scene } = useGLTF('/models/robot-arm.glb')
  const partsDataRef = useRef<PartData[]>([])
  const initializedRef = useRef(false)

  // Clone scene once
  const clonedScene = useMemo(() => scene.clone(true), [scene])

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

      // Calculate explosion offset (need to account for model scale)
      // Since we scale the model down, offsets need to be in model's original coordinate space
      const explosionMagnitude = (3 + index * 0.5) / scaleFactor
      const explodedOffset = direction.multiplyScalar(explosionMagnitude)

      // Stagger animation timing - spread across full scroll
      // Parts assemble in reverse order (last part first, first part last)
      const totalParts = objectsToExplode.length
      const reverseIndex = totalParts - 1 - index
      const scrollStart = (reverseIndex / totalParts) * 0.7
      const scrollEnd = scrollStart + 0.3

      parts.push({
        object: obj,
        originalPosition: originalPos,
        explodedOffset,
        scrollStart,
        scrollEnd,
      })
    })

    partsDataRef.current = parts
  }, [clonedScene, center, scaleFactor])

  useFrame(() => {
    if (!groupRef.current) return

    const offset = scroll.offset

    // Global rotation based on scroll
    groupRef.current.rotation.y = offset * Math.PI * 0.6

    // Animate each part - REVERSE: start exploded, assemble as we scroll
    partsDataRef.current.forEach((part) => {
      const { object, originalPosition, explodedOffset, scrollStart, scrollEnd } = part

      // Calculate progress for this part
      let progress = 0
      if (offset >= scrollStart && offset <= scrollEnd) {
        progress = (offset - scrollStart) / (scrollEnd - scrollStart)
      } else if (offset > scrollEnd) {
        progress = 1
      }

      // Apply easing
      const easedProgress = easeInOutCubic(progress)

      // REVERSE: 1 - progress means we start exploded and assemble over time
      const assembleProgress = 1 - easedProgress

      // Set position: original + (offset * assembleProgress)
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

// Preload the model
useGLTF.preload('/models/robot-arm.glb')
