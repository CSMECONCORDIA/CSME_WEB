import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { Users } from "./collections/Users.ts";
import { Media } from "./collections/Media.ts";
import { Projects } from "./collections/Projects.ts";
import { Events } from "./collections/Events.ts";
import { LabStatus } from "./globals/LabStatus.ts";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Events],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  globals: [
    LabStatus,
  ],
  db: sqliteAdapter({
	  client: {
    url: process.env.DATABASE_URL || `file:${path.resolve(dirname, 'csme-locale.db')}`,
    authToken: process.env.TURSO_AUTH_TOKEN,
	  },
  }),
  sharp,
  plugins: [vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
], 
});
