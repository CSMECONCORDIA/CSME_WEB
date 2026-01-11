'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface ContentSectionProps {
  scrollPosition: number // Position in pages (0-5)
  title: string
  subtitle?: string
  description: string
  alignment?: 'left' | 'right' | 'center'
  showCTA?: boolean
}

export function ContentSection({
  scrollPosition,
  title,
  subtitle,
  description,
  alignment = 'left',
  showCTA = false,
}: ContentSectionProps) {
  const topPosition = `${scrollPosition * 100}vh`

  const alignmentClasses = {
    left: 'left-6 md:left-12 lg:left-20 text-left',
    right: 'right-6 md:right-12 lg:right-20 text-right',
    center: 'left-1/2 -translate-x-1/2 text-center',
  }

  const contentMaxWidth = alignment === 'center' ? 'max-w-2xl' : 'max-w-md'

  return (
    <div
      className={`absolute ${alignmentClasses[alignment]} ${contentMaxWidth} px-4`}
      style={{ top: topPosition }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        viewport={{ once: true, margin: '-100px' }}
        className="py-20"
      >
        {subtitle && (
          <span className="inline-block text-navy dark:text-navy-light font-medium uppercase tracking-wider text-sm mb-3">
            {subtitle}
          </span>
        )}
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {description}
        </p>

        {showCTA && (
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link
              href="/about"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-navy hover:bg-navy-dark transition-all duration-300"
            >
              Learn More
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-navy dark:text-white border-2 border-navy dark:border-white hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-all duration-300"
            >
              View Projects
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
