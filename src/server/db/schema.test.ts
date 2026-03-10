import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

let pool: Pool
let db: ReturnType<typeof drizzle<typeof schema>>

beforeAll(async () => {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/beercellar',
  })
  db = drizzle({ client: pool, schema })
})

afterAll(async () => {
  await pool.end()
})

afterEach(async () => {
  await db.delete(schema.inventory)
  await db.delete(schema.beers)
  await db.delete(schema.breweries)
  await db.delete(schema.users)
})

describe('users table', () => {
  it('creates a user', async () => {
    const [user] = await db.insert(schema.users).values({
      username: 'testbrewer',
      email: 'test@example.com',
      authProvider: 'untappd',
      authProviderId: '12345',
    }).returning()

    expect(user!.username).toBe('testbrewer')
    expect(user!.role).toBe('user')
    expect(user!.id).toBeDefined()
  })

  it('enforces unique username', async () => {
    await db.insert(schema.users).values({
      username: 'dupe',
      authProvider: 'untappd',
      authProviderId: '1',
    })

    await expect(
      db.insert(schema.users).values({
        username: 'dupe',
        authProvider: 'untappd',
        authProviderId: '2',
      })
    ).rejects.toThrow()
  })
})

describe('inventory table', () => {
  it('enforces for_trade <= amount', async () => {
    const [user] = await db.insert(schema.users).values({
      username: 'invuser',
      authProvider: 'untappd',
      authProviderId: '99',
    }).returning()

    const [brewery] = await db.insert(schema.breweries).values({
      name: 'Test Brewery',
      slug: 'test-brewery',
    }).returning()

    const [beer] = await db.insert(schema.beers).values({
      name: 'Test IPA',
      slug: 'test-ipa',
      breweryId: brewery!.id,
    }).returning()

    await expect(
      db.insert(schema.inventory).values({
        userId: user!.id,
        beerId: beer!.id,
        amount: 2,
        forTrade: 5,
      })
    ).rejects.toThrow()
  })

  it('enforces unique user+beer combination', async () => {
    const [user] = await db.insert(schema.users).values({
      username: 'uniqtest',
      authProvider: 'untappd',
      authProviderId: '100',
    }).returning()

    const [brewery] = await db.insert(schema.breweries).values({
      name: 'Unique Brewery',
      slug: 'unique-brewery',
    }).returning()

    const [beer] = await db.insert(schema.beers).values({
      name: 'Unique Beer',
      slug: 'unique-beer',
      breweryId: brewery!.id,
    }).returning()

    await db.insert(schema.inventory).values({
      userId: user!.id,
      beerId: beer!.id,
      amount: 3,
      forTrade: 1,
    })

    await expect(
      db.insert(schema.inventory).values({
        userId: user!.id,
        beerId: beer!.id,
        amount: 1,
        forTrade: 0,
      })
    ).rejects.toThrow()
  })

  it('cascades delete when user is removed', async () => {
    const [user] = await db.insert(schema.users).values({
      username: 'cascade-test',
      authProvider: 'untappd',
      authProviderId: '200',
    }).returning()

    const [brewery] = await db.insert(schema.breweries).values({
      name: 'Cascade Brewery',
      slug: 'cascade-brewery',
    }).returning()

    const [beer] = await db.insert(schema.beers).values({
      name: 'Cascade Beer',
      slug: 'cascade-beer',
      breweryId: brewery!.id,
    }).returning()

    await db.insert(schema.inventory).values({
      userId: user!.id,
      beerId: beer!.id,
      amount: 1,
      forTrade: 0,
    })

    const { eq } = await import('drizzle-orm')
    await db.delete(schema.users).where(eq(schema.users.id, user!.id))

    const remaining = await db.select().from(schema.inventory)
    expect(remaining).toHaveLength(0)
  })
})
