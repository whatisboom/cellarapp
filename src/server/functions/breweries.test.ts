import { describe, it, expect, afterAll, afterEach, beforeEach, vi } from 'vitest'
import {
  getTestDb,
  closeTestDb,
  cleanTables,
  createTestBrewery,
  createTestBeer,
} from '~/tests/db-helpers'
import { mockCreateServerFn } from '~/tests/mocks'

mockCreateServerFn()

vi.mock('~/server/db', () => ({
  getDb: () => getTestDb(),
}))

const { listBreweries, getBrewery } = await import('./breweries')

afterAll(async () => {
  await closeTestDb()
})

beforeEach(async () => {
  await cleanTables()
})

afterEach(async () => {
  await cleanTables()
})

describe('listBreweries', () => {
  it('returns paginated results', async () => {
    await createTestBrewery({ name: 'Alpha Brewing' })
    await createTestBrewery({ name: 'Beta Brewing' })

    const result = await listBreweries({ page: 1, limit: 20 })

    expect(result.breweries).toHaveLength(2)
    expect(result.total).toBe(2)
    expect(result.page).toBe(1)
  })

  it('returns correct pagination math', async () => {
    for (let i = 0; i < 7; i++) {
      await createTestBrewery({ name: `Brewery ${i}` })
    }

    const result = await listBreweries({ page: 1, limit: 3 })

    expect(result.breweries).toHaveLength(3)
    expect(result.total).toBe(7)
    expect(result.totalPages).toBe(3)
  })
})

describe('getBrewery', () => {
  it('returns brewery with related beers', async () => {
    const brewery = await createTestBrewery({
      name: 'Hop Works',
      slug: 'hop-works',
      city: 'Portland',
    })
    await createTestBeer(brewery.id, { name: 'IPA' })
    await createTestBeer(brewery.id, { name: 'Stout' })

    const result = await getBrewery({ slug: 'hop-works' })

    expect(result.name).toBe('Hop Works')
    expect(result.city).toBe('Portland')
    expect(result.beers).toHaveLength(2)
  })

  it('throws Brewery not found for unknown slug', async () => {
    await expect(getBrewery({ slug: 'nonexistent' })).rejects.toThrow('Brewery not found')
  })
})
