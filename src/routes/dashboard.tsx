import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Avatar, Card, useToast } from '@whatisboom/boom-ui'
import { InventoryList } from '~/components/inventory/inventory-list'
import { getMe } from '~/server/functions/auth'
import { getUserInventory, updateInventory, removeFromInventory } from '~/server/functions/inventory'

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
  const { toast } = useToast()

  async function handleUpdate(id: string, amount: number, forTrade: number) {
    try {
      await updateInventory({ data: { id, amount, forTrade } })
      toast({ message: 'Inventory updated', variant: 'success' })
      router.invalidate()
    } catch (err) {
      toast({ message: err instanceof Error ? err.message : 'Failed to update', variant: 'error' })
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeFromInventory({ data: { id } })
      toast({ message: 'Beer removed from cellar', variant: 'success' })
      router.invalidate()
    } catch (err) {
      toast({ message: err instanceof Error ? err.message : 'Failed to remove', variant: 'error' })
    }
  }

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
              {user.firstName} {user.lastName} &middot; {inventory.length} beers in cellar
            </p>
          </div>
        </div>
      </Card>

      <Card padding={6}>
        <h2 className="text-xl font-bold mb-4">My Cellar</h2>
        <InventoryList
          items={inventory}
          isOwner={true}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
        />
      </Card>
    </div>
  )
}
