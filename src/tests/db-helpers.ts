import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '~/server/db/schema'

let pool: Pool | undefined
let db: ReturnType<typeof drizzle<typeof schema>> | undefined

export function getTestDb() {
  if (!db) {
    const connectionString = process.env.TEST_DATABASE_URL
    if (!connectionString) {
      throw new Error(
        'TEST_DATABASE_URL is not set. Set it to a test-only Postgres instance.'
      )
    }
    pool = new Pool({ connectionString })
    db = drizzle({ client: pool, schema })
  }
  return db
}

export async function closeTestDb() {
  if (pool) {
    await pool.end()
    pool = undefined
    db = undefined
  }
}

let counter = 0
function nextId() {
  return `${Date.now()}-${++counter}-${Math.random().toString(36).slice(2, 6)}`
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
      username: `testuser-${nextId()}`,
      authProvider: 'untappd',
      authProviderId: nextId(),
      ...overrides,
    })
    .returning()
  return user!
}

export async function createTestBrewery(
  overrides: Partial<typeof schema.breweries.$inferInsert> = {}
) {
  const testDb = getTestDb()
  const slug = `brewery-${nextId()}`
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
  const slug = `beer-${nextId()}`
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
