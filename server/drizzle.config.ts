import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

config()

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    // Supabase requires TLS; local dev does not.
    ssl: (process.env.DATABASE_URL ?? '').includes('localhost')
      ? false
      : { rejectUnauthorized: false },
  },
})
