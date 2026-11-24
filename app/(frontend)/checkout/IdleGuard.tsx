'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { keepAliveAction, timeoutLockAction } from './actions'

const KEEPALIVE_EVERY_MS = 30_000
const ACTIVITY_EVENTS = ['keydown', 'mousedown', 'mousemove', 'touchstart', 'wheel'] as const

/**
 * Locks the station after inactivity. Shows a countdown first so the
 * lab lead can click "I'm still here". Activity also keeps the server
 * session cookie alive.
 */
export function IdleGuard({ idleMinutes, warningSeconds }: { idleMinutes: number; warningSeconds: number }) {
  const idleMs = idleMinutes * 60_000
  const lastActivity = useRef(Date.now())
  const lastPing = useRef(Date.now())
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const locking = useRef(false)

  const lock = useCallback(() => {
    if (locking.current) return
    locking.current = true
    void timeoutLockAction()
  }, [])

  const markActive = useCallback(() => {
    lastActivity.current = Date.now()
    if (Date.now() - lastPing.current > KEEPALIVE_EVERY_MS) {
      lastPing.current = Date.now()
      keepAliveAction().then((r) => r.locked && lock())
    }
  }, [lock])

  useEffect(() => {
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, markActive, { passive: true }))
    const timer = setInterval(() => {
      const idle = Date.now() - lastActivity.current
      if (idle < idleMs) {
        setSecondsLeft(null)
        return
      }
      const left = Math.ceil(warningSeconds - (idle - idleMs) / 1000)
      if (left <= 0) {
        setSecondsLeft(0)
        lock()
      } else {
        setSecondsLeft(left)
      }
    }, 250)
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActive))
      clearInterval(timer)
    }
  }, [idleMs, warningSeconds, markActive, lock])

  if (secondsLeft === null) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4" role="alertdialog" aria-live="assertive">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border-4 border-amber-500 p-8 text-center shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-wider text-amber-600">Are you still there?</p>
        <p className="my-4 text-7xl font-black tabular-nums text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
          {secondsLeft}
        </p>
        <p className="mb-6 text-slate-600 dark:text-slate-300">The station will lock when the countdown reaches 0.</p>
        <button
          type="button"
          onClick={markActive}
          className="w-full bg-navy px-6 py-4 text-lg font-bold text-white hover:bg-navy-dark"
        >
          I&apos;m still here
        </button>
      </div>
    </div>
  )
}
