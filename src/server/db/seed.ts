import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/beercellar',
  })
  const db = drizzle({ client: pool, schema })

  console.log('Seeding database...')

  // Clear existing data
  await db.delete(schema.inventory)
  await db.delete(schema.beers)
  await db.delete(schema.breweries)
  await db.delete(schema.users)

  // Create users
  const [user1] = await db.insert(schema.users).values({
    username: 'beercellardev',
    email: 'dev@beercellar.io',
    avatarUrl: 'https://placekitten.com/200/200',
    authProvider: 'untappd',
    authProviderId: 'dev-1',
    firstName: 'Dev',
    lastName: 'User',
    role: 'admin',
  }).returning()

  const [user2] = await db.insert(schema.users).values({
    username: 'hophead',
    email: 'hophead@example.com',
    authProvider: 'untappd',
    authProviderId: 'dev-2',
    firstName: 'Hop',
    lastName: 'Head',
  }).returning()

  // Create breweries
  const [treeHouse] = await db.insert(schema.breweries).values({
    name: 'Tree House Brewing Company',
    slug: 'tree-house-brewing-company',
    untappdId: 29621,
    city: 'Charlton',
    state: 'MA',
    country: 'United States',
  }).returning()

  const [otherHalf] = await db.insert(schema.breweries).values({
    name: 'Other Half Brewing Co.',
    slug: 'other-half-brewing-co',
    untappdId: 128441,
    city: 'Brooklyn',
    state: 'NY',
    country: 'United States',
  }).returning()

  const [hillFarmstead] = await db.insert(schema.breweries).values({
    name: 'Hill Farmstead Brewery',
    slug: 'hill-farmstead-brewery',
    untappdId: 8483,
    city: 'Greensboro Bend',
    state: 'VT',
    country: 'United States',
  }).returning()

  // Create beers
  const [julius] = await db.insert(schema.beers).values({
    name: 'Julius',
    slug: 'julius',
    untappdId: 648434,
    breweryId: treeHouse!.id,
    style: 'IPA - New England / Hazy',
    abv: '6.80',
    description: 'Our flagship New England IPA.',
  }).returning()

  const [greenMachine] = await db.insert(schema.beers).values({
    name: 'Green Machine',
    slug: 'green-machine',
    untappdId: 2563887,
    breweryId: otherHalf!.id,
    style: 'IPA - Imperial / Double New England / Hazy',
    abv: '8.00',
  }).returning()

  const [edward] = await db.insert(schema.beers).values({
    name: 'Edward',
    slug: 'edward',
    untappdId: 4577,
    breweryId: hillFarmstead!.id,
    style: 'Pale Ale - American',
    abv: '5.20',
  }).returning()

  const [haze] = await db.insert(schema.beers).values({
    name: 'Haze',
    slug: 'haze',
    untappdId: 530754,
    breweryId: treeHouse!.id,
    style: 'IPA - New England / Hazy',
    abv: '8.20',
  }).returning()

  // Create inventory
  await db.insert(schema.inventory).values([
    { userId: user1!.id, beerId: julius!.id, amount: 4, forTrade: 2 },
    { userId: user1!.id, beerId: greenMachine!.id, amount: 2, forTrade: 1 },
    { userId: user1!.id, beerId: edward!.id, amount: 1, forTrade: 0 },
    { userId: user2!.id, beerId: haze!.id, amount: 6, forTrade: 3 },
    { userId: user2!.id, beerId: julius!.id, amount: 2, forTrade: 2 },
  ])

  console.log('Seed complete.')
  console.log(`  Users: ${user1!.username}, ${user2!.username}`)
  console.log(`  Breweries: 3`)
  console.log(`  Beers: 4`)
  console.log(`  Inventory entries: 5`)

  await pool.end()
}

seed().catch(console.error)
