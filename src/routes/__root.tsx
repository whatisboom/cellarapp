import { useRef, useState } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import {
  AppShell,
  Avatar,
  Button,
  Header,
  Popover,
  Sidebar,
  ThemeProvider,
  ToastProvider,
  useTheme,
} from '@whatisboom/boom-ui'
import {
  Beer,
  Home,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Users,
  Warehouse,
} from 'lucide-react'
import appCss from '~/styles/globals.css?url'
import { getMe } from '~/server/functions/auth'
import { logout } from '~/server/functions/auth'

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
            {user ? <AuthenticatedLayout user={user} /> : <PublicLayout />}
          </ToastProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

interface UserInfo {
  username: string
  avatarUrl: string | null
}

function AuthenticatedLayout({ user }: { user: UserInfo }) {
  const navigate = useNavigate()

  const sidebar = (
    <Sidebar>
      <Sidebar.Header>
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Beer className="h-5 w-5" />
          Beer Cellar
        </Link>
      </Sidebar.Header>
      <Sidebar.Nav>
        <Sidebar.Item icon={<Home className="h-4 w-4" />} label="Dashboard" onClick={() => navigate({ to: '/dashboard' })} />
        <Sidebar.Item icon={<Beer className="h-4 w-4" />} label="Beers" onClick={() => navigate({ to: '/beers' })} />
        <Sidebar.Item icon={<Warehouse className="h-4 w-4" />} label="Breweries" onClick={() => navigate({ to: '/breweries' })} />
        <Sidebar.Item icon={<Search className="h-4 w-4" />} label="Search" onClick={() => navigate({ to: '/search/beers' })} />
        <Sidebar.Item icon={<Users className="h-4 w-4" />} label="Users" onClick={() => navigate({ to: '/users' })} />
      </Sidebar.Nav>
    </Sidebar>
  )

  const header = (
    <Header
      logo={
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Beer className="h-5 w-5" />
          Beer Cellar
        </Link>
      }
    >
      <ThemeToggle />
      <UserMenu user={user} />
    </Header>
  )

  return (
    <AppShell header={header} sidebar={sidebar}>
      <main className="container py-6">
        <Outlet />
      </main>
    </AppShell>
  )
}

function PublicLayout() {
  return (
    <>
      <Header
        logo={
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Beer className="h-5 w-5" />
            Beer Cellar
          </Link>
        }
        sticky
      >
        <Button variant="primary" size="sm" onClick={() => undefined}>
          <Link to="/auth">Sign In</Link>
        </Button>
      </Header>
      <main className="container py-6">
        <Outlet />
      </main>
    </>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const toggle = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')

  return (
    <Button variant="ghost" size="sm" onClick={toggle}>
      {resolvedTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}

function UserMenu({ user }: { user: UserInfo }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const router = useRouter()

  const handleNav = (to: string, params?: Record<string, string>) => {
    setOpen(false)
    navigate({ to, params })
  }

  const handleLogout = () => {
    setOpen(false)
    logout().then(() => router.invalidate())
  }

  return (
    <>
      <button ref={anchorRef} onClick={() => setOpen(!open)} className="rounded-full">
        <Avatar
          src={user.avatarUrl ?? undefined}
          alt={user.username}
          name={user.username}
          size="sm"
        />
      </button>
      <Popover isOpen={open} onClose={() => setOpen(false)} anchorEl={anchorRef} placement="bottom">
        <div className="flex flex-col gap-1 p-2" style={{ minWidth: '160px' }}>
          <button
            className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-[var(--boom-theme-bg-elevated)]"
            onClick={() => handleNav('/users/$username', { username: user.username })}
          >
            <User className="h-4 w-4" /> Profile
          </button>
          <button
            className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-[var(--boom-theme-bg-elevated)]"
            onClick={() => handleNav('/settings')}
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
          <hr className="my-1 border-[var(--boom-theme-border-default)]" />
          <button
            className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-[var(--boom-theme-bg-elevated)]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </Popover>
    </>
  )
}
