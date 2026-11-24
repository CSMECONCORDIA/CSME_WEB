'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CheckoutRow } from '@/lib/labCheckout/inventory'
import { lockAction, scanAction } from '../actions'

type Mode = 'out' | 'in'
type LogEntry = { id: number; status: 'pending' | 'ok' | 'error'; text: string }

interface Props {
  student: { cardId: string; name: string; email: string | null; status: string }
  active: CheckoutRow[]
  history: CheckoutRow[]
}

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }) : '-'

// Short beeps so the lab lead knows the result without looking at the screen.
function beep(ok: boolean) {
  try {
    const ctx = new AudioContext()
    const tones = ok ? [880] : [220, 0, 220]
    tones.forEach((freq, i) => {
      if (!freq) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = freq
      osc.type = ok ? 'sine' : 'square'
      gain.gain.value = 0.15
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.12)
    })
    setTimeout(() => ctx.close(), 1000)
  } catch {
    /* audio not available */
  }
}

export function StudentStation({ student, active, history }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('out')
  const [log, setLog] = useState<LogEntry[]>([])
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const queue = useRef<{ id: number; barcode: string; mode: Mode }[]>([])
  const running = useRef(false)
  const nextId = useRef(1)

  const overdue = active.filter((r) => r.overdue)
  const blocked = student.status !== 'active'

  const focusScanner = useCallback(() => inputRef.current?.focus(), [])

  // Keep the scan box focused: the scanner types like a keyboard, so the
  // input must have focus for scans to land in it.
  useEffect(() => {
    focusScanner()
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('input, button, a, select, textarea')) focusScanner()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [focusScanner])

  // Process scans one at a time, in order, even if they arrive quickly.
  const drain = useCallback(async () => {
    if (running.current) return
    running.current = true
    setBusy(true)
    let connectionFailed = false
    while (queue.current.length) {
      const { id, barcode, mode: m } = queue.current.shift()!
      let res: Awaited<ReturnType<typeof scanAction>>
      try {
        res = await scanAction(student.cardId, m, barcode)
      } catch {
        // Network/server failure: report it and keep the scanner usable.
        connectionFailed = true
        res = { ok: false, error: `Connection problem on "${barcode}". It may not be saved: reload the page to check before scanning it again.` }
      }
      if (res.locked) {
        router.push('/checkout?timedOut=1')
        return
      }
      beep(res.ok)
      const done: LogEntry = { id, status: res.ok ? 'ok' : 'error', text: res.ok ? res.message : res.error }
      setLog((l) => l.map((e) => (e.id === id ? done : e)))
    }
    running.current = false
    setBusy(false)
    // Refreshing while offline would replace the station with a browser error page.
    if (!connectionFailed) router.refresh()
    focusScanner()
  }, [student.cardId, router, focusScanner])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = inputRef.current?.value.trim() ?? ''
    if (inputRef.current) inputRef.current.value = ''
    if (!value) return
    const id = nextId.current++
    queue.current.push({ id, barcode: value, mode })
    // Show the scan right away; the result replaces this line once it's saved.
    const entry: LogEntry = { id, status: 'pending', text: `${mode === 'out' ? 'Checking out' : 'Checking in'} ${value}` }
    setLog((l) => [entry, ...l].filter((e, i) => i < 8 || e.status === 'pending'))
    void drain()
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    focusScanner()
  }

  const modeStyles = {
    out: 'bg-navy text-white border-navy',
    in: 'bg-emerald-600 text-white border-emerald-600',
  }

  return (
    <div className="space-y-8">
      {/* Student header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-navy dark:text-navy-light">Student {student.cardId}</p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {student.name}
          </h1>
          {student.email && <p className="text-slate-600 dark:text-slate-400">{student.email}</p>}
        </div>
        <div className="flex gap-3">
          <Link href="/checkout" className="bg-navy px-5 py-3 font-bold text-white hover:bg-navy-dark">
            Next student
          </Link>
          <form action={lockAction}>
            <button type="submit" className="border-2 border-slate-300 dark:border-slate-600 px-5 py-3 font-bold text-slate-700 dark:text-slate-200 hover:border-red-600 hover:text-red-600">
              Lock
            </button>
          </form>
        </div>
      </div>

      {/* Red flags (warn, don't block) */}
      {overdue.length > 0 && (
        <div role="alert" className="border-4 border-red-600 bg-red-600 p-6 text-white shadow-lg">
          <p className="text-2xl font-black uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            ⚠ {overdue.length} overdue item{overdue.length > 1 ? 's' : ''}
          </p>
          <ul className="mt-2 list-disc pl-6 text-lg">
            {overdue.map((r) => (
              <li key={r.id}>
                {r.itemName}: was due {fmtDate(r.dueDate)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {blocked && (
        <div role="alert" className="border-4 border-red-600 bg-red-50 dark:bg-red-950/50 p-5 text-lg font-bold text-red-700 dark:text-red-300">
          ⚠ This student&apos;s account is marked <span className="uppercase">{student.status}</span>. Check with an admin before lending.
        </div>
      )}

      {/* Scanner */}
      <div className={`border-4 p-6 ${mode === 'out' ? 'border-navy' : 'border-emerald-600'} bg-white dark:bg-slate-800`}>
        <div className="mb-4 grid grid-cols-2 gap-3">
          {(['out', 'in'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              aria-pressed={mode === m}
              className={`border-2 px-4 py-4 text-xl font-black uppercase tracking-wide transition ${
                mode === m ? modeStyles[m] : 'border-slate-300 dark:border-slate-600 text-slate-500 hover:border-slate-500'
              }`}
            >
              {m === 'out' ? 'Check out' : 'Check in'}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit}>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Scan item barcode to {mode === 'out' ? 'CHECK OUT' : 'CHECK IN'}
          </label>
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Scan or type barcode, then Enter"
            className="w-full border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-4 font-mono text-2xl text-slate-900 dark:text-white focus:border-navy focus:outline-none"
          />
        </form>
        <p className="mt-2 h-5 text-sm text-slate-500">{busy ? 'Saving…' : 'Each scan = 1 unit.'}</p>

        {log.length > 0 && (
          <ul className="mt-4 space-y-2">
            {log.map((e, i) => (
              <li
                key={e.id}
                className={`border-l-4 px-4 py-3 font-medium ${i === 0 ? 'text-lg' : 'text-sm opacity-70'} ${
                  {
                    pending: 'border-slate-400 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300',
                    ok: 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
                    error: 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
                  }[e.status]
                }`}
              >
                {{ pending: '…', ok: '✓', error: '✕' }[e.status]} {e.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Current checkouts */}
      <Table title={`Currently checked out (${active.length})`} empty="Nothing checked out.">
        {active.length > 0 && (
          <>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Barcode</Th>
                <Th>Qty</Th>
                <Th>Checked out</Th>
                <Th>Due</Th>
              </tr>
            </thead>
            <tbody>
              {active.map((r) => (
                <tr key={r.id} className={r.overdue ? 'bg-red-50 dark:bg-red-950/40 font-bold text-red-700 dark:text-red-300' : ''}>
                  <Td>{r.itemName}</Td>
                  <Td mono>{r.barcode}</Td>
                  <Td>{r.quantity}</Td>
                  <Td>{fmtDate(r.checkedOutAt)}</Td>
                  <Td>
                    {fmtDate(r.dueDate)}
                    {r.overdue && <span className="ml-2 bg-red-600 px-2 py-0.5 text-xs uppercase text-white">Overdue</span>}
                  </Td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </Table>

      {/* History */}
      <Table title="History (last 50)" empty="No past checkouts.">
        {history.length > 0 && (
          <>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Checked out</Th>
                <Th>Returned</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <Td>{r.itemName}</Td>
                  <Td>{fmtDate(r.checkedOutAt)}</Td>
                  <Td>{fmtDate(r.returnedAt)}</Td>
                  <Td>
                    <span className="capitalize">{r.status}</span>
                    {r.returnedAt && r.dueDate && r.returnedAt > r.dueDate && <span className="ml-2 text-xs text-red-600">late</span>}
                  </Td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </Table>
    </div>
  )
}

function Table({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <h2 className="border-b border-slate-200 dark:border-slate-700 px-5 py-4 text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      {children ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700 dark:text-slate-300">{children}</table>
        </div>
      ) : (
        <p className="px-5 py-6 text-slate-500">{empty}</p>
      )}
    </div>
  )
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">{children}</th>
)
const Td = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
  <td className={`border-t border-slate-100 dark:border-slate-700 px-5 py-3 ${mono ? 'font-mono text-sm' : ''}`}>{children}</td>
)
