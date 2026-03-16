import { describe, it, expect, afterAll, afterEach, beforeEach, vi } from 'vitest'
import {
  getTestDb,
  closeTestDb,
  cleanTables,
  createTestUser,
} from '~/tests/db-helpers'
import {
  setSession,
  clearSession,
  mockCreateServerFn,
  mockRedirect,
  mockSession,
  RedirectError,
} from '~/tests/mocks'

mockCreateServerFn()
mockRedirect()

const mockExchangeUntappdCode = vi.fn<(code: string) => Promise<string>>()
const mockGetUntappdUser = vi.fn()

vi.mock('~/server/db', () => ({
  getDb: () => getTestDb(),
}))

vi.mock('~/server/auth', () => ({
  useAppSession: () => Promise.resolve(mockSession()),
  exchangeUntappdCode: (...args: unknown[]) => mockExchangeUntappdCode(...(args as [string])),
  getUntappdUser: (...args: unknown[]) => mockGetUntappdUser(...args),
}))

const { loginWithUntappd, getMe, logout } = await import('./auth')

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

describe('loginWithUntappd', () => {
  it('creates a new user when not found', async () => {
    mockExchangeUntappdCode.mockResolvedValue('test-token')
    mockGetUntappdUser.mockResolvedValue({
      username: 'newbrewer',
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'Brewer',
      avatarUrl: 'https://example.com/avatar.png',
      untappdId: 'untappd-999',
    })

    const result = await loginWithUntappd({ code: 'auth-code-123' })

    expect(result.user.username).toBe('newbrewer')
    expect(mockExchangeUntappdCode).toHaveBeenCalledWith('auth-code-123')
  })

  it('updates access token for existing user', async () => {
    const existingUser = await createTestUser({
      username: 'existing',
      authProvider: 'untappd',
      authProviderId: 'untappd-existing',
      untappdApiKey: 'old-token',
    })

    mockExchangeUntappdCode.mockResolvedValue('new-token')
    mockGetUntappdUser.mockResolvedValue({
      username: 'existing',
      email: 'existing@example.com',
      firstName: 'Existing',
      lastName: 'User',
      avatarUrl: '',
      untappdId: 'untappd-existing',
    })

    const result = await loginWithUntappd({ code: 'auth-code' })

    expect(result.user.id).toBe(existingUser.id)
    expect(result.user.username).toBe('existing')
  })

  it('sets session correctly after login', async () => {
    mockExchangeUntappdCode.mockResolvedValue('token')
    mockGetUntappdUser.mockResolvedValue({
      username: 'sessionuser',
      email: 'session@example.com',
      firstName: 'Session',
      lastName: 'User',
      avatarUrl: '',
      untappdId: 'untappd-session',
    })

    await loginWithUntappd({ code: 'code' })

    const session = mockSession()
    expect(session.update).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'sessionuser',
        role: 'user',
      })
    )
  })
})

describe('getMe', () => {
  it('returns null without session', async () => {
    clearSession()
    const result = await getMe()
    expect(result).toBeNull()
  })

  it('returns user profile when authenticated', async () => {
    const user = await createTestUser({
      username: 'meuser',
      email: 'me@example.com',
    })
    setSession({ userId: user.id, username: 'meuser', role: 'user' })

    const result = await getMe()

    expect(result).not.toBeNull()
    expect(result!.username).toBe('meuser')
    expect(result!.email).toBe('me@example.com')
  })
})

describe('logout', () => {
  it('clears session and throws redirect', async () => {
    setSession({ userId: 'some-id', username: 'user', role: 'user' })

    await expect(logout()).rejects.toThrow(RedirectError)

    const session = mockSession()
    expect(session.clear).toHaveBeenCalled()
  })
})
