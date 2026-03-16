import { describe, it, expect, afterAll, afterEach, beforeEach, vi } from 'vitest'
import {
  getTestDb,
  closeTestDb,
  cleanTables,
  createTestUser,
} from '~/tests/db-helpers'
import { setSession, clearSession, mockCreateServerFn, mockSession } from '~/tests/mocks'

mockCreateServerFn()

const mockSearchUntappdBeers = vi.fn()

vi.mock('~/server/db', () => ({
  getDb: () => getTestDb(),
}))

vi.mock('~/server/auth', () => ({
  useAppSession: () => Promise.resolve(mockSession()),
  searchUntappdBeers: (...args: unknown[]) => mockSearchUntappdBeers(...args),
}))

const { searchBeers } = await import('./search')

afterAll(async () => {
  await closeTestDb()
})

beforeEach(async () => {
  await cleanTables()
})

afterEach(async () => {
  await cleanTables()
  clearSession()
  vi.clearAllMocks()
})

describe('searchBeers', () => {
  it('throws Unauthorized without session', async () => {
    clearSession()
    await expect(searchBeers({ query: 'ipa' })).rejects.toThrow('Unauthorized')
  })

  it('throws when user has no untappdApiKey', async () => {
    const user = await createTestUser({ untappdApiKey: null })
    setSession({ userId: user.id })

    await expect(searchBeers({ query: 'ipa' })).rejects.toThrow('Untappd API key not found')
  })

  it('calls searchUntappdBeers with correct query and token', async () => {
    const user = await createTestUser({ untappdApiKey: 'my-api-key' })
    setSession({ userId: user.id })
    mockSearchUntappdBeers.mockResolvedValue([])

    await searchBeers({ query: 'hazy ipa' })

    expect(mockSearchUntappdBeers).toHaveBeenCalledWith('hazy ipa', 'my-api-key')
  })

  it('returns search results', async () => {
    const user = await createTestUser({ untappdApiKey: 'key' })
    setSession({ userId: user.id })
    const mockResults = [{ name: 'Hazy IPA', slug: 'hazy-ipa' }]
    mockSearchUntappdBeers.mockResolvedValue(mockResults)

    const results = await searchBeers({ query: 'hazy' })

    expect(results).toEqual(mockResults)
  })
})
