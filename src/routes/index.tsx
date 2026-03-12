import { createFileRoute, Link } from '@tanstack/react-router'
import { Beer, Users, Search, ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const features = [
    {
      icon: Beer,
      title: 'Track Your Cellar',
      description: 'Keep an inventory of all the beers in your collection.',
    },
    {
      icon: Users,
      title: 'Trade with Others',
      description: 'Mark beers for trade and connect with other collectors.',
    },
    {
      icon: Search,
      title: 'Discover Beers',
      description: 'Search the Untappd database to find and add new beers.',
    },
  ]

  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Beer Cellar</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your beer inventory and trading platform.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/auth">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
