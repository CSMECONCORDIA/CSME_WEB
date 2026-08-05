'use client'

import { useState, useEffect } from 'react'
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations'
import { GearDecoration } from '../components/GearDecoration'

interface PrinterStatus {
  id: string
  name: string
  status: 'idle' | 'printing' | 'offline' | 'error'
  progress?: number
  currentJob?: string
  timeRemaining?: string
  temperature?: {
    nozzle: number
    bed: number
  }
}

interface LabStatus {
  isOpen: boolean
  lastUpdated: string
  message?: string
}

function PrinterCard({ printer }: { printer: PrinterStatus }) {
  const statusColors = {
    idle: 'bg-green-500',
    printing: 'bg-blue-500',
    offline: 'bg-slate-400',
    error: 'bg-red-500',
  }

  const statusLabels = {
    idle: 'Ready',
    printing: 'Printing',
    offline: 'Offline',
    error: 'Error',
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {printer.name}
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">Creality K1C</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${statusColors[printer.status]} ${printer.status === 'printing' ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {statusLabels[printer.status]}
          </span>
        </div>
      </div>

      {printer.status === 'printing' && (
        <div className="space-y-3">
          {printer.currentJob && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Current Job:</span> {printer.currentJob}
            </div>
          )}

          {printer.progress !== undefined && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                <span className="font-medium text-slate-900 dark:text-white">{printer.progress}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-navy dark:bg-navy-light rounded-full transition-all duration-500"
                  style={{ width: `${printer.progress}%` }}
                />
              </div>
            </div>
          )}

          {printer.timeRemaining && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Time Remaining:</span> {printer.timeRemaining}
            </div>
          )}
        </div>
      )}

      {printer.temperature && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Nozzle</span>
              <p className="font-medium text-slate-900 dark:text-white">{printer.temperature.nozzle}°C</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Bed</span>
              <p className="font-medium text-slate-900 dark:text-white">{printer.temperature.bed}°C</p>
            </div>
          </div>
        </div>
      )}

      {printer.status === 'idle' && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <p className="text-sm text-green-700 dark:text-green-400">
            This printer is available for use
          </p>
        </div>
      )}

      {printer.status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-sm text-red-700 dark:text-red-400">
            Printer requires attention. Please contact lab staff.
          </p>
        </div>
      )}
    </div>
  )
}

function LabOpenStatus({ status }: { status: LabStatus }) {
  return (
    <div className={`p-6 rounded-lg border-2 ${
      status.isOpen
        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
        : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          status.isOpen ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {status.isOpen ? (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${
            status.isOpen ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
          }`} style={{ fontFamily: 'var(--font-display)' }}>
            Lab is {status.isOpen ? 'OPEN' : 'CLOSED'}
          </h3>
          {status.message && (
            <p className="text-slate-600 dark:text-slate-400 mt-1">{status.message}</p>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Last updated: {new Date(status.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export function LabStatusContent() {
  const [printers, setPrinters] = useState<PrinterStatus[]>([])
  const [labStatus, setLabStatus] = useState<LabStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      const [printerRes, labRes] = await Promise.all([
        fetch('/api/printer-status'),
        fetch('/api/lab-status'),
      ])

      if (printerRes.ok) {
        const printerData = await printerRes.json()
        setPrinters(printerData.printers)
      }

      if (labRes.ok) {
        const labData = await labRes.json()
        setLabStatus(labData)
      }

      setError(null)
    } catch {
      setError('Failed to fetch status. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

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
                Real-Time Status
              </span>
              <h1
                className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Lab Status
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Check the current status of the CSME lab and our Creality K1C 3D printers in real-time.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Lab Open Status */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
            ) : labStatus ? (
              <LabOpenStatus status={labStatus} />
            ) : (
              <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  Lab status unavailable. Please check our Discord for updates.
                </p>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Printers Section */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  3D Printers
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">4x Creality K1C</p>
              </div>
              <button
                onClick={fetchStatus}
                className="btn-outline text-sm"
                disabled={loading}
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                </div>
              ))}
            </div>
          ) : error ? (
            <FadeIn>
              <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
                <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-700 dark:text-red-400">{error}</p>
                <button
                  onClick={fetchStatus}
                  className="mt-4 btn-primary"
                >
                  Try Again
                </button>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.1}>
              {printers.map((printer) => (
                <StaggerItem key={printer.id}>
                  <PrinterCard printer={printer} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Discord CTA */}
      <section className="py-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -right-20 -bottom-20 text-white/5">
          <GearDecoration size={300} spin reverse />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Join Our Discord
              </h2>
            </div>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Get real-time notifications when the lab opens, printer availability updates, and connect with other members.
            </p>
            <a
              href="https://discord.com/invite/7nzgpd5qee"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent inline-flex"
            >
              Join Discord Server
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}