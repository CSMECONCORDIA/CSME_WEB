'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LabStatus {
  isOpen: boolean
  message?: string
}

const DEFAULT_MESSAGES = [
  'The lab is currently closed.',
  'The lab is currently closed',
  'Lab status will be updated when a team member checks in.',
  'Lab status will be updated when a team member checks in',
]

export function LabStatusBanner() {
  const [status, setStatus] = useState<LabStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/lab-status')
        if (res.ok) {
          const data = await res.json()
          setStatus(data)
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !status) return null

  const displayMessage = status.message && !DEFAULT_MESSAGES.includes(status.message)
    ? status.message
    : null

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <Link href="/lab-status" className="group block">
        <div
          className={`relative rounded-full border backdrop-blur-sm transition-all duration-200 group-hover:shadow-md ${
            status.isOpen
              ? 'bg-green-500/90 border-green-400/50'
              : 'bg-slate-800/90 border-slate-700/50'
          }`}
        >
          <div className="px-4 py-2 flex items-center gap-2.5">
            {/* Status dot */}
            <span className="relative flex h-2 w-2">
              {status.isOpen && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-pulse" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>

            {/* Status text */}
            <span className="text-white text-xs font-semibold uppercase tracking-wide">
              Lab {status.isOpen ? 'Open' : 'Closed'}
            </span>

            {/* Custom message */}
            {displayMessage && (
              <>
                <span className="hidden sm:block w-px h-3 bg-white/20" />
                <span className="hidden sm:block text-white/80 text-xs truncate max-w-[180px]">
                  {displayMessage}
                </span>
              </>
            )}

            {/* Arrow */}
            <svg
              className="w-3 h-3 text-white/60 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}
