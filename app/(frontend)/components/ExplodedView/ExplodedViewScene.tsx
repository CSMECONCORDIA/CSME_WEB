'use client'

import { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Environment } from '@react-three/drei'
import { RobotArmAssembly } from './RobotArmAssembly'
import { contentSections } from './parts'

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1e4b7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading experience...</p>
      </div>
    </div>
  )
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#2d6aa3" />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* The robot arm assembly */}
      <RobotArmAssembly />
    </>
  )
}

// HTML Content section component
function HtmlContent({ section, index, isLast }: {
  section: typeof contentSections[0]
  index: number
  isLast: boolean
}) {
  const alignmentClasses = {
    left: 'left-6 md:left-12 lg:left-20 text-left',
    right: 'right-6 md:right-12 lg:right-20 text-right',
    center: 'left-1/2 -translate-x-1/2 text-center',
  }

  const contentMaxWidth = section.alignment === 'center' ? 'max-w-2xl' : 'max-w-md'

  return (
    <div
      className={`absolute ${alignmentClasses[section.alignment]} ${contentMaxWidth} px-4`}
      style={{ top: `${section.scrollPosition * 100}vh` }}
    >
      <div className="py-20 backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-lg shadow-slate-900/10">
        {section.subtitle && (
          <span className="inline-block text-[#1e4b7a] font-medium uppercase tracking-wider text-sm mb-3">
            {section.subtitle}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          {section.title}
        </h2>
        <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6">
          {section.description}
        </p>

        {isLast && (
          <div className={`flex flex-wrap gap-4 mt-8 ${section.alignment === 'center' ? 'justify-center' : ''}`}>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#1e4b7a] hover:bg-[#153658] transition-all duration-300"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#1e4b7a] border-2 border-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white transition-all duration-300"
            >
              View Projects
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function CanvasContent() {
  return (
    <ScrollControls pages={5} damping={0.3}>
      {/* 3D Scene */}
      <Scene />

      {/* HTML Content overlays */}
      <Scroll html style={{ width: '100%' }}>
        <div className="w-full relative">
          {/* Scroll indicator at top */}
          <div className="absolute top-[80vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 pointer-events-none">
            <span className="text-sm font-medium uppercase tracking-wider">Scroll to Explore</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Content sections */}
          {contentSections.map((section, index) => (
            <HtmlContent
              key={section.id}
              section={section}
              index={index}
              isLast={index === contentSections.length - 1}
            />
          ))}
        </div>
      </Scroll>
    </ScrollControls>
  )
}

export function ExplodedViewScene() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-screen w-full relative">
        <LoadingFallback />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-screen w-full relative">
      <Canvas
        key="main-canvas"
        camera={{ position: [0, 0, 12], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'
        }}
      >
        <Suspense fallback={null}>
          <CanvasContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
