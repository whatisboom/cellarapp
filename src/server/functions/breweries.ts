import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { beers, breweries } from '~/server/db/schema'

export const listBreweries = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    })
  )
  .handler(async ({ data }) => {
    const db = getDb()
    const offset = (data.page - 1) * data.limit

    const [items, [countResult]] = await Promise.all([
      db
        .select()
        .from(breweries)
        .limit(data.limit)
        .offset(offset)
        .orderBy(breweries.name),
      db.select({ count: sql<number>`count(*)` }).from(breweries),
    ])

    return {
      breweries: items,
      total: Number(countResult!.count),
      page: data.page,
      totalPages: Math.ceil(Number(countResult!.count) / data.limit),
    }
  })

export const getBrewery = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const db = getDb()

    const [brewery] = await db
      .select()
      .from(breweries)
      .where(eq(breweries.slug, data.slug))
      .limit(1)

    if (!brewery) {
      throw new Error('Brewery not found')
    }

    const breweryBeers = await db
      .select({
        id: beers.id,
        name: beers.name,
        slug: beers.slug,
        style: beers.style,
        abv: beers.abv,
        labelUrl: beers.labelUrl,
      })
      .from(beers)
      .where(eq(beers.breweryId, brewery.id))
      .orderBy(beers.name)

    return { ...brewery, beers: breweryBeers }
  })
