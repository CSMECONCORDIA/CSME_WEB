import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`lab_checkout_settings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`password_is_set\` integer DEFAULT false,
    \`password_hash\` text,
    \`idle_timeout_minutes\` numeric DEFAULT 3 NOT NULL,
    \`warning_seconds\` numeric DEFAULT 30 NOT NULL,
    \`default_checkout_days\` numeric DEFAULT 3 NOT NULL,
    \`max_checkout_days\` numeric DEFAULT 3 NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`lab_checkout_settings\`;`)
}

export const labCheckoutMigrations = [
  { name: '20261119_lab_checkout_settings', up, down },
]
