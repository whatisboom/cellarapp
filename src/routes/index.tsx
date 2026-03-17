import { createFileRoute } from '@tanstack/react-router'
import { Beer, Users, Search } from 'lucide-react'
import { Card, Hero } from '@whatisboom/boom-ui'

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
    <div className="flex flex-col items-center gap-12">
      <Hero
        heading="Beer Cellar"
        subheading="Your beer inventory and trading platform."
        primaryCTA={{ children: 'Get Started', href: '/auth', variant: 'primary' }}
        variant="centered"
        minHeight="300px"
      />

      <div className="grid gap-6 sm:grid-cols-3 w-full">
        {features.map((feature) => (
          <Card key={feature.title} padding={6} hoverable>
            <feature.icon className="h-8 w-8" style={{ color: 'var(--boom-theme-accent)' }} />
            <h3 className="mt-2 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
