import { useState } from 'react'
import { Trash2, Pencil, X, Check } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Slider } from '~/components/ui/slider'
import { Badge } from '~/components/ui/badge'
import { TableCell, TableRow } from '~/components/ui/table'
import { Link } from '@tanstack/react-router'

interface InventoryItemProps {
  item: {
    id: string
    amount: number
    forTrade: number
    beer: {
      id: string
      name: string
      slug: string
      style: string | null
      abv: string | null
    }
    brewery: {
      name: string
      slug: string
    } | null
  }
  isOwner: boolean
  onUpdate: (id: string, amount: number, forTrade: number) => void
  onRemove: (id: string) => void
}

export function InventoryItem({ item, isOwner, onUpdate, onRemove }: InventoryItemProps) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(item.amount)
  const [forTrade, setForTrade] = useState(item.forTrade)

  function handleSave() {
    onUpdate(item.id, amount, forTrade)
    setEditing(false)
  }

  function handleCancel() {
    setAmount(item.amount)
    setForTrade(item.forTrade)
    setEditing(false)
  }

  return (
    <TableRow>
      <TableCell>
        <Link to="/beers/$slug" params={{ slug: item.beer.slug }} className="font-medium hover:underline">
          {item.beer.name}
        </Link>
        {item.beer.style && (
          <span className="ml-2 text-xs text-muted-foreground">{item.beer.style}</span>
        )}
      </TableCell>
      <TableCell>
        {item.brewery ? (
          <Link to="/breweries/$slug" params={{ slug: item.brewery.slug }} className="text-sm hover:underline">
            {item.brewery.name}
          </Link>
        ) : '—'}
      </TableCell>
      <TableCell>
        {editing ? (
          <Slider value={[amount]} onValueChange={([v]) => { if (v !== undefined) setAmount(v) }} min={0} max={100} step={1} className="w-24" />
        ) : (
          amount
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Slider value={[forTrade]} onValueChange={([v]) => { if (v !== undefined) setForTrade(Math.min(v, amount)) }} min={0} max={amount} step={1} className="w-24" />
        ) : (
          forTrade > 0 ? <Badge variant="secondary">{forTrade} FT</Badge> : '—'
        )}
      </TableCell>
      {isOwner && (
        <TableCell className="text-right">
          {editing ? (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" onClick={handleSave}><Check className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )}
        </TableCell>
      )}
    </TableRow>
  )
}
