'use client'

import { ReactNode } from 'react'
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations'
import { GearDecoration } from '../components/GearDecoration'

const contactInfo = [
  {
    title: 'Email',
    value: 'info.csme@ecaconcordia.ca',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Location',
    value: '2160 Bishop St, Montreal, Quebec H3G 2E9, Canada',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Office Hours',
    value: 'Monday - Friday, 10:00 AM - 4:00 PM',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/csmeconcordia',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/csmeconcordia',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/csme-concordia',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    ),
  },
]

const faqs = [
  {
    q: 'How do I become a member of CSME Concordia?',
    a: 'Membership is open to all Concordia students interested in mechanical engineering. Simply fill out our contact form or visit us during office hours to sign up!',
  },
  {
    q: 'Do I need to be in the mechanical engineering program?',
    a: 'No! While most of our members are in mechanical engineering, we welcome students from all programs who are interested in engineering and innovation.',
  },
  {
    q: 'Are there membership fees?',
    a: 'No! Membership is completely free for all Concordia students.',
  },
  {
    q: 'How can I get involved in projects?',
    a: 'Attend our project info sessions at the start of each semester or contact our project leads directly. We\'re always looking for enthusiastic team members!',
  },
]

export function ContactHero() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="absolute top-0 right-0 text-navy/5 dark:text-white/5">
        <GearDecoration size={600} spin />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <FadeIn>
            <span className="text-navy dark:text-navy-light font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              Contact Us
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1
              className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Let&apos;s
              <span className="text-navy dark:text-navy-light"> Connect</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Have a question, want to join our team, or interested in collaborating?
              We&apos;d love to hear from you. Reach out and let&apos;s build something great together.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export function ContactFormSection({ children }: { children: ReactNode }) {
  return (
    <FadeIn direction="left">
      <div>
        <h2
          className="text-3xl font-bold text-slate-900 dark:text-white mb-8"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Send Us a Message
        </h2>
        {children}
      </div>
    </FadeIn>
  )
}

export function ContactInfoSection() {
  return (
    <FadeIn direction="right" delay={0.2}>
      <div>
        <h2
          className="text-3xl font-bold text-slate-900 dark:text-white mb-8"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Get in Touch
        </h2>

        <StaggerContainer className="space-y-6 mb-12" staggerDelay={0.1}>
          {contactInfo.map((info) => (
            <StaggerItem key={info.title}>
              <div className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-navy dark:text-navy-light">
                  {info.icon}
                </div>
                <div>
                  <h3
                    className="font-bold text-slate-900 dark:text-white mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {info.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {info.value}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Social Links */}
        <FadeIn delay={0.4}>
          <div>
            <h3
              className="text-xl font-bold text-slate-900 dark:text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-navy text-white hover:bg-navy-dark transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Google Map - B-Annex Concordia */}
        <FadeIn delay={0.5}>
          <div className="mt-12">
            <div className="aspect-video bg-slate-200 relative overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=2160+Bishop+St,+Montreal,+QC+H3G+2E9,+Canada&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="CSME Location - B-Annex, Concordia University"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </FadeIn>
  )
}

export function FAQSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-navy dark:text-navy-light font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              FAQ
            </span>
            <h2
              className="text-4xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Frequently Asked Questions
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer className="space-y-4" staggerDelay={0.1}>
          {faqs.map((faq, index) => (
            <StaggerItem key={index}>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
                <h3
                  className="text-lg font-bold text-slate-900 dark:text-white mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {faq.a}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
