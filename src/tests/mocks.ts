import { vi } from 'vitest'
import type { SessionData } from '~/server/auth/session'

// --- Session mock ---

let sessionData: Partial<SessionData> = {}

const sessionUpdateFn = vi.fn(async (data: Partial<SessionData>) => {
  sessionData = { ...sessionData, ...data }
})

const sessionClearFn = vi.fn(async () => {
  sessionData = {}
})

export function setSession(data: Partial<SessionData>) {
  sessionData = data
}

export function clearSession() {
  sessionData = {}
  sessionUpdateFn.mockClear()
  sessionClearFn.mockClear()
}

export function mockSession() {
  return {
    data: sessionData,
    update: sessionUpdateFn,
    clear: sessionClearFn,
  }
}

// --- createServerFn mock ---
// Makes server functions directly callable in tests by bypassing
// TanStack Start's AsyncLocalStorage requirement.

type InputValidator<T> = {
  handler: (fn: (opts: { data: T }) => Promise<unknown>) => (input: T) => Promise<unknown>
}

type ServerFnBuilder = {
  inputValidator: <T>(schema: unknown) => InputValidator<T>
  handler: (fn: (opts: { data?: undefined }) => Promise<unknown>) => () => Promise<unknown>
}

export function mockCreateServerFn() {
  vi.mock('@tanstack/react-start', () => ({
    createServerFn: (_opts?: { method: string }): ServerFnBuilder => {
      return {
        inputValidator: <T>(_schema: unknown): InputValidator<T> => ({
          handler: (fn: (opts: { data: T }) => Promise<unknown>) => {
            return (input: T) => fn({ data: input })
          },
        }),
        handler: (fn: (opts: { data?: undefined }) => Promise<unknown>) => {
          return () => fn({ data: undefined })
        },
      }
    },
  }))
}

// --- redirect mock ---

export class RedirectError extends Error {
  to: string
  constructor(opts: { to: string }) {
    super(`Redirect to ${opts.to}`)
    this.to = opts.to
  }
}

export function mockRedirect() {
  vi.mock('@tanstack/react-router', () => ({
    redirect: (opts: { to: string }) => new RedirectError(opts),
  }))
}
