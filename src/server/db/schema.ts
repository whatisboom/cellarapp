import { pgTable, uuid, varchar, integer, decimal, text, timestamp, uniqueIndex, check } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  role: varchar('role', { length: 20 }).default('user').notNull(),
  authProvider: varchar('auth_provider', { length: 50 }).notNull(),
  authProviderId: varchar('auth_provider_id', { length: 255 }).notNull(),
  untappdApiKey: varchar('untappd_api_key', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_auth_provider_idx').on(table.authProvider, table.authProviderId),
])

export const breweries = pgTable('breweries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  untappdId: integer('untappd_id').unique(),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 255 }),
  country: varchar('country', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const beers = pgTable('beers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  untappdId: integer('untappd_id').unique(),
  breweryId: uuid('brewery_id').references(() => breweries.id),
  style: varchar('style', { length: 255 }),
  abv: decimal('abv', { precision: 5, scale: 2 }),
  ibu: integer('ibu'),
  description: text('description'),
  labelUrl: varchar('label_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  beerId: uuid('beer_id').references(() => beers.id, { onDelete: 'cascade' }).notNull(),
  amount: integer('amount').default(1).notNull(),
  forTrade: integer('for_trade').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('inventory_user_beer_idx').on(table.userId, table.beerId),
  check('amount_non_negative', sql`${table.amount} >= 0`),
  check('for_trade_non_negative', sql`${table.forTrade} >= 0`),
  check('for_trade_lte_amount', sql`${table.forTrade} <= ${table.amount}`),
])
