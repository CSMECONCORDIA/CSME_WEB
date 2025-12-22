'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import headerLogoLight from '../../../media/12.png'
import headerLogoDark from '../../../media/13.png'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = stored ? stored === 'dark' : prefersDark
    setIsDarkMode(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
    document.documentElement.style.colorScheme = shouldUseDark ? 'dark' : 'light'
  }, [])

  const toggleTheme = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.style.colorScheme = next ? 'dark' : 'light'
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-950/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-[180px] h-[50px] transition-transform group-hover:scale-105">
                <Image
                  src={headerLogoLight}
                  alt="CSME Concordia University"
                  fill
                  className="object-contain theme-logo-light"
                  priority
                />
                <Image
                  src={headerLogoDark}
                  alt="CSME Concordia University"
                  fill
                  className="object-contain theme-logo-dark"
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
                        ? 'text-navy dark:text-white'
                        : 'text-slate-600 hover:text-navy dark:text-slate-300 dark:hover:text-white'
                      }
                    `}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-navy dark:bg-white" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {/* CTA Button */}
              <Link
                href="/contact"
                className="btn-primary"
              >
                Join Us
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-navy hover:text-navy dark:border-slate-700 dark:text-slate-300 dark:hover:border-white/70 dark:hover:text-white"
                aria-label="Toggle dark mode"
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 0112 4.75zm0 14a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm7.25-6.75a.75.75 0 01.75-.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75zM4.75 12a.75.75 0 01-.75.75v-.5a.75.75 0 011.5 0v.5A.75.75 0 014.75 12zm11.51-6.01a.75.75 0 011.06 0l.35.36a.75.75 0 11-1.06 1.06l-.35-.35a.75.75 0 010-1.07zM6.62 17.38a.75.75 0 011.06 0l.35.35a.75.75 0 11-1.06 1.06l-.35-.35a.75.75 0 010-1.06zm10.76 1.06a.75.75 0 010 1.06l-.35.35a.75.75 0 11-1.06-1.06l.35-.35a.75.75 0 011.06 0zM7.68 6.68a.75.75 0 010 1.06l-.35.35a.75.75 0 11-1.06-1.06l.35-.35a.75.75 0 011.06 0zM12 7a5 5 0 100 10 5 5 0 000-10z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 15.5A8.5 8.5 0 1110.5 3a.75.75 0 01.68 1.06 7 7 0 009.76 9.76A.75.75 0 0121 15.5z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-navy hover:text-navy dark:border-slate-700 dark:text-slate-300 dark:hover:border-white/70 dark:hover:text-white"
                aria-label="Toggle dark mode"
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 0112 4.75zm0 14a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm7.25-6.75a.75.75 0 01.75-.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75zM4.75 12a.75.75 0 01-.75.75v-.5a.75.75 0 011.5 0v.5A.75.75 0 014.75 12zm11.51-6.01a.75.75 0 011.06 0l.35.36a.75.75 0 11-1.06 1.06l-.35-.35a.75.75 0 010-1.07zM6.62 17.38a.75.75 0 011.06 0l.35.35a.75.75 0 11-1.06 1.06l-.35-.35a.75.75 0 010-1.06zm10.76 1.06a.75.75 0 010 1.06l-.35.35a.75.75 0 11-1.06-1.06l.35-.35a.75.75 0 011.06 0zM7.68 6.68a.75.75 0 010 1.06l-.35.35a.75.75 0 11-1.06-1.06l.35-.35a.75.75 0 011.06 0zM12 7a5 5 0 100 10 5 5 0 000-10z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 15.5A8.5 8.5 0 1110.5 3a.75.75 0 01.68 1.06 7 7 0 009.76 9.76A.75.75 0 0121 15.5z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-navy dark:text-white"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
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
