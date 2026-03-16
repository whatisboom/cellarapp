import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { exchangeUntappdCode, getUntappdUser, searchUntappdBeers } from './untappd'

const fetchSpy = vi.spyOn(globalThis, 'fetch')

beforeEach(() => {
  process.env.UNTAPPD_CLIENT_ID = 'test-client-id'
  process.env.UNTAPPD_CLIENT_SECRET = 'test-client-secret'
  process.env.UNTAPPD_CALLBACK_URL = 'http://localhost:3000/callback'
})

afterEach(() => {
  fetchSpy.mockReset()
})

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('exchangeUntappdCode', () => {
  it('builds correct OAuth URL and returns access_token', async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({ response: { access_token: 'my-token' } })
    )

    const token = await exchangeUntappdCode('auth-code-123')

    expect(token).toBe('my-token')
    const calledUrl = new URL(fetchSpy.mock.calls[0]![0] as string)
    expect(calledUrl.origin + calledUrl.pathname).toBe('https://untappd.com/oauth/authorize/')
    expect(calledUrl.searchParams.get('code')).toBe('auth-code-123')
    expect(calledUrl.searchParams.get('client_id')).toBe('test-client-id')
    expect(calledUrl.searchParams.get('client_secret')).toBe('test-client-secret')
    expect(calledUrl.searchParams.get('redirect_url')).toBe('http://localhost:3000/callback')
    expect(calledUrl.searchParams.get('response_type')).toBe('code')
  })

  it('throws on non-OK response', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response('Forbidden', { status: 403 })
    )

    await expect(exchangeUntappdCode('bad-code')).rejects.toThrow('Untappd OAuth failed: 403')
  })
})

describe('getUntappdUser', () => {
  it('maps API response to UntappdUserResult', async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({
        response: {
          user: {
            uid: 42,
            user_name: 'hophead',
            first_name: 'Hop',
            last_name: 'Head',
            settings: { email_address: 'hop@example.com' },
            user_avatar: 'https://example.com/avatar.png',
          },
        },
      })
    )

    const user = await getUntappdUser('my-token')

    expect(user).toEqual({
      username: 'hophead',
      email: 'hop@example.com',
      firstName: 'Hop',
      lastName: 'Head',
      avatarUrl: 'https://example.com/avatar.png',
      untappdId: '42',
      accessToken: 'my-token',
    })
  })

  it('throws on non-OK response', async () => {
    fetchSpy.mockResolvedValueOnce(new Response('Error', { status: 500 }))

    await expect(getUntappdUser('bad-token')).rejects.toThrow('Untappd user info failed: 500')
  })

  it('throws on malformed response (Zod validation)', async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({ response: { user: { missing_fields: true } } })
    )

    await expect(getUntappdUser('token')).rejects.toThrow()
  })
})

describe('searchUntappdBeers', () => {
  it('maps results array correctly', async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({
        response: {
          beers: {
            items: [
              {
                beer: {
                  bid: 1,
                  beer_name: 'Hazy IPA',
                  beer_abv: 6.5,
                  beer_style: 'IPA - New England',
                  beer_slug: 'hazy-ipa',
                  beer_description: 'A hazy one',
                  beer_label: 'https://example.com/label.png',
                },
                brewery: {
                  brewery_id: 10,
                  brewery_name: 'Haze Brewery',
                  brewery_slug: 'haze-brewery',
                  location: { brewery_city: 'Portland', brewery_state: 'OR' },
                  country_name: 'United States',
                },
              },
            ],
          },
        },
      })
    )

    const results = await searchUntappdBeers('hazy', 'token')

    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      name: 'Hazy IPA',
      slug: 'hazy-ipa',
      untappdId: 1,
      abv: 6.5,
      style: 'IPA - New England',
      description: 'A hazy one',
      labelUrl: 'https://example.com/label.png',
      brewery: {
        name: 'Haze Brewery',
        slug: 'haze-brewery',
        untappdId: 10,
        city: 'Portland',
        state: 'OR',
        country: 'United States',
      },
    })
  })

  it('returns empty array for no results', async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({ response: { beers: { items: [] } } })
    )

    const results = await searchUntappdBeers('nonexistent', 'token')
    expect(results).toEqual([])
  })

  it('handles optional beer fields', async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({
        response: {
          beers: {
            items: [
              {
                beer: {
                  bid: 2,
                  beer_name: 'Mystery Beer',
                  beer_abv: 5.0,
                  beer_style: 'Lager',
                  beer_slug: 'mystery-beer',
                  // no beer_description or beer_label
                },
                brewery: {
                  brewery_id: 20,
                  brewery_name: 'Mystery Brewery',
                  brewery_slug: 'mystery-brewery',
                  location: { brewery_city: 'Denver', brewery_state: 'CO' },
                  country_name: 'United States',
                },
              },
            ],
          },
        },
      })
    )

    const results = await searchUntappdBeers('mystery', 'token')

    expect(results[0]!.description).toBe('')
    expect(results[0]!.labelUrl).toBe('')
  })
})
