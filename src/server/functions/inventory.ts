import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { inventory, beers, breweries } from '~/server/db/schema'
import { useAppSession } from '~/server/auth'

export const getUserInventory = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const db = getDb()

    const items = await db
      .select({
        id: inventory.id,
        amount: inventory.amount,
        forTrade: inventory.forTrade,
        beer: {
          id: beers.id,
          name: beers.name,
          slug: beers.slug,
          style: beers.style,
          abv: beers.abv,
          labelUrl: beers.labelUrl,
        },
        brewery: {
          id: breweries.id,
          name: breweries.name,
          slug: breweries.slug,
        },
      })
      .from(inventory)
      .innerJoin(beers, eq(inventory.beerId, beers.id))
      .leftJoin(breweries, eq(beers.breweryId, breweries.id))
      .where(eq(inventory.userId, data.userId))
      .orderBy(beers.name)

    return items
  })

export const addToInventory = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      beerId: z.string().uuid(),
      amount: z.number().int().min(1).max(1000).default(1),
      forTrade: z.number().int().min(0).max(1000).default(0),
    })
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()

    // Check for duplicates
    const [existing] = await db
      .select({ id: inventory.id })
      .from(inventory)
      .where(
        and(
          eq(inventory.userId, session.data.userId),
          eq(inventory.beerId, data.beerId)
        )
      )
      .limit(1)

    if (existing) {
      throw new Error('Beer already in inventory')
    }

    const [item] = await db.insert(inventory).values({
      userId: session.data.userId,
      beerId: data.beerId,
      amount: data.amount,
      forTrade: data.forTrade,
    }).returning()

    return item
  })

export const updateInventory = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      amount: z.number().int().min(0).max(1000),
      forTrade: z.number().int().min(0).max(1000),
    })
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()

    // Verify ownership
    const [item] = await db
      .select()
      .from(inventory)
      .where(
        and(eq(inventory.id, data.id), eq(inventory.userId, session.data.userId))
      )
      .limit(1)

    if (!item) {
      throw new Error('Inventory item not found or not owned by you')
    }

    const [updated] = await db
      .update(inventory)
      .set({
        amount: data.amount,
        forTrade: data.forTrade,
        updatedAt: new Date(),
      })
      .where(eq(inventory.id, data.id))
      .returning()

    return updated
  })

export const removeFromInventory = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()

    // Verify ownership
    const [item] = await db
      .select()
      .from(inventory)
      .where(
        and(eq(inventory.id, data.id), eq(inventory.userId, session.data.userId))
      )
      .limit(1)

    if (!item) {
      throw new Error('Inventory item not found or not owned by you')
    }

    await db.delete(inventory).where(eq(inventory.id, data.id))

    return { deleted: true }
  })
