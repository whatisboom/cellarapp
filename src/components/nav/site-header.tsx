import { Link, useRouter } from '@tanstack/react-router'
import { Menu, Beer, LogOut, Settings, User } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useNavStore } from '~/lib/stores/nav'
import { logout } from '~/server/functions/auth'

interface SiteHeaderProps {
  user: {
    username: string
    avatarUrl: string | null
  } | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const { toggle } = useNavStore()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        {user && (
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggle}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <Link to="/" className="flex items-center gap-2 font-bold">
          <Beer className="h-5 w-5" />
          Beer Cellar
        </Link>

        {user && (
          <nav className="ml-6 hidden gap-4 md:flex">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Dashboard
            </Link>
            <Link to="/beers" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Beers
            </Link>
            <Link to="/breweries" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Breweries
            </Link>
            <Link to="/search/beers" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Search
            </Link>
            <Link to="/users" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Users
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
                    <AvatarFallback>{user.username[0]!.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/users/$username" params={{ username: user.username }}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout().then(() => router.invalidate())}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
