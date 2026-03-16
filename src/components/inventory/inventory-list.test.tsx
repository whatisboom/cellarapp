import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRouterMock } from '~/tests/render-helpers'

vi.mock('@tanstack/react-router', () => createRouterMock())

const { InventoryList } = await import('./inventory-list')

const noop = () => {}

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `inv-${i}`,
    amount: i + 1,
    forTrade: 0,
    beer: { id: `beer-${i}`, name: `Test Beer ${i}`, slug: `beer-${i}`, style: null, abv: null },
    brewery: { name: `Brewery ${i}`, slug: `brewery-${i}` },
  }))
}

describe('InventoryList', () => {
  it('renders empty state when items is empty', () => {
    render(<InventoryList items={[]} isOwner={false} onUpdate={noop} onRemove={noop} />)
    expect(screen.getByText('No beers in cellar yet.')).toBeInTheDocument()
  })

  it('renders table with correct headers', () => {
    render(<InventoryList items={makeItems(1)} isOwner={false} onUpdate={noop} onRemove={noop} />)
    expect(screen.getByText('Beer')).toBeInTheDocument()
    expect(screen.getByText('Brewery')).toBeInTheDocument()
    expect(screen.getByText('Qty')).toBeInTheDocument()
    expect(screen.getByText('For Trade')).toBeInTheDocument()
  })

  it('renders one row per item', () => {
    render(<InventoryList items={makeItems(3)} isOwner={false} onUpdate={noop} onRemove={noop} />)
    expect(screen.getByRole('link', { name: 'Test Beer 0' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Test Beer 1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Test Beer 2' })).toBeInTheDocument()
  })
})
