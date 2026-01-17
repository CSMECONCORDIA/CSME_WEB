'use client'

import Link from 'next/link'
import { FadeIn } from './ScrollAnimations'
import { GearDecoration } from './GearDecoration'

export function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
      {/* Background Decorations */}
      <div className="absolute top-20 right-0 text-navy dark:text-white opacity-10 dark:opacity-5">
        <GearDecoration size={500} spin />
      </div>
      <div className="absolute bottom-0 left-0 text-navy dark:text-white opacity-5">
        <GearDecoration size={350} spin reverse />
      </div>

      {/* Technical Lines */}
      <div className="absolute top-1/3 left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-navy/20 dark:via-white/10 to-transparent" />
      <div className="absolute top-2/3 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-navy/20 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <FadeIn direction="up" duration={0.8}>
            <div>
              <div className="hero-subtitle text-navy dark:text-navy-light mb-4">
                Canadian Society for Mechanical Engineering - Concordia Chapter
              </div>
              <h1 className="hero-title text-slate-900 dark:text-white mb-6">
                Engineering
                <span className="block text-navy dark:text-navy-light">Tomorrow&apos;s</span>
                Solutions
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg leading-relaxed">
                At Concordia University, we connect aspiring engineers with industry,
                foster innovation through hands-on projects, and build a community
                that shapes the future of mechanical engineering.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects" className="btn-primary">
                  Explore Projects
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/about" className="btn-outline">
                  About Us
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                <FadeIn delay={0.3}>
                  <div className="text-4xl font-bold text-navy dark:text-navy-light" style={{ fontFamily: 'var(--font-display)' }}>50+</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Active Members</div>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <div className="text-4xl font-bold text-navy dark:text-navy-light" style={{ fontFamily: 'var(--font-display)' }}>12+</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Projects</div>
                </FadeIn>
                <FadeIn delay={0.5}>
                  <div className="text-4xl font-bold text-navy dark:text-navy-light" style={{ fontFamily: 'var(--font-display)' }}>20+</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Events/Year</div>
                </FadeIn>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-400 dark:from-slate-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
