'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { createStudentAction, type FormState } from '../actions'

const inputClass =
  'w-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-lg text-slate-900 dark:text-white focus:border-navy focus:outline-none'
const labelClass = 'mb-2 block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'

export function CreateStudentForm({ cardId }: { cardId: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createStudentAction, {})

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-navy dark:text-navy-light">New student</p>
      <h1 className="mb-2 text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
        No account for ID {cardId}
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">Create their account to continue, or go back if the ID was mistyped.</p>

      <form action={formAction} className="space-y-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
        <input type="hidden" name="cardId" value={cardId} />
        <label className="block">
          <span className={labelClass}>Full name *</span>
          <input name="name" required autoFocus autoComplete="off" maxLength={120} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input name="email" type="email" autoComplete="off" maxLength={200} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Phone</span>
          <input name="phone" type="tel" autoComplete="off" maxLength={40} className={inputClass} />
        </label>

        {state.error && (
          <p role="alert" className="border-l-4 border-red-600 bg-red-50 dark:bg-red-950/50 px-4 py-3 font-medium text-red-700 dark:text-red-300">
            {state.error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Link
            href="/checkout"
            className="flex-1 border-2 border-slate-300 dark:border-slate-600 px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-200 hover:border-slate-500"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 bg-navy px-6 py-4 text-lg font-bold text-white hover:bg-navy-dark disabled:opacity-60"
          >
            {pending ? 'Creating…' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  )
}
