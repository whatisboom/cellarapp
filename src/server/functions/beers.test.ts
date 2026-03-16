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

const { listBeers, getBeer } = await import('./beers')

afterAll(async () => {
  await closeTestDb()
})

beforeEach(async () => {
  await cleanTables()
})

afterEach(async () => {
  await cleanTables()
})

describe('listBeers', () => {
  it('returns paginated results with brewery join', async () => {
    const brewery = await createTestBrewery({ name: 'Hop Works' })
    await createTestBeer(brewery.id, { name: 'Alpha IPA', style: 'IPA' })
    await createTestBeer(brewery.id, { name: 'Beta Stout', style: 'Stout' })

    const result = await listBeers({ page: 1, limit: 20 })

    expect(result.beers).toHaveLength(2)
    expect(result.total).toBe(2)
    expect(result.page).toBe(1)
    expect(result.beers[0]!.breweryName).toBe('Hop Works')
  })

  it('returns correct totalPages', async () => {
    const brewery = await createTestBrewery()
    for (let i = 0; i < 5; i++) {
      await createTestBeer(brewery.id, { name: `Beer ${i}` })
    }

    const result = await listBeers({ page: 1, limit: 2 })

    expect(result.beers).toHaveLength(2)
    expect(result.total).toBe(5)
    expect(result.totalPages).toBe(3)
  })

  it('respects page and limit params', async () => {
    const brewery = await createTestBrewery()
    for (let i = 0; i < 5; i++) {
      await createTestBeer(brewery.id, { name: `Beer ${String(i).padStart(2, '0')}` })
    }

    const page2 = await listBeers({ page: 2, limit: 2 })

    expect(page2.beers).toHaveLength(2)
    expect(page2.page).toBe(2)
  })
})

describe('getBeer', () => {
  it('returns beer by slug with brewery', async () => {
    const brewery = await createTestBrewery({ name: 'Test Brewery' })
    const beer = await createTestBeer(brewery.id, {
      name: 'Flagship IPA',
      slug: 'flagship-ipa',
      style: 'IPA',
      abv: '6.5',
    })

    const result = await getBeer({ slug: 'flagship-ipa' })

    expect(result.id).toBe(beer.id)
    expect(result.name).toBe('Flagship IPA')
    expect(result.brewery.name).toBe('Test Brewery')
  })

  it('throws Beer not found for unknown slug', async () => {
    await expect(getBeer({ slug: 'nonexistent' })).rejects.toThrow('Beer not found')
  })
})
