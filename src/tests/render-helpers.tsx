import React from 'react'
import { vi } from 'vitest'

// Controllable loader/search data for route tests
let _loaderData: unknown = {}
let _searchData: unknown = {}

export function createRouterMock() {
  return {
    createFileRoute: (_path: string) => {
      return (options: { component?: React.ComponentType }) => {
        const route = {
          component: options.component,
          useLoaderData: () => _loaderData,
          useSearch: () => _searchData,
          __setLoaderData: (data: unknown) => {
            _loaderData = data
          },
          __setSearchData: (data: unknown) => {
            _searchData = data
          },
        }
        return route
      }
    },
    Link: React.forwardRef<
      HTMLAnchorElement,
      {
        to: string
        params?: Record<string, string>
        search?: Record<string, unknown>
        children?: React.ReactNode
        className?: string
        onClick?: React.MouseEventHandler
        activeProps?: Record<string, unknown>
      }
    >(function MockLink({ to, params, search, children, activeProps: _, ...rest }, ref) {
      let href = to
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          href = href.replace(`$${key}`, value)
        }
      }
      if (search) {
        const qs = new URLSearchParams()
        for (const [key, value] of Object.entries(search)) {
          if (value !== undefined) qs.set(key, String(value))
        }
        href += `?${qs.toString()}`
      }
      return (
        <a ref={ref} href={href} {...rest}>
          {children}
        </a>
      )
    }),
    useRouter: () => ({ invalidate: vi.fn() }),
    useNavigate: () => vi.fn(),
    redirect: vi.fn(),
  }
}

export interface MockRoute {
  component: React.ComponentType
  useLoaderData: () => unknown
  useSearch: () => unknown
  __setLoaderData: (data: unknown) => void
  __setSearchData: (data: unknown) => void
}

/** Cast a route module's Route export to the mock shape for testing */
export function asMockRoute(route: unknown): MockRoute {
  return route as MockRoute
}
