'use client'

import Link from 'next/link'
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations'
import { GearDecoration } from '../components/GearDecoration'

export function InventoryDashboard() {
  const features = [
    {
      title: 'Checkout Station',
      description: 'Scan your student card and items to check out equipment from the lab.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      ),
      href: '/inventory/checkout',
      color: 'bg-green-500',
    },
    {
      title: 'Browse Inventory',
      description: 'View all available tools, equipment, and materials in the lab.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      href: '/admin/collections/inventory-items',
      color: 'bg-blue-500',
    },
    {
      title: 'View History',
      description: 'Check your checkout history and current borrowed items.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      href: '/admin/collections/checkouts',
      color: 'bg-purple-500',
    },
  ]

  const categories = [
    { name: 'Hand Tools', count: '—', icon: '🔧' },
    { name: 'Power Tools', count: '—', icon: '🔨' },
    { name: 'Electronics', count: '—', icon: '⚡' },
    { name: 'Microcontrollers', count: '—', icon: '🤖' },
    { name: '3D Printing', count: '—', icon: '🖨️' },
    { name: 'Safety', count: '—', icon: '🥽' },
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="absolute top-0 right-0 text-slate-200/50 dark:text-white/5">
          <GearDecoration size={400} spin />
        </div>
        <div className="absolute bottom-0 left-0 text-slate-200/30 dark:text-white/5">
          <GearDecoration size={300} spin reverse />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <span
                className="font-medium uppercase tracking-wider text-sm text-navy dark:text-navy-light mb-4 block"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Lab Equipment
              </span>
              <h1
                className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Inventory System
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Check out tools, equipment, and materials from the CSME lab. Scan your student card to get started.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quick Actions
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <Link
                  href={feature.href}
                  className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 card-hover group"
                >
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-xl font-bold text-slate-900 dark:text-white mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Equipment Categories
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.05}>
            {categories.map((category) => (
              <StaggerItem key={category.name}>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                  <span className="text-3xl mb-2 block">{category.icon}</span>
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                    {category.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {category.count} items
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              How It Works
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-4 gap-8" staggerDelay={0.1}>
            {[
              {
                step: '1',
                title: 'Scan Your Card',
                description: 'Use your student card at the checkout station',
              },
              {
                step: '2',
                title: 'Scan Items',
                description: 'Scan the barcode of items you want to borrow',
              },
              {
                step: '3',
                title: 'Confirm Checkout',
                description: 'Review your cart and complete the checkout',
              },
              {
                step: '4',
                title: 'Return Items',
                description: 'Bring items back before the due date',
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-navy dark:bg-navy-light text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3
                    className="text-lg font-bold text-slate-900 dark:text-white mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -right-20 -bottom-20 text-white/5">
          <GearDecoration size={300} spin reverse />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ready to Check Out Equipment?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Head to the checkout station in the lab or use the digital checkout below.
            </p>
            <Link href="/inventory/checkout" className="btn-accent inline-flex">
              Go to Checkout Station
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
