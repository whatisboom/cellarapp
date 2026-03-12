import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
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
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
                  <AvatarFallback>{user.username[0]!.toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{user.username}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link to="/users" search={{ page: page - 1, search }}>Previous</Link>
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link to="/users" search={{ page: page + 1, search }}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
