import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { users } from '~/server/db/schema'
import { useAppSession, searchUntappdBeers } from '~/server/auth'

export const searchBeers = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      query: z.string().min(1).max(200),
    })
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()
    const [user] = await db
      .select({ untappdApiKey: users.untappdApiKey })
      .from(users)
      .where(eq(users.id, session.data.userId))
      .limit(1)

    if (!user?.untappdApiKey) {
      throw new Error('Untappd API key not found. Please re-authenticate.')
    }

    return searchUntappdBeers(data.query, user.untappdApiKey)
  })
