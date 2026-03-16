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
    get data() {
      return sessionData
    },
    update: sessionUpdateFn,
    clear: sessionClearFn,
  }
}

// --- createServerFn mock ---
// Makes server functions directly callable in tests by bypassing
// TanStack Start's AsyncLocalStorage requirement.

interface ZodLike<T> {
  parse: (input: unknown) => T
}

function isZodLike<T>(schema: unknown): schema is ZodLike<T> {
  return (
    schema != null &&
    typeof schema === 'object' &&
    'parse' in schema &&
    typeof (schema as ZodLike<T>).parse === 'function'
  )
}

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
        inputValidator: <T>(schema: unknown): InputValidator<T> => ({
          handler: (fn: (opts: { data: T }) => Promise<unknown>) => {
            return (input: T) => {
              const parsed = isZodLike<T>(schema) ? schema.parse(input) : input
              return fn({ data: parsed })
            }
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
// The real redirect() returns a Response-like object; our code does
// `throw redirect(...)` explicitly, so the mock just needs to return
// something throwable. If TanStack's `redirect({ throw: true })` is
// ever used, this mock will need updating.

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
