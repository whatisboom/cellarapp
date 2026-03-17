import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { ThemeProvider, ToastProvider } from '@whatisboom/boom-ui'
import appCss from '~/styles/globals.css?url'
import { SiteHeader } from '~/components/nav/site-header'
import { MobileNav } from '~/components/nav/mobile-nav'
import { getMe } from '~/server/functions/auth'

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

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="beercellar-theme">
          <ToastProvider position="bottom-right">
            <SiteHeader user={user} />
            <MobileNav />
            <main className="container py-6">
              <Outlet />
            </main>
          </ToastProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
