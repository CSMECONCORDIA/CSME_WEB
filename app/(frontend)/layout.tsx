import React from 'react'
import Script from 'next/script'
import './styles.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export const metadata = {
  title: 'CSME Concordia | Canadian Society for Mechanical Engineering',
  description: 'The Canadian Society for Mechanical Engineering - Concordia Chapter. Connecting students, fostering innovation, and building the next generation of mechanical engineers.',
  keywords: ['CSME', 'Concordia University', 'Mechanical Engineering', 'Student Club', 'Engineering Society'],
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const themeScript = `
    (() => {
      try {
        const stored = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const useDark = stored ? stored === 'dark' : prefersDark
        const root = document.documentElement
        root.classList.toggle('dark', useDark)
        root.style.colorScheme = useDark ? 'dark' : 'light'
      } catch (err) {}
    })()
  `

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Noise texture overlay for subtle grain effect */}
        <div className="noise-overlay" />

        <Header />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
