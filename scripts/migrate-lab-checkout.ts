import { createRequire } from 'node:module'
import type { Migration } from 'payload'

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Set NODE_ENV=production before running the lab checkout migration.')
}

const databaseURL = process.env.DATABASE_URL ?? ''
if (!databaseURL.startsWith('libsql://') && !databaseURL.startsWith('https://')) {
  throw new Error('DATABASE_URL must point to the Turso database before running this migration.')
}

// Skip Payload's development schema push and its data-loss confirmation prompt.
process.env.PAYLOAD_MIGRATING = 'true'

const appRequire = createRequire(import.meta.url)
const sqliteRequire = createRequire(appRequire.resolve('@payloadcms/db-sqlite'))
const drizzleRequire = createRequire(sqliteRequire.resolve('@payloadcms/drizzle'))
const prompts = drizzleRequire('prompts')
prompts.inject([true])

const [{ default: config }, { getPayload }] = await Promise.all([
  import('../payload.config.ts'),
  import('payload'),
])

const payload = await getPayload({ config })
try {
  const { labCheckoutMigrations } = await import('../migrations/labCheckout.ts')
  await payload.db.migrate({ migrations: labCheckoutMigrations as unknown as Migration[] })
} finally {
  await payload.destroy()
}
