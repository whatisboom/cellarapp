import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, ilike, sql } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { users } from '~/server/db/schema'

export const listUsers = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      search: z.string().optional(),
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    })
  )
  .handler(async ({ data }) => {
    const db = getDb()
    const offset = (data.page - 1) * data.limit

    const whereClause = data.search
      ? ilike(users.username, `%${data.search}%`)
      : undefined

    const [items, [countResult]] = await Promise.all([
      db
        .select({
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(whereClause)
        .limit(data.limit)
        .offset(offset)
        .orderBy(users.username),
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(whereClause),
    ])

    return {
      users: items,
      total: Number(countResult!.count),
      page: data.page,
      totalPages: Math.ceil(Number(countResult!.count) / data.limit),
    }
  })

export const getUser = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ username: z.string().min(1) }))
  .handler(async ({ data }) => {
    const db = getDb()

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        firstName: users.firstName,
        lastName: users.lastName,
        location: users.location,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  })
