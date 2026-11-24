'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations'
import { GearDecoration } from '../components/GearDecoration'

export function BlogHero() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="absolute top-0 right-0 text-navy/5 dark:text-white/5">
        <GearDecoration size={600} spin />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <FadeIn>
            <span className="text-navy dark:text-navy-light font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              Blog
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1
              className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              News &
              <span className="text-navy dark:text-navy-light"> Updates</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              The latest from CSME Concordia.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

interface SortOption {
  value: string
  label: string
}

export function BlogSortBar({ options, current }: { options: SortOption[]; current: string }) {
  return (
    <nav aria-label="Sort posts" className="flex flex-wrap items-center gap-3 mb-12">
      <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort by</span>
      {options.map((option) => (
        <Link
          key={option.value}
          href={`/blog?sort=${option.value}`}
          scroll={false}
          aria-current={option.value === current ? 'true' : undefined}
          className={`border-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
            option.value === current
              ? 'border-navy bg-navy text-white'
              : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-navy hover:text-navy dark:hover:text-white'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  )
}

export function BlogGrid({ children }: { children: ReactNode }) {
  return (
    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
      {children}
    </StaggerContainer>
  )
}

export function BlogCardWrapper({ children }: { children: ReactNode }) {
  return <StaggerItem className="h-full">{children}</StaggerItem>
}

export function BlogPagination({ page, totalPages, sort }: { page: number; totalPages: number; sort: string }) {
  if (totalPages <= 1) return null
  const href = (p: number) => `/blog?sort=${sort}&page=${p}`

  return (
    <nav aria-label="Blog pages" className="flex items-center justify-center gap-6 mt-16">
      {page > 1 && (
        <Link href={href(page - 1)} className="btn-primary">
          Previous
        </Link>
      )}
      <span className="text-slate-500 dark:text-slate-400">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link href={href(page + 1)} className="btn-primary">
          Next
        </Link>
      )}
    </nav>
  )
}

export function BlogEmptyState() {
  return (
    <FadeIn>
      <div className="text-center py-16 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          No Posts Yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Check back soon for news and updates.</p>
      </div>
    </FadeIn>
  )
}
