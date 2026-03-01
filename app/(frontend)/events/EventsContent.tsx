'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations'
import { GearDecoration } from '../components/GearDecoration'
import { ParallaxElement } from '../components/ParallaxElement'

export function EventsHero() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-900">
      <ParallaxElement speed={0.15} className="absolute top-0 right-0 text-navy/5 dark:text-white/5">
        <GearDecoration size={600} spin />
      </ParallaxElement>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <FadeIn>
            <span className="text-navy dark:text-navy-light font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              Events
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1
              className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Connect &
              <span className="text-navy dark:text-navy-light"> Grow</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              From technical workshops to industry networking nights, our events
              provide opportunities to learn, connect, and advance your career
              in mechanical engineering.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export function FeaturedEventSection({ children }: { children: ReactNode }) {
  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      <ParallaxElement speed={0.15} className="absolute top-0 right-0 text-white/5">
        <GearDecoration size={400} spin />
      </ParallaxElement>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-accent font-medium uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-display)' }}>
              Featured Event
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white">
            {children}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function UpcomingEventsSection({ children, isEmpty }: { children?: ReactNode; isEmpty?: boolean }) {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <h2
              className="text-3xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Upcoming Events
            </h2>
          </div>
        </FadeIn>

        {isEmpty ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700">
              <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No Upcoming Events
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We&apos;re planning exciting new events. Follow us on social media or
                subscribe to stay updated!
              </p>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="space-y-4" staggerDelay={0.08}>
            {children}
          </StaggerContainer>
        )}
      </div>
    </section>
  )
}

export function EventCardWrapper({ children }: { children: ReactNode }) {
  return <StaggerItem>{children}</StaggerItem>
}

interface PastEvent {
  id: string | number
  title: string
  date: string | number
  location?: string | null
}

export function PastEventsSection({ events }: { events: PastEvent[] }) {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3 h-3 bg-slate-400 dark:bg-slate-600 rounded-full" />
            <h2
              className="text-3xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Past Events
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.05}>
          {events.map((event) => (
            <StaggerItem key={event.id}>
              <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-start gap-4">
                  <div className="w-16 flex-shrink-0 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex flex-col items-center justify-center p-3">
                    <span className="text-xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                      {new Date(event.date).getUTCDate()}
                    </span>
                    <span className="text-xs uppercase tracking-wider mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-lg font-bold text-slate-900 dark:text-white mb-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

export function EventsCTA() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-5" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <FadeIn>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Don&apos;t Miss Out
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Stay connected with CSME Concordia. Be the first to know about our
            upcoming events, workshops, and networking opportunities.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link href="/contact" className="btn-accent">
            Contact Us
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
