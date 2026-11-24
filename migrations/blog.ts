import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-sqlite'

// Safe to run even if a dev server already created some of this.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`blog\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`description\` text NOT NULL,
    \`slug\` text,
    \`post_date\` text,
    \`archived\` integer DEFAULT false,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`blog_slug_idx\` ON \`blog\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_post_date_idx\` ON \`blog\` (\`post_date\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_updated_at_idx\` ON \`blog\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`blog_created_at_idx\` ON \`blog\` (\`created_at\`);`)

  // SQLite has no ADD COLUMN IF NOT EXISTS.
  const existing = await db.run(
    sql`SELECT 1 FROM pragma_table_info('payload_locked_documents_rels') WHERE name = 'blog_id';`,
  )
  if (existing.rows.length === 0) {
    await db.run(
      sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`blog_id\` integer REFERENCES \`blog\`(\`id\`) ON DELETE cascade;`,
    )
  }
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_blog_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_id\`);`,
  )
}

// The blog_id column references this table, so it is emptied but left in place: dropping a
// foreign-key column in SQLite means rebuilding the whole table.
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`UPDATE \`payload_locked_documents_rels\` SET \`blog_id\` = NULL;`)
  await db.run(sql`DROP TABLE IF EXISTS \`blog\`;`)
}

export const blogMigrations = [{ name: '20261124_blog', up, down }]
