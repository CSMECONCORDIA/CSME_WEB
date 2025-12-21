'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-[180px] h-[50px] transition-transform group-hover:scale-105">
                <Image
                  src="/cropped-CSME-small-logo-acronym-text-2-1024x517.jpg"
                  alt="CSME Concordia University"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      px-4 py-2 text-sm font-medium uppercase tracking-wider
                      transition-all duration-300 relative
                      ${isActive
                        ? 'text-navy'
                        : 'text-slate-600 hover:text-navy'
                      }
                    `}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-navy" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden lg:flex btn-primary"
            >
              Join Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-navy"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
              CSME
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    py-4 px-4 text-2xl font-medium uppercase tracking-wider
                    transition-all duration-300 border-l-4
                    ${isActive
                      ? 'text-white border-white bg-white/10'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/50 hover:bg-white/5'
                    }
                  `}
                  style={{
                    fontFamily: 'var(--font-display)',
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-accent w-full justify-center"
            >
              Join CSME
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
