import { drizzle } from 'drizzle-orm/pglite'
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js'
import { PGlite } from '@electric-sql/pglite'
import postgres from 'postgres'
import * as schema from '@/models/schema'

// Determine which database to use based on environment
const isDevelopment = process.env.NODE_ENV === 'development'
const usePglite = isDevelopment && !process.env.DATABASE_URL?.startsWith('postgresql://')

let db: ReturnType<typeof drizzle> | ReturnType<typeof drizzlePg>

if (usePglite) {
  // PGlite for local development (embedded Postgres in WASM)
  const client = new PGlite('./pglite-data')
  db = drizzle(client, { schema })
  console.log('Using PGlite (embedded Postgres)')
} else {
  // Real Postgres for production or when DATABASE_URL is set
  const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:Pg_1960@localhost:5432/postgres'
  const client = postgres(connectionString)
  db = drizzlePg(client, { schema })
  console.log('Using Postgres:', connectionString.replace(/:[^:@]+@/, ':***@'))
}

export { db }
