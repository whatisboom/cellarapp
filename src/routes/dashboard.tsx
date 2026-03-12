import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { InventoryList } from '~/components/inventory/inventory-list'
import { getMe } from '~/server/functions/auth'
import { getUserInventory, updateInventory, removeFromInventory } from '~/server/functions/inventory'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const user = await getMe()
    if (!user) {
      throw redirect({ to: '/auth' })
    }
    const inventory = await getUserInventory({ data: { userId: user.id } })
    return { user, inventory }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user, inventory } = Route.useLoaderData()
  const router = useRouter()

  async function handleUpdate(id: string, amount: number, forTrade: number) {
    try {
      await updateInventory({ data: { id, amount, forTrade } })
      toast.success('Inventory updated')
      router.invalidate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeFromInventory({ data: { id } })
      toast.success('Beer removed from cellar')
      router.invalidate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove')
    }
  }

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
              {user.firstName} {user.lastName} &middot; {inventory.length} beers in cellar
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Cellar</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryList
            items={inventory}
            isOwner={true}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        </CardContent>
      </Card>
    </div>
  )
}
