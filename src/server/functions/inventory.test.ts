import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import {
  getTestDb,
  closeTestDb,
  cleanTables,
  createTestUser,
  createTestBrewery,
  createTestBeer,
  createTestInventoryItem,
} from '~/tests/db-helpers'
import { setSession, clearSession, mockCreateServerFn, mockSession } from '~/tests/mocks'

mockCreateServerFn()

vi.mock('~/server/db', () => ({
  getDb: () => getTestDb(),
}))

vi.mock('~/server/auth', () => ({
  useAppSession: () => Promise.resolve(mockSession()),
}))

const { getUserInventory, addToInventory, updateInventory, removeFromInventory } =
  await import('./inventory')

beforeAll(() => {
  getTestDb()
})

afterAll(async () => {
  await closeTestDb()
})

afterEach(async () => {
  await cleanTables()
  clearSession()
})

describe('getUserInventory', () => {
  it('returns items with beer and brewery joins', async () => {
    const user = await createTestUser()
    const brewery = await createTestBrewery({ name: 'Hop House' })
    const beer = await createTestBeer(brewery.id, { name: 'Pale Ale', style: 'IPA', abv: '5.5' })
    await createTestInventoryItem(user.id, beer.id, { amount: 3, forTrade: 1 })

    const items = await getUserInventory({ userId: user.id })

    expect(items).toHaveLength(1)
    expect(items[0]!.beer.name).toBe('Pale Ale')
    expect(items[0]!.brewery.name).toBe('Hop House')
    expect(items[0]!.amount).toBe(3)
    expect(items[0]!.forTrade).toBe(1)
  })

  it('returns empty array when user has no inventory', async () => {
    const user = await createTestUser()
    const items = await getUserInventory({ userId: user.id })
    expect(items).toHaveLength(0)
  })
})

describe('addToInventory', () => {
  it('throws Unauthorized without session', async () => {
    clearSession()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)

    await expect(
      addToInventory({ beerId: beer.id, amount: 1, forTrade: 0 })
    ).rejects.toThrow('Unauthorized')
  })

  it('inserts item for authenticated user', async () => {
    const user = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)
    setSession({ userId: user.id })

    const item = await addToInventory({ beerId: beer.id, amount: 2, forTrade: 1 })

    expect(item!.userId).toBe(user.id)
    expect(item!.beerId).toBe(beer.id)
    expect(item!.amount).toBe(2)
    expect(item!.forTrade).toBe(1)
  })

  it('throws on duplicate user+beer', async () => {
    const user = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)
    setSession({ userId: user.id })

    await addToInventory({ beerId: beer.id, amount: 1, forTrade: 0 })

    await expect(
      addToInventory({ beerId: beer.id, amount: 1, forTrade: 0 })
    ).rejects.toThrow('Beer already in inventory')
  })
})

describe('updateInventory', () => {
  it('throws Unauthorized without session', async () => {
    await expect(
      updateInventory({ id: '00000000-0000-0000-0000-000000000000', amount: 1, forTrade: 0 })
    ).rejects.toThrow('Unauthorized')
  })

  it('throws not-found for non-existent item', async () => {
    const user = await createTestUser()
    setSession({ userId: user.id })

    await expect(
      updateInventory({ id: '00000000-0000-0000-0000-000000000000', amount: 1, forTrade: 0 })
    ).rejects.toThrow('not found or not owned')
  })

  it('throws not-owned for another user\'s item', async () => {
    const owner = await createTestUser()
    const other = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)
    const item = await createTestInventoryItem(owner.id, beer.id)

    setSession({ userId: other.id })

    await expect(
      updateInventory({ id: item.id, amount: 5, forTrade: 2 })
    ).rejects.toThrow('not found or not owned')
  })

  it('updates amount and forTrade', async () => {
    const user = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)
    const item = await createTestInventoryItem(user.id, beer.id, { amount: 1, forTrade: 0 })

    setSession({ userId: user.id })

    const updated = await updateInventory({ id: item.id, amount: 5, forTrade: 3 })

    expect(updated!.amount).toBe(5)
    expect(updated!.forTrade).toBe(3)
  })
})

describe('removeFromInventory', () => {
  it('throws Unauthorized without session', async () => {
    await expect(
      removeFromInventory({ id: '00000000-0000-0000-0000-000000000000' })
    ).rejects.toThrow('Unauthorized')
  })

  it('throws not-owned for another user\'s item', async () => {
    const owner = await createTestUser()
    const other = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)
    const item = await createTestInventoryItem(owner.id, beer.id)

    setSession({ userId: other.id })

    await expect(removeFromInventory({ id: item.id })).rejects.toThrow('not found or not owned')
  })

  it('deletes and returns { deleted: true }', async () => {
    const user = await createTestUser()
    const brewery = await createTestBrewery()
    const beer = await createTestBeer(brewery.id)
    const item = await createTestInventoryItem(user.id, beer.id)

    setSession({ userId: user.id })

    const result = await removeFromInventory({ id: item.id })
    expect(result).toEqual({ deleted: true })

    // Verify it's gone
    const items = await getUserInventory({ userId: user.id })
    expect(items).toHaveLength(0)
  })
})
