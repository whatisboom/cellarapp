import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

function createDb() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })
  return drizzle({ client: pool, schema })
}

let db: ReturnType<typeof createDb>

export function getDb() {
  if (!db) {
    db = createDb()
  }
  return db
}

export type Database = ReturnType<typeof getDb>
