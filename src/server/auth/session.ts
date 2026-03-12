import { useSession } from '@tanstack/react-start/server'

export type SessionData = {
  userId?: string
  username?: string
  role?: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'beercellar-session',
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  })
}
