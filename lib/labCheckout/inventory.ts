import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import type { Checkout, Customer, InventoryItem } from '@/payload-types'
import { RENEW_EVERY_SECONDS } from './session'

// Shared server-side logic for the /checkout lab pages.
// Works directly on the existing Payload collections:
// customers (students), inventory-items, checkouts.

export async function getPayloadClient(): Promise<Payload> {
  return getPayload({ config })
}

export interface LabSettings {
  passwordHash: string | null
  idleTimeoutMinutes: number
  warningSeconds: number
  defaultCheckoutDays: number
  maxCheckoutDays: number
}

export async function getLabSettings(payload: Payload): Promise<LabSettings> {
  const s = await payload.findGlobal({ slug: 'lab-checkout-settings', overrideAccess: true })
  return {
    passwordHash: s?.passwordHash ?? null,
    idleTimeoutMinutes: s?.idleTimeoutMinutes ?? 3,
    warningSeconds: s?.warningSeconds ?? 30,
    defaultCheckoutDays: s?.defaultCheckoutDays ?? 3,
    maxCheckoutDays: s?.maxCheckoutDays ?? 3,
  }
}

/**
 * Cookie lifetime: idle time + countdown, plus slack. The slack covers the client's
 * 30 s keep-alive interval and the renewal interval, so the session can't expire on
 * the server while the "I'm still here" countdown is still showing.
 */
export function sessionLifetimeSeconds(s: LabSettings): number {
  return s.idleTimeoutMinutes * 60 + s.warningSeconds + 30 + RENEW_EVERY_SECONDS + 15
}

export function normalizeId(value: unknown): string {
  return String(value ?? '').trim()
}

export async function findStudentByCardId(payload: Payload, cardId: string): Promise<Customer | null> {
  const res = await payload.find({
    collection: 'customers',
    where: { cardId: { equals: cardId } },
    limit: 1,
    depth: 0,
    pagination: false, // skips an extra COUNT query
    overrideAccess: true,
  })
  return res.docs[0] ?? null
}

export async function findItemByBarcode(payload: Payload, barcode: string): Promise<InventoryItem | null> {
  const res = await payload.find({
    collection: 'inventory-items',
    where: { barcode: { equals: barcode } },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  return res.docs[0] ?? null
}

const ACTIVE_STATUSES: Checkout['status'][] = ['checked-out', 'overdue']

export function isOverdue(c: Pick<Checkout, 'status' | 'dueDate'>, now = Date.now()): boolean {
  if (!ACTIVE_STATUSES.includes(c.status)) return false
  return c.status === 'overdue' || (!!c.dueDate && new Date(c.dueDate).getTime() < now)
}

export interface CheckoutRow {
  id: number
  itemName: string
  barcode: string
  quantity: number
  status: Checkout['status']
  checkedOutAt: string
  dueDate: string | null
  returnedAt: string | null
  overdue: boolean
}

function toRow(c: Checkout): CheckoutRow {
  const item = typeof c.item === 'object' ? c.item : null
  return {
    id: c.id,
    itemName: item?.name ?? 'Deleted item',
    barcode: item?.barcode ?? '',
    quantity: c.quantity,
    status: c.status,
    checkedOutAt: c.checkedOutAt,
    dueDate: c.dueDate ?? null,
    returnedAt: c.returnedAt ?? null,
    overdue: isOverdue(c),
  }
}

export async function getStudentCheckouts(payload: Payload, customerId: number) {
  const [active, history] = await Promise.all([
    payload.find({
      collection: 'checkouts',
      where: { customer: { equals: customerId }, status: { in: ACTIVE_STATUSES } },
      sort: 'dueDate',
      depth: 1,
      limit: 200,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'checkouts',
      where: { customer: { equals: customerId }, status: { not_in: ACTIVE_STATUSES } },
      sort: '-returnedAt',
      depth: 1,
      limit: 50,
      pagination: false,
      overrideAccess: true,
    }),
  ])
  return { active: active.docs.map(toRow), history: history.docs.map(toRow) }
}

export type ScanResult = { ok: true; message: string } | { ok: false; error: string }

/** Check out ONE unit of the scanned item to the student. */
export async function checkOutOne(
  payload: Payload,
  customerId: number,
  item: InventoryItem,
  settings: LabSettings,
): Promise<ScanResult> {
  const available = item.quantityAvailable ?? 0
  if (available < 1) return { ok: false, error: `"${item.name}" is out of stock (0 available).` }

  const days = Math.min(item.maxCheckoutDays || settings.defaultCheckoutDays, settings.maxCheckoutDays)
  const now = new Date()
  const due = new Date(now)
  due.setDate(due.getDate() + days)

  await payload.create({
    collection: 'checkouts',
    data: {
      customer: customerId,
      item: item.id,
      quantity: 1,
      status: 'checked-out',
      checkedOutAt: now.toISOString(),
      dueDate: due.toISOString(),
    },
    depth: 0,
    overrideAccess: true,
  })
  await payload.update({
    collection: 'inventory-items',
    id: item.id,
    data: { quantityAvailable: available - 1 },
    depth: 0,
    overrideAccess: true,
  })

  return {
    ok: true,
    message: `Checked out "${item.name}". Due ${due.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}. ${available - 1} left.`,
  }
}

/** Return ONE unit of the scanned item from the student (oldest loan first). */
export async function checkInOne(payload: Payload, customerId: number, item: InventoryItem): Promise<ScanResult> {
  const res = await payload.find({
    collection: 'checkouts',
    where: { customer: { equals: customerId }, item: { equals: item.id }, status: { in: ACTIVE_STATUSES } },
    sort: 'checkedOutAt',
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  const loan = res.docs[0]
  if (!loan) return { ok: false, error: `This student doesn't have "${item.name}" checked out.` }

  // A loan record may hold more than 1 unit (e.g. made via the API). Return one unit at a time.
  if (loan.quantity > 1) {
    await payload.update({
      collection: 'checkouts',
      id: loan.id,
      data: { quantity: loan.quantity - 1 },
      depth: 0,
      overrideAccess: true,
    })
    await payload.create({
      collection: 'checkouts',
      data: {
        customer: customerId,
        item: item.id,
        quantity: 1,
        status: 'returned',
        checkedOutAt: loan.checkedOutAt,
        dueDate: loan.dueDate,
        returnedAt: new Date().toISOString(),
      },
      depth: 0,
      overrideAccess: true,
    })
  } else {
    await payload.update({
      collection: 'checkouts',
      id: loan.id,
      data: { status: 'returned', returnedAt: new Date().toISOString() },
      depth: 0,
      overrideAccess: true,
    })
  }

  await payload.update({
    collection: 'inventory-items',
    id: item.id,
    data: { quantityAvailable: Math.min((item.quantityAvailable ?? 0) + 1, item.quantityTotal) },
    depth: 0,
    overrideAccess: true,
  })

  const late = isOverdue(loan) ? ' (returned late)' : ''
  return { ok: true, message: `Returned "${item.name}"${late}.` }
}
