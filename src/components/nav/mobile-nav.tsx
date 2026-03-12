import { Link } from '@tanstack/react-router'
import { Beer, Home, Search, Users, Warehouse } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { useNavStore } from '~/lib/stores/nav'

export function MobileNav() {
  const { open, close } = useNavStore()

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Beer className="h-5 w-5" />
            Beer Cellar
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          <Link to="/dashboard" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Home className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/beers" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Beer className="h-4 w-4" /> Beers
          </Link>
          <Link to="/breweries" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Warehouse className="h-4 w-4" /> Breweries
          </Link>
          <Link to="/search/beers" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Search className="h-4 w-4" /> Search
          </Link>
          <Link to="/users" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Users className="h-4 w-4" /> Users
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
