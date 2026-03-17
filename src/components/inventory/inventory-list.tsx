import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Trash2, Pencil, X, Check } from 'lucide-react'
import { Table, Button, Slider, Badge, EmptyState } from '@whatisboom/boom-ui'
import type { ColumnDef } from '@whatisboom/boom-ui'

interface InventoryRow {
  id: string
  amount: number
  forTrade: number
  beer: { id: string; name: string; slug: string; style: string | null; abv: string | null }
  brewery: { name: string; slug: string } | null
}

interface InventoryListProps {
  items: InventoryRow[]
  isOwner: boolean
  onUpdate: (id: string, amount: number, forTrade: number) => void
  onRemove: (id: string) => void
}

export function InventoryList({ items, isOwner, onUpdate, onRemove }: InventoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState(0)
  const [editForTrade, setEditForTrade] = useState(0)

  function startEditing(item: InventoryRow) {
    setEditingId(item.id)
    setEditAmount(item.amount)
    setEditForTrade(item.forTrade)
  }

  function handleSave(id: string) {
    onUpdate(id, editAmount, editForTrade)
    setEditingId(null)
  }

  function handleCancel() {
    setEditingId(null)
  }

  const columns: ColumnDef<InventoryRow>[] = [
    {
      id: 'beer',
      header: 'Beer',
      cell: ({ row }) => (
        <>
          <Link to="/beers/$slug" params={{ slug: row.beer.slug }} className="font-medium hover:underline">
            {row.beer.name}
          </Link>
          {row.beer.style && (
            <span className="ml-2 text-xs" style={{ color: 'var(--boom-theme-text-secondary)' }}>{row.beer.style}</span>
          )}
        </>
      ),
    },
    {
      id: 'brewery',
      header: 'Brewery',
      cell: ({ row }) =>
        row.brewery ? (
          <Link to="/breweries/$slug" params={{ slug: row.brewery.slug }} className="text-sm hover:underline">
            {row.brewery.name}
          </Link>
        ) : '—',
    },
    {
      id: 'amount',
      header: 'Qty',
      cell: ({ row }) =>
        editingId === row.id ? (
          <Slider value={editAmount} onChange={(v) => setEditAmount(v)} min={0} max={100} step={1} className="w-24" />
        ) : (
          row.amount
        ),
    },
    {
      id: 'forTrade',
      header: 'For Trade',
      cell: ({ row }) =>
        editingId === row.id ? (
          <Slider value={editForTrade} onChange={(v) => setEditForTrade(Math.min(v, editAmount))} min={0} max={editAmount} step={1} className="w-24" />
        ) : (
          row.forTrade > 0 ? <Badge variant="info">{row.forTrade} FT</Badge> : '—'
        ),
    },
    ...(isOwner ? [{
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: InventoryRow }) =>
        editingId === row.id ? (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleSave(row.id)}><Check className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}><X className="h-4 w-4" /></Button>
          </div>
        ) : (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => startEditing(row)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => onRemove(row.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ),
    }] : []),
  ]

  if (items.length === 0) {
    return <EmptyState title="No beers in cellar yet" />
  }

  return (
    <Table<InventoryRow>
      columns={columns}
      data={items}
      getRowId={(row) => row.id}
      hoverable
    />
  )
}
