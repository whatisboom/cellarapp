import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
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
})

function UserProfile() {
  const { user, inventory } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">{user.username[0]!.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>
              {user.firstName} {user.lastName}
              {user.location && ` — ${user.location}`}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cellar ({inventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryList
            items={inventory}
            isOwner={false}
            onUpdate={() => {}}
            onRemove={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  )
}
