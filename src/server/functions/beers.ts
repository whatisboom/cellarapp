import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { beers, breweries } from '~/server/db/schema'

export const listBeers = createServerFn({ method: 'GET' })
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
        .select({
          id: beers.id,
          name: beers.name,
          slug: beers.slug,
          style: beers.style,
          abv: beers.abv,
          labelUrl: beers.labelUrl,
          breweryName: breweries.name,
          brewerySlug: breweries.slug,
        })
        .from(beers)
        .leftJoin(breweries, eq(beers.breweryId, breweries.id))
        .limit(data.limit)
        .offset(offset)
        .orderBy(beers.name),
      db.select({ count: sql<number>`count(*)` }).from(beers),
    ])

    return {
      beers: items,
      total: Number(countResult!.count),
      page: data.page,
      totalPages: Math.ceil(Number(countResult!.count) / data.limit),
    }
  })

export const getBeer = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const db = getDb()

    const [beer] = await db
      .select({
        id: beers.id,
        name: beers.name,
        slug: beers.slug,
        style: beers.style,
        abv: beers.abv,
        ibu: beers.ibu,
        description: beers.description,
        labelUrl: beers.labelUrl,
        brewery: {
          id: breweries.id,
          name: breweries.name,
          slug: breweries.slug,
          city: breweries.city,
          state: breweries.state,
          country: breweries.country,
        },
      })
      .from(beers)
      .leftJoin(breweries, eq(beers.breweryId, breweries.id))
      .where(eq(beers.slug, data.slug))
      .limit(1)

    if (!beer) {
      throw new Error('Beer not found')
    }

    return beer
  })
