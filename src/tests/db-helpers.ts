import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '~/server/db/schema'

let pool: Pool
let db: ReturnType<typeof drizzle<typeof schema>>

export function getTestDb() {
  if (!db) {
    pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ??
        'postgresql://postgres:postgres@localhost:5432/beercellar',
    })
    db = drizzle({ client: pool, schema })
  }
  return db
}

export async function closeTestDb() {
  if (pool) {
    await pool.end()
  }
}

export async function cleanTables() {
  const testDb = getTestDb()
  await testDb.delete(schema.inventory)
  await testDb.delete(schema.beers)
  await testDb.delete(schema.breweries)
  await testDb.delete(schema.users)
}

export async function createTestUser(
  overrides: Partial<typeof schema.users.$inferInsert> = {}
) {
  const testDb = getTestDb()
  const [user] = await testDb
    .insert(schema.users)
    .values({
      username: `testuser-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      authProvider: 'untappd',
      authProviderId: String(Date.now()),
      ...overrides,
    })
    .returning()
  return user!
}

export async function createTestBrewery(
  overrides: Partial<typeof schema.breweries.$inferInsert> = {}
) {
  const testDb = getTestDb()
  const slug = `brewery-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const [brewery] = await testDb
    .insert(schema.breweries)
    .values({
      name: overrides.name ?? 'Test Brewery',
      slug,
      ...overrides,
    })
    .returning()
  return brewery!
}

export async function createTestBeer(
  breweryId: string,
  overrides: Partial<typeof schema.beers.$inferInsert> = {}
) {
  const testDb = getTestDb()
  const slug = `beer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const [beer] = await testDb
    .insert(schema.beers)
    .values({
      name: overrides.name ?? 'Test Beer',
      slug,
      breweryId,
      ...overrides,
    })
    .returning()
  return beer!
}

export async function createTestInventoryItem(
  userId: string,
  beerId: string,
  overrides: Partial<typeof schema.inventory.$inferInsert> = {}
) {
  const testDb = getTestDb()
  const [item] = await testDb
    .insert(schema.inventory)
    .values({
      userId,
      beerId,
      amount: 1,
      forTrade: 0,
      ...overrides,
    })
    .returning()
  return item!
}
