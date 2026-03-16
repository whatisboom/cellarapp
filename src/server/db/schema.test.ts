import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach } from 'vitest'
import { eq } from 'drizzle-orm'
import {
  getTestDb,
  closeTestDb,
  cleanTables,
  createTestUser,
  createTestBrewery,
  createTestBeer,
} from '~/tests/db-helpers'
import * as schema from './schema'

beforeAll(() => {
  getTestDb()
})

afterAll(async () => {
  await closeTestDb()
})

beforeEach(async () => {
  await cleanTables()
})

afterEach(async () => {
  await cleanTables()
})

describe('users table', () => {
  it('creates a user', async () => {
    const user = await createTestUser({
      username: 'testbrewer',
      email: 'test@example.com',
    })

    expect(user.username).toBe('testbrewer')
    expect(user.role).toBe('user')
    expect(user.id).toBeDefined()
  })

  it('enforces unique username', async () => {
    await createTestUser({ username: 'dupe', authProviderId: '1' })

    await expect(
      createTestUser({ username: 'dupe', authProviderId: '2' })
    ).rejects.toThrow()
  })
})

describe('inventory table', () => {
  it('enforces for_trade <= amount', async () => {
    const db = getTestDb()
    const user = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)

    await expect(
      db.insert(schema.inventory).values({
        userId: user.id,
        beerId: beer.id,
        amount: 2,
        forTrade: 5,
      })
    ).rejects.toThrow()
  })

  it('enforces unique user+beer combination', async () => {
    const db = getTestDb()
    const user = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)

    await db.insert(schema.inventory).values({
      userId: user.id,
      beerId: beer.id,
      amount: 3,
      forTrade: 1,
    })

    await expect(
      db.insert(schema.inventory).values({
        userId: user.id,
        beerId: beer.id,
        amount: 1,
        forTrade: 0,
      })
    ).rejects.toThrow()
  })

  it('cascades delete when user is removed', async () => {
    const db = getTestDb()
    const user = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)

    await db.insert(schema.inventory).values({
      userId: user.id,
      beerId: beer.id,
      amount: 1,
      forTrade: 0,
    })

    await db.delete(schema.users).where(eq(schema.users.id, user.id))

    const remaining = await db.select().from(schema.inventory)
    expect(remaining).toHaveLength(0)
  })
})
