'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { FadeIn, StaggerContainer, StaggerItem } from './ScrollAnimations'
import { GearDecoration } from './GearDecoration'

interface AnimatedSectionHeaderProps {
  subtitle: string
  title: string
  linkHref?: string
  linkText?: string
  dark?: boolean
}

export function AnimatedSectionHeader({
  subtitle,
  title,
  linkHref,
  linkText,
  dark = false,
}: AnimatedSectionHeaderProps) {
  return (
    <FadeIn>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div>
          <span
            className={`font-medium uppercase tracking-wider text-sm mb-2 block ${dark ? 'text-navy-light' : 'text-navy'}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {subtitle}
          </span>
          <h2
            className={`text-4xl lg:text-5xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
        </div>
        {linkHref && linkText && (
          <Link href={linkHref} className="btn-outline self-start lg:self-auto">
            {linkText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
    </FadeIn>
  )
}

interface AnimatedCardsGridProps {
  children: ReactNode
  className?: string
}

export function AnimatedCardsGrid({ children, className = '' }: AnimatedCardsGridProps) {
  return (
    <StaggerContainer className={className} staggerDelay={0.1}>
      {children}
    </StaggerContainer>
  )
}

export function AnimatedCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <StaggerItem className={className}>{children}</StaggerItem>
}

interface AnimatedCTASectionProps {
  title: string
  description: string
  primaryLink: { href: string; text: string }
  secondaryLink?: { href: string; text: string }
}

export function AnimatedCTASection({
  title,
  description,
  primaryLink,
  secondaryLink,
}: AnimatedCTASectionProps) {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute -right-20 -bottom-20 text-white/5">
        <GearDecoration size={400} spin reverse />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <FadeIn>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            {description}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={primaryLink.href} className="btn-accent">
              {primaryLink.text}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            {secondaryLink && (
              <Link href={secondaryLink.href} className="btn-outline border-white text-white hover:bg-white hover:text-navy">
                {secondaryLink.text}
              </Link>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

interface AnimatedFeaturedEventProps {
  children: ReactNode
}

export function AnimatedFeaturedEvent({ children }: AnimatedFeaturedEventProps) {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 text-white/5">
        <GearDecoration size={400} spin />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span
              className="text-accent font-medium uppercase tracking-wider text-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Next Event
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white">{children}</div>
        </FadeIn>
      </div>
    </section>
  )
}

interface AnimatedEventsListProps {
  children: ReactNode
}

export function AnimatedEventsList({ children }: AnimatedEventsListProps) {
  return (
    <StaggerContainer className="space-y-4" staggerDelay={0.08}>
      {children}
    </StaggerContainer>
  )
}
