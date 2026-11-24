import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

// Stored format: "<salt hex>:<hash hex>"
export function hashLabPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyLabPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored || !password) return false
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
  return timingSafeEqual(actual, expected)
}
