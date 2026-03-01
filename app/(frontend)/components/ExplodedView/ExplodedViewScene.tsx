'use client'

import { Suspense, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Environment } from '@react-three/drei'
import Link from 'next/link'
import { RobotArmAssembly } from './RobotArmAssembly'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ExplodedViewSceneProps {
  nextEvent?: {
    title: string
    slug: string
    date: string
    location?: string | null
    registrationLink?: string | null
  } | null
  stats?: {
    projectCount: number
    upcomingEventCount: number
  }
}

// ── Social links (shared between sections 1 & 4) ──────────────────────────────

const SOCIAL_LINKS = [
  {
    href: 'https://www.instagram.com/csmeconcordia',
    label: 'Instagram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/csmeconcordia',
    label: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: 'https://discord.com/invite/7nzgpd5qee',
    label: 'Discord',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
    ),
  },
]

// ── Activity highlights for "What We Build" section ────────────────────────────

const ACTIVITIES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Design Projects',
    description: 'Hands-on builds from concept to prototype',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Workshops',
    description: 'CAD, FEA, 3D printing, and more',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Industry Events',
    description: 'Speaker panels, tours, and networking',
  },
]

// ── Shared overlay card wrapper ────────────────────────────────────────────────

function OverlayCard({
  scrollPosition,
  alignment,
  children,
}: {
  scrollPosition: number
  alignment: 'left' | 'right' | 'center'
  children: React.ReactNode
}) {
  const alignmentClasses = {
    left: 'left-6 md:left-12 lg:left-20 text-left',
    right: 'right-6 md:right-12 lg:right-20 text-right',
    center: 'inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 text-center',
  }
  const maxWidth = alignment === 'center' ? 'md:max-w-2xl' : 'max-w-md'

  return (
    <div
      className={`absolute ${alignmentClasses[alignment]} ${maxWidth}`}
      style={{ top: `${scrollPosition * 100}vh` }}
    >
      <div className="py-20 backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-lg shadow-slate-900/10">
        {children}
      </div>
    </div>
  )
}

// ── Section 1: Intro + social icons ────────────────────────────────────────────

function IntroSection() {
  return (
    <>
      <span className="inline-block text-[#1e4b7a] font-medium uppercase tracking-wider text-sm mb-3">
        Student-led. Hands-on. Connected.
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
        CSME Concordia
      </h2>
      <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6">
        We are the Mechanical Engineering student club at Concordia, bringing curious minds together through projects, workshops, and industry events.
      </p>
      <div className="flex gap-3">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1e4b7a]/10 text-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white transition-all duration-300"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </>
  )
}

// ── Section 2: Next Event ──────────────────────────────────────────────────────

function NextEventSection({
  nextEvent,
}: {
  nextEvent?: ExplodedViewSceneProps['nextEvent']
}) {
  if (!nextEvent) {
    return (
      <>
        <span className="inline-block text-[#1e4b7a] font-medium uppercase tracking-wider text-sm mb-3">
          Events
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          Stay Tuned
        </h2>
        <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6">
          No upcoming events right now — check back soon or browse past events.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-[#1e4b7a] hover:bg-[#153658] transition-all duration-300 text-sm"
        >
          Browse Events
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </>
    )
  }

  const eventDate = new Date(nextEvent.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Toronto',
  })
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Toronto',
  })

  return (
    <>
      <span className="inline-block text-[#1e4b7a] font-medium uppercase tracking-wider text-sm mb-3">
        Next Event
      </span>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
        {nextEvent.title}
      </h2>
      <div className="space-y-1.5 mb-5 text-slate-600 text-sm md:text-base">
        <p className="flex items-center gap-2 justify-end">
          <svg className="w-4 h-4 text-[#1e4b7a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate} at {formattedTime}
        </p>
        {nextEvent.location && (
          <p className="flex items-center gap-2 justify-end">
            <svg className="w-4 h-4 text-[#1e4b7a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {nextEvent.location}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3 justify-end">
        {nextEvent.registrationLink && (
          <a
            href={nextEvent.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-[#1e4b7a] hover:bg-[#153658] transition-all duration-300 text-sm"
          >
            Register
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        <Link
          href={`/events/${nextEvent.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[#1e4b7a] border-2 border-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white transition-all duration-300 text-sm"
        >
          Learn More
        </Link>
      </div>
    </>
  )
}

// ── Section 3: What We Build ───────────────────────────────────────────────────

function WhatWeBuildSection() {
  return (
    <>
      <span className="inline-block text-[#1e4b7a] font-medium uppercase tracking-wider text-sm mb-3">
        Build, test, iterate
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
        What We Do
      </h2>
      <div className="space-y-3 mb-5">
        {ACTIVITIES.map((activity) => (
          <div key={activity.title} className="flex items-start gap-3">
            <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-[#1e4b7a]/10 text-[#1e4b7a]">
              {activity.icon}
            </span>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{activity.title}</p>
              <p className="text-slate-600 text-sm">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[#1e4b7a] border-2 border-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white transition-all duration-300 text-sm"
      >
        Explore Projects
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </>
  )
}

// ── Section 4: Connect With Us (larger social links) ───────────────────────────

function SocialLinksSection() {
  return (
    <>
      <span className="inline-block text-[#1e4b7a] font-medium uppercase tracking-wider text-sm mb-3">
        Stay Connected
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
        Connect With Us
      </h2>
      <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6">
        Follow along for project updates, event announcements, and behind-the-scenes looks at what we&apos;re building.
      </p>
      <div className="flex flex-col gap-3">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1e4b7a]/5 hover:bg-[#1e4b7a] text-[#1e4b7a] hover:text-white transition-all duration-300 group justify-end"
          >
            <span className="font-semibold text-sm">{link.label}</span>
            <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1e4b7a]/10 group-hover:bg-white/20 transition-colors duration-300">
              {link.icon}
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

// ── Section 5: CTA with quick stats ────────────────────────────────────────────

function CTASection({ stats }: { stats?: ExplodedViewSceneProps['stats'] }) {
  return (
    <>
      <span className="inline-block text-[#1e4b7a] font-medium uppercase tracking-wider text-sm mb-3">
        All majors welcome
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
        Join CSME
      </h2>
      <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6">
        Whether you want to build, lead, or learn, there is a place for you in our club.
      </p>

      {stats && (stats.projectCount > 0 || stats.upcomingEventCount > 0) && (
        <div className="flex justify-center gap-8 mb-6">
          {stats.projectCount > 0 && (
            <div className="text-center">
              <span className="block text-3xl font-bold text-[#1e4b7a]">{stats.projectCount}</span>
              <span className="text-sm text-slate-500">Projects</span>
            </div>
          )}
          {stats.upcomingEventCount > 0 && (
            <div className="text-center">
              <span className="block text-3xl font-bold text-[#1e4b7a]">{stats.upcomingEventCount}</span>
              <span className="text-sm text-slate-500">Upcoming Events</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#1e4b7a] hover:bg-[#153658] transition-all duration-300"
        >
          Join Us
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#1e4b7a] border-2 border-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white transition-all duration-300"
        >
          View Projects
        </Link>
      </div>
    </>
  )
}

// ── 3D Scene (unchanged) ───────────────────────────────────────────────────────

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
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#2d6aa3" />
      <Environment preset="city" />
      <RobotArmAssembly />
    </>
  )
}

// ── Canvas content with overlay sections ───────────────────────────────────────

function CanvasContent({ nextEvent, stats }: ExplodedViewSceneProps) {
  return (
    <ScrollControls pages={5} damping={0.3}>
      <Scene />

      <Scroll html style={{ width: '100%' }}>
        <div className="w-full relative">
          {/* Scroll indicator */}
          <div className="absolute top-[80vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 pointer-events-none">
            <span className="text-sm font-medium uppercase tracking-wider">Scroll to Explore</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Section 1: Intro + social icons */}
          <OverlayCard scrollPosition={0.3} alignment="left">
            <IntroSection />
          </OverlayCard>

          {/* Section 2: Next Event */}
          <OverlayCard scrollPosition={1.2} alignment="right">
            <NextEventSection nextEvent={nextEvent} />
          </OverlayCard>

          {/* Section 3: What We Do */}
          <OverlayCard scrollPosition={2.2} alignment="left">
            <WhatWeBuildSection />
          </OverlayCard>

          {/* Section 4: Connect With Us */}
          <OverlayCard scrollPosition={3.2} alignment="right">
            <SocialLinksSection />
          </OverlayCard>

          {/* Section 5: Join CSME CTA */}
          <OverlayCard scrollPosition={4.2} alignment="center">
            <CTASection stats={stats} />
          </OverlayCard>
        </div>
      </Scroll>
    </ScrollControls>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

export function ExplodedViewScene({ nextEvent, stats }: ExplodedViewSceneProps) {
  const [mounted] = useState(() => typeof window !== 'undefined')
  const containerRef = useRef<HTMLDivElement>(null)

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
          background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
        }}
      >
        <Suspense fallback={null}>
          <CanvasContent nextEvent={nextEvent} stats={stats} />
        </Suspense>
      </Canvas>
    </div>
  )
}
