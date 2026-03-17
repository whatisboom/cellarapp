import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { asMockRoute, createRouterMock } from '~/tests/render-helpers'

const mockSetTheme = vi.fn()
let mockResolvedTheme = 'light'

vi.mock('@tanstack/react-router', () => createRouterMock())
vi.mock('~/server/functions/auth', () => ({ getMe: vi.fn() }))
vi.mock('@whatisboom/boom-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@whatisboom/boom-ui')>()
  return {
    ...actual,
    useTheme: () => ({
      theme: mockResolvedTheme,
      resolvedTheme: mockResolvedTheme,
      setTheme: mockSetTheme,
      colors: {},
    }),
  }
})

const routeModule = await import('./settings')
const Component = asMockRoute(routeModule.Route).component

describe('Settings page', () => {
  beforeEach(() => {
    mockResolvedTheme = 'light'
    mockSetTheme.mockClear()
  })

  it('renders "Dark mode" button when theme is light', () => {
    render(<Component />)
    expect(screen.getByRole('button', { name: /Dark mode/i })).toBeInTheDocument()
  })

  it('calls setTheme with "dark" on click', async () => {
    const user = userEvent.setup()
    render(<Component />)
    await user.click(screen.getByRole('button', { name: /Dark mode/i }))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
