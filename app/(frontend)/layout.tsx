import React from 'react'
import './styles.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export const metadata = {
  title: 'CSME Concordia | Canadian Society for Mechanical Engineering',
  description: 'The Canadian Society for Mechanical Engineering at Concordia University. Connecting students, fostering innovation, and building the next generation of mechanical engineers.',
  keywords: ['CSME', 'Concordia University', 'Mechanical Engineering', 'Student Club', 'Engineering Society'],
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
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
