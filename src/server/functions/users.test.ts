import { describe, it, expect, afterAll, afterEach, vi } from 'vitest'
import {
  getTestDb,
  closeTestDb,
  cleanTables,
  createTestUser,
} from '~/tests/db-helpers'
import { mockCreateServerFn } from '~/tests/mocks'

mockCreateServerFn()

vi.mock('~/server/db', () => ({
  getDb: () => getTestDb(),
}))

const { listUsers, getUser } = await import('./users')

afterAll(async () => {
  await closeTestDb()
})

afterEach(async () => {
  await cleanTables()
})

describe('listUsers', () => {
  it('returns paginated results', async () => {
    await createTestUser({ username: 'alice' })
    await createTestUser({ username: 'bob' })

    const result = await listUsers({ page: 1, limit: 20 })

    expect(result.users).toHaveLength(2)
    expect(result.total).toBe(2)
    expect(result.page).toBe(1)
  })

  it('filters by username with search (ilike)', async () => {
    await createTestUser({ username: 'hopfan' })
    await createTestUser({ username: 'maltlover' })
    await createTestUser({ username: 'hophunter' })

    const result = await listUsers({ search: 'hop', page: 1, limit: 20 })

    expect(result.users).toHaveLength(2)
    expect(result.total).toBe(2)
    expect(result.users.every((u) => u.username.includes('hop'))).toBe(true)
  })
})

describe('getUser', () => {
  it('returns user by username', async () => {
    await createTestUser({ username: 'findme', firstName: 'Find', lastName: 'Me' })

    const result = await getUser({ username: 'findme' })

    expect(result.username).toBe('findme')
    expect(result.firstName).toBe('Find')
  })

  it('throws User not found for unknown username', async () => {
    await expect(getUser({ username: 'ghost' })).rejects.toThrow('User not found')
  })
})
