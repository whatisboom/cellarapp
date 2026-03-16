import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRouterMock } from '~/tests/render-helpers'

vi.mock('@tanstack/react-router', () => createRouterMock())

const { InventoryItem } = await import('./inventory-item')

function makeItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 'inv-1',
    amount: 3,
    forTrade: 1,
    beer: { id: 'beer-1', name: 'Heady Topper', slug: 'heady-topper', style: 'DIPA', abv: '8.0' },
    brewery: { name: 'The Alchemist', slug: 'the-alchemist' },
    ...overrides,
  } as Parameters<typeof InventoryItem>[0]['item']
}

const noop = () => {}

function renderItem(props: Partial<Parameters<typeof InventoryItem>[0]> = {}) {
  const defaultProps = {
    item: makeItem(),
    isOwner: false,
    onUpdate: noop,
    onRemove: noop,
    ...props,
  }
  return render(
    <table><tbody>
      <InventoryItem {...defaultProps} />
    </tbody></table>,
  )
}

describe('InventoryItem', () => {
  let onUpdate: (id: string, amount: number, forTrade: number) => void
  let onRemove: (id: string) => void

  beforeEach(() => {
    onUpdate = vi.fn()
    onRemove = vi.fn()
  })

  it('renders beer name and brewery as links', () => {
    renderItem()
    const beerLink = screen.getByRole('link', { name: /Heady Topper/i })
    expect(beerLink).toHaveAttribute('href', '/beers/heady-topper')

    const breweryLink = screen.getByRole('link', { name: /The Alchemist/i })
    expect(breweryLink).toHaveAttribute('href', '/breweries/the-alchemist')
  })

  it('shows style when present', () => {
    const { container } = renderItem()
    expect(container.querySelector('.text-xs')).toHaveTextContent('DIPA')
  })

  it('shows dash when forTrade is 0', () => {
    renderItem({ item: makeItem({ forTrade: 0 }) })
    expect(screen.queryByText(/FT/)).not.toBeInTheDocument()
  })

  it('shows FT badge when forTrade > 0', () => {
    renderItem({ item: makeItem({ forTrade: 2 }) })
    expect(screen.getByText('2 FT')).toBeInTheDocument()
  })

  it('hides action buttons when isOwner is false', () => {
    renderItem({ isOwner: false })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('click edit shows save/cancel buttons', async () => {
    const user = userEvent.setup()
    renderItem({ isOwner: true, onUpdate, onRemove })

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2) // edit + delete

    await user.click(buttons[0]!) // click edit
    // In edit mode: save + cancel buttons (sliders don't use role="button")
    const editButtons = screen.getAllByRole('button')
    expect(editButtons).toHaveLength(2)
  })

  it('cancel exits edit mode', async () => {
    const user = userEvent.setup()
    renderItem({ isOwner: true, onUpdate, onRemove })

    await user.click(screen.getAllByRole('button')[0]!)

    // Click cancel (second button in edit mode)
    await user.click(screen.getAllByRole('button')[1]!)

    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('save calls onUpdate with item id', async () => {
    const user = userEvent.setup()
    renderItem({ isOwner: true, onUpdate, onRemove })

    await user.click(screen.getAllByRole('button')[0]!) // enter edit
    await user.click(screen.getAllByRole('button')[0]!) // click save
    expect(onUpdate).toHaveBeenCalledWith('inv-1', 3, 1)
  })

  it('remove calls onRemove with item id', async () => {
    const user = userEvent.setup()
    renderItem({ isOwner: true, onUpdate, onRemove })

    await user.click(screen.getAllByRole('button')[1]!) // click delete
    expect(onRemove).toHaveBeenCalledWith('inv-1')
  })
})
