'use server'

import { redirect } from 'next/navigation'
import {
  checkInOne,
  checkOutOne,
  findItemByBarcode,
  findStudentByCardId,
  getLabSettings,
  getPayloadClient,
  normalizeId,
  sessionLifetimeSeconds,
  type ScanResult,
} from '@/lib/labCheckout/inventory'
import { verifyLabPassword } from '@/lib/labCheckout/password'
import { clearLabSession, isLabUnlocked, touchLabSession } from '@/lib/labCheckout/session'

export type FormState = { error?: string }

const MAX_ID_LENGTH = 64

/** Step 1: lab password (if not already unlocked) + student ID → student page. */
export async function unlockAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const cardId = normalizeId(formData.get('studentId'))
  if (!cardId) return { error: 'Enter the student ID.' }
  if (cardId.length > MAX_ID_LENGTH) return { error: 'That student ID is too long.' }

  const payload = await getPayloadClient()
  const settings = await getLabSettings(payload)

  if (!(await isLabUnlocked())) {
    if (!settings.passwordHash) {
      return { error: 'No lab password has been set yet. An admin must set one in Admin → Lab Checkout Settings.' }
    }
    const password = String(formData.get('password') ?? '')
    if (!verifyLabPassword(password, settings.passwordHash)) {
      await new Promise((r) => setTimeout(r, 1000)) // slow down guessing
      return { error: 'Wrong lab password.' }
    }
  }

  await touchLabSession(sessionLifetimeSeconds(settings))
  redirect(`/checkout/${encodeURIComponent(cardId)}`)
}

/** Lock the station (button or idle timeout). */
export async function lockAction(): Promise<void> {
  await clearLabSession()
  redirect('/checkout')
}

/** Lock because of the idle timeout (shows a "timed out" note). */
export async function timeoutLockAction(): Promise<void> {
  await clearLabSession()
  redirect('/checkout?timedOut=1')
}

/** Called by the idle timer while someone is active. */
export async function keepAliveAction(): Promise<{ locked: boolean }> {
  if (!(await isLabUnlocked())) return { locked: true }
  const settings = await getLabSettings(await getPayloadClient())
  await touchLabSession(sessionLifetimeSeconds(settings))
  return { locked: false }
}

/** Create a student account when the ID isn't in the system yet. */
export async function createStudentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isLabUnlocked())) redirect('/checkout?timedOut=1')

  const cardId = normalizeId(formData.get('cardId'))
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()

  if (!cardId || cardId.length > MAX_ID_LENGTH) return { error: 'Invalid student ID.' }
  if (!name) return { error: 'Name is required.' }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'That email address looks wrong.' }

  const payload = await getPayloadClient()
  if (!(await findStudentByCardId(payload, cardId))) {
    await payload.create({
      collection: 'customers',
      data: { cardId, name, email: email || undefined, phone: phone || undefined, status: 'active' },
      overrideAccess: true,
    })
  }

  const settings = await getLabSettings(payload)
  await touchLabSession(sessionLifetimeSeconds(settings))
  redirect(`/checkout/${encodeURIComponent(cardId)}`)
}

/** One scanner read: check out or check in one unit for this student. */
export async function scanAction(cardId: string, mode: 'out' | 'in', rawBarcode: string): Promise<ScanResult & { locked?: boolean }> {
  if (!(await isLabUnlocked())) return { ok: false, error: 'Session expired.', locked: true }

  const barcode = normalizeId(rawBarcode)
  if (!barcode) return { ok: false, error: 'Empty scan.' }

  try {
    const payload = await getPayloadClient()
    const [settings, student, item] = await Promise.all([
      getLabSettings(payload),
      findStudentByCardId(payload, normalizeId(cardId)),
      findItemByBarcode(payload, barcode),
    ])
    await touchLabSession(sessionLifetimeSeconds(settings))

    if (!student) return { ok: false, error: 'Student not found.' }
    if (!item) return { ok: false, error: `Unknown barcode "${barcode}". This item is not in the inventory.` }

    return mode === 'out'
      ? await checkOutOne(payload, student.id, item, settings)
      : await checkInOne(payload, student.id, item)
  } catch (err) {
    console.error('Lab checkout scan failed:', err)
    return { ok: false, error: 'Something went wrong saving this scan. Try again.' }
  }
}
