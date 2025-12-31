import type { Config } from 'drizzle-kit'

export default {
  schema: './src/models/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ||
      'postgresql://postgres:Pg_1960@localhost:5432/postgres',
  },
  verbose: true,
  strict: true,
} satisfies Config
