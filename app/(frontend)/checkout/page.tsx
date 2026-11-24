import { getLabSettings, getPayloadClient } from '@/lib/labCheckout/inventory'
import { isLabUnlocked } from '@/lib/labCheckout/session'
import { IdleGuard } from './IdleGuard'
import { UnlockForm } from './UnlockForm'
import { lockAction } from './actions'

export const metadata = {
  title: 'Lab Checkout | CSME Concordia',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function CheckoutStartPage({
  searchParams,
}: {
  searchParams: Promise<{ timedOut?: string }>
}) {
  const { timedOut } = await searchParams
  const unlocked = await isLabUnlocked()
  const settings = await getLabSettings(await getPayloadClient())

  return (
    <section className="min-h-[70vh] px-4 py-24">
      <div className="mx-auto max-w-lg">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-navy dark:text-navy-light">CSME Lab</p>
        <h1 className="mb-2 text-4xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Equipment Checkout
        </h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          {unlocked
            ? 'Station unlocked. Enter the next student’s ID.'
            : 'For lab leads: enter the lab password and the student’s ID.'}
        </p>

        {timedOut && !unlocked && (
          <p className="mb-6 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-amber-800 dark:text-amber-200">
            The station locked after inactivity. Enter the lab password again.
          </p>
        )}

        <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
          <UnlockForm unlocked={unlocked} />
        </div>

        {unlocked && (
          <>
            <form action={lockAction} className="mt-4 text-right">
              <button type="submit" className="text-sm font-medium text-slate-500 underline hover:text-red-600">
                Lock station
              </button>
            </form>
            <IdleGuard idleMinutes={settings.idleTimeoutMinutes} warningSeconds={settings.warningSeconds} />
          </>
        )}
      </div>
    </section>
  )
}
