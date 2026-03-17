import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Avatar, Button, Card, Input } from '@whatisboom/boom-ui'
import { listUsers } from '~/server/functions/users'

export const Route = createFileRoute('/users/')({
  validateSearch: (search) => z.object({
    page: z.number().int().min(1).catch(1),
    search: z.string().optional(),
  }).parse(search),
  loaderDeps: ({ search }) => ({ page: search.page, search: search.search }),
  loader: async ({ deps }) => listUsers({ data: { page: deps.page, limit: 20, search: deps.search } }),
  component: UsersList,
})

function UsersList() {
  const { users, page, totalPages } = Route.useLoaderData()
  const { search } = Route.useSearch()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <form className="flex gap-2 max-w-md">
        <Input
          name="search"
          defaultValue={search ?? ''}
          placeholder="Search users..."
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Link key={user.id} to="/users/$username" params={{ username: user.username }}>
            <Card padding={6} hoverable>
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatarUrl ?? undefined}
                  alt={user.username}
                  name={user.username}
                />
                <span className="text-lg font-semibold">{user.username}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Link to="/users" search={{ page: page - 1, search }}>
            <Button variant="secondary" size="sm" disabled={page <= 1}>Previous</Button>
          </Link>
          <span className="flex items-center text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          <Link to="/users" search={{ page: page + 1, search }}>
            <Button variant="secondary" size="sm" disabled={page >= totalPages}>Next</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
