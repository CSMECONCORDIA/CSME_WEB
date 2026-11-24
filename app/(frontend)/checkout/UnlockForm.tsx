'use client'

import { useActionState } from 'react'
import { unlockAction, type FormState } from './actions'

const inputClass =
  'w-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-lg text-slate-900 dark:text-white focus:border-navy focus:outline-none'

export function UnlockForm({ unlocked }: { unlocked: boolean }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(unlockAction, {})

  return (
    <form action={formAction} className="space-y-5">
      {!unlocked && (
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Lab password</span>
          <input name="password" type="password" required autoFocus autoComplete="off" className={inputClass} />
        </label>
      )}
      <label className="block">
        <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Student ID</span>
        <input
          name="studentId"
          type="text"
          inputMode="numeric"
          required
          autoFocus={unlocked}
          autoComplete="off"
          maxLength={64}
          className={inputClass}
        />
      </label>

      {state.error && (
        <p role="alert" className="border-l-4 border-red-600 bg-red-50 dark:bg-red-950/50 px-4 py-3 font-medium text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-navy px-6 py-4 text-lg font-bold text-white hover:bg-navy-dark disabled:opacity-60"
      >
        {pending ? 'Checking…' : 'Continue'}
      </button>
    </form>
  )
}
