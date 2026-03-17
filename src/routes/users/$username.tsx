import { createFileRoute } from '@tanstack/react-router'
import { Avatar, Card } from '@whatisboom/boom-ui'
import { RouteError } from '~/components/route-error'
import { InventoryList } from '~/components/inventory/inventory-list'
import { getUser } from '~/server/functions/users'
import { getUserInventory } from '~/server/functions/inventory'

export const Route = createFileRoute('/users/$username')({
  loader: async ({ params }) => {
    const user = await getUser({ data: { username: params.username } })
    const inventory = await getUserInventory({ data: { userId: user.id } })
    return { user, inventory }
  },
  component: UserProfile,
  errorComponent: ({ error }) => <RouteError error={error} />,
})

function UserProfile() {
  const { user, inventory } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <Card padding={6}>
        <div className="flex items-center gap-4">
          <Avatar
            src={user.avatarUrl ?? undefined}
            alt={user.username}
            name={user.username}
            size="lg"
          />
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p style={{ color: 'var(--boom-theme-text-secondary)' }}>
              {user.firstName} {user.lastName}
              {user.location && ` — ${user.location}`}
            </p>
          </div>
        </div>
      </Card>

      <Card padding={6}>
        <h2 className="text-lg font-semibold mb-4">Cellar ({inventory.length})</h2>
        <InventoryList
          items={inventory}
          isOwner={false}
          onUpdate={() => {}}
          onRemove={() => {}}
        />
      </Card>
    </div>
  )
}
