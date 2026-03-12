import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import appCss from '~/styles/globals.css?url'
import { SiteHeader } from '~/components/nav/site-header'
import { MobileNav } from '~/components/nav/mobile-nav'
import { ToastContainer } from '~/components/notifications/toast-container'
import { getMe } from '~/server/functions/auth'
import { useThemeStore } from '~/lib/stores/theme'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Beer Cellar' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  loader: async () => {
    const user = await getMe()
    return { user }
  },
  component: RootComponent,
})

function RootComponent() {
  const { user } = Route.useLoaderData()
  const { mode } = useThemeStore()

  return (
    <html lang="en" className={mode}>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SiteHeader user={user} />
        <MobileNav />
        <main className="container py-6">
          <Outlet />
        </main>
        <ToastContainer />
        <Scripts />
      </body>
    </html>
  )
}
