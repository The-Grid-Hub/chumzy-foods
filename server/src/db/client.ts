import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.js'

const connectionString = process.env.DATABASE_URL

const isLocal =
  !connectionString ||
  connectionString.includes('localhost') ||
  connectionString.includes('127.0.0.1')

const pool = new Pool({
  connectionString,
  // Supabase (and other hosted Postgres) require TLS; local dev does not.
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 5, // stay well under Supabase free-tier pooler connection limits
})

export const db = drizzle(pool, { schema })
export { pool }
