import { Table, TableBody, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { InventoryItem } from './inventory-item'

interface InventoryListProps {
  items: Array<{
    id: string
    amount: number
    forTrade: number
    beer: { id: string; name: string; slug: string; style: string | null; abv: string | null }
    brewery: { name: string; slug: string } | null
  }>
  isOwner: boolean
  onUpdate: (id: string, amount: number, forTrade: number) => void
  onRemove: (id: string) => void
}

export function InventoryList({ items, isOwner, onUpdate, onRemove }: InventoryListProps) {
  if (items.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No beers in cellar yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Beer</TableHead>
          <TableHead>Brewery</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>For Trade</TableHead>
          {isOwner && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <InventoryItem
            key={item.id}
            item={item}
            isOwner={isOwner}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </TableBody>
    </Table>
  )
}
