import { z } from 'zod'

const UntappdUserSchema = z.object({
  response: z.object({
    user: z.object({
      uid: z.number(),
      user_name: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      settings: z.object({
        email_address: z.string(),
      }),
      user_avatar: z.string().optional(),
    }),
  }),
})

const UntappdOAuthSchema = z.object({
  response: z.object({
    access_token: z.string(),
  }),
})

const UntappdBeerSearchSchema = z.object({
  response: z.object({
    beers: z.object({
      items: z.array(z.object({
        beer: z.object({
          bid: z.number(),
          beer_name: z.string(),
          beer_abv: z.number(),
          beer_style: z.string(),
          beer_slug: z.string(),
          beer_description: z.string().optional(),
          beer_label: z.string().optional(),
        }),
        brewery: z.object({
          brewery_id: z.number(),
          brewery_name: z.string(),
          brewery_slug: z.string(),
          location: z.object({
            brewery_city: z.string(),
            brewery_state: z.string(),
          }),
          country_name: z.string(),
        }),
      })),
    }),
  }),
})

export type UntappdBeerResult = {
  name: string
  slug: string
  untappdId: number
  abv: number
  style: string
  description: string
  labelUrl: string
  brewery: {
    name: string
    slug: string
    untappdId: number
    city: string
    state: string
    country: string
  }
}

export type UntappdUserResult = {
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  untappdId: string
  accessToken: string
}

export async function exchangeUntappdCode(code: string): Promise<string> {
  const url = new URL('https://untappd.com/oauth/authorize/')
  url.searchParams.set('code', code)
  url.searchParams.set('client_id', process.env.UNTAPPD_CLIENT_ID!)
  url.searchParams.set('client_secret', process.env.UNTAPPD_CLIENT_SECRET!)
  url.searchParams.set('redirect_url', process.env.UNTAPPD_CALLBACK_URL!)
  url.searchParams.set('response_type', 'code')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Untappd OAuth failed: ${response.status}`)
  }

  const data = UntappdOAuthSchema.parse(await response.json())
  return data.response.access_token
}

export async function getUntappdUser(accessToken: string): Promise<UntappdUserResult> {
  const response = await fetch(
    `https://api.untappd.com/v4/user/info?access_token=${accessToken}`
  )
  if (!response.ok) {
    throw new Error(`Untappd user info failed: ${response.status}`)
  }

  const data = UntappdUserSchema.parse(await response.json())
  const user = data.response.user

  return {
    username: user.user_name,
    email: user.settings.email_address,
    firstName: user.first_name,
    lastName: user.last_name,
    avatarUrl: user.user_avatar ?? '',
    untappdId: String(user.uid),
    accessToken,
  }
}

export async function searchUntappdBeers(
  query: string,
  accessToken: string
): Promise<UntappdBeerResult[]> {
  const response = await fetch(
    `https://api.untappd.com/v4/search/beer?q=${encodeURIComponent(query)}&access_token=${accessToken}`
  )
  if (!response.ok) {
    throw new Error(`Untappd search failed: ${response.status}`)
  }

  const data = UntappdBeerSearchSchema.parse(await response.json())

  return data.response.beers.items.map((item) => ({
    name: item.beer.beer_name,
    slug: item.beer.beer_slug,
    untappdId: item.beer.bid,
    abv: item.beer.beer_abv,
    style: item.beer.beer_style,
    description: item.beer.beer_description ?? '',
    labelUrl: item.beer.beer_label ?? '',
    brewery: {
      name: item.brewery.brewery_name,
      slug: item.brewery.brewery_slug,
      untappdId: item.brewery.brewery_id,
      city: item.brewery.location.brewery_city,
      state: item.brewery.location.brewery_state,
      country: item.brewery.country_name,
    },
  }))
}
