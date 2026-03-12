import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { users } from '~/server/db/schema'
import { useAppSession, exchangeUntappdCode, getUntappdUser } from '~/server/auth'

export const loginWithUntappd = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ code: z.string().min(1) }))
  .handler(async ({ data }) => {
    const accessToken = await exchangeUntappdCode(data.code)
    const untappdUser = await getUntappdUser(accessToken)
    const db = getDb()

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.authProviderId, untappdUser.untappdId))
      .limit(1)

    if (!user) {
      ;[user] = await db.insert(users).values({
        username: untappdUser.username,
        email: untappdUser.email,
        avatarUrl: untappdUser.avatarUrl,
        firstName: untappdUser.firstName,
        lastName: untappdUser.lastName,
        authProvider: 'untappd',
        authProviderId: untappdUser.untappdId,
        untappdApiKey: accessToken,
      }).returning()
    } else {
      // Update access token on login
      ;[user] = await db.update(users)
        .set({ untappdApiKey: accessToken, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning()
    }

    // Create session
    const session = await useAppSession()
    await session.update({
      userId: user!.id,
      username: user!.username,
      role: user!.role,
    })

    return { user: { id: user!.id, username: user!.username, role: user!.role } }
  })

export const getMe = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useAppSession()

  if (!session.data.userId) {
    return null
  }

  const db = getDb()
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      avatarUrl: users.avatarUrl,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
      location: users.location,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.data.userId))
    .limit(1)

  return user ?? null
})

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  throw redirect({ to: '/' })
})
