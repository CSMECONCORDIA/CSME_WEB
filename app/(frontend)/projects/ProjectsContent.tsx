'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations'
import { GearDecoration } from '../components/GearDecoration'

export function ProjectsHero() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="absolute top-0 right-0 text-navy/5 dark:text-white/5">
        <GearDecoration size={600} spin />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <FadeIn>
            <span className="text-navy dark:text-navy-light font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              Our Projects
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1
              className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Engineering
              <span className="text-navy dark:text-navy-light"> Innovation</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Discover the projects our members are working on - from competition
              vehicles to cutting-edge research. Each project offers hands-on
              experience and the opportunity to make a real impact.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

interface ProjectsSectionProps {
  title: string
  statusColor: string
  children: ReactNode
  animate?: boolean
}

export function ProjectsSection({ title, statusColor, children, animate = true }: ProjectsSectionProps) {
  return (
    <div className="mb-20">
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-3 h-3 ${statusColor} rounded-full ${statusColor.includes('navy') ? 'animate-pulse' : ''}`} />
          <h2
            className="text-3xl font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
        </div>
      </FadeIn>
      {animate ? (
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {children}
        </StaggerContainer>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children}
        </div>
      )}
    </div>
  )
}

export function ProjectCardWrapper({ children }: { children: ReactNode }) {
  return <StaggerItem>{children}</StaggerItem>
}

export function ProjectsEmptyState() {
  return (
    <FadeIn>
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full mb-8">
          <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          No Projects Yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          We&apos;re working on exciting new projects. Check back soon or contact us
          to learn about upcoming opportunities!
        </p>
        <a href="/contact" className="btn-primary">
          Get Involved
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </FadeIn>
  )
}

export function ProjectsCTA() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-5" />
      <div className="absolute -right-20 -bottom-20 text-white/5">
        <GearDecoration size={400} spin reverse />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <FadeIn>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Have a Project Idea?
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            We&apos;re always looking for new projects and ideas. If you have a concept
            you&apos;d like to explore, we&apos;d love to hear from you.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link href="/contact" className="btn-accent">
            Submit Your Idea
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
