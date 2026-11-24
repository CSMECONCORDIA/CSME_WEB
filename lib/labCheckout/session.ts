import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

// The lab "unlocked" state is a signed, httpOnly cookie holding an expiry time.
// It slides forward on every action, so it only expires after inactivity.
const COOKIE_NAME = 'csme_lab_session'
export const RENEW_EVERY_SECONDS = 30

function sign(value: string): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set')
  return createHmac('sha256', secret).update(`lab-session:${value}`).digest('hex')
}

/** Expiry time (ms) of a correctly signed session cookie, or 0 if there isn't one. */
async function sessionExpiry(): Promise<number> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return 0
  const [exp, sig] = raw.split('.')
  if (!exp || !sig) return 0
  const expected = Buffer.from(sign(exp))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return 0
  return Number(exp)
}

export async function isLabUnlocked(): Promise<boolean> {
  return (await sessionExpiry()) > Date.now()
}

/**
 * Start or extend the session. Only callable from server actions / route handlers.
 * Writing a cookie in a server action makes Next.js re-render the whole page, so
 * rapid scans skip it when the cookie was renewed moments ago.
 */
export async function touchLabSession(lifetimeSeconds: number): Promise<void> {
  const fullExpiry = Date.now() + lifetimeSeconds * 1000
  const current = await sessionExpiry()
  if (current <= fullExpiry && current > fullExpiry - RENEW_EVERY_SECONDS * 1000) return

  const exp = String(fullExpiry)
  const store = await cookies()
  store.set(COOKIE_NAME, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: lifetimeSeconds,
  })
}

export async function clearLabSession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
