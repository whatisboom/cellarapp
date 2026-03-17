import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, Button, useTheme } from '@whatisboom/boom-ui'
import { Moon, Sun } from 'lucide-react'
import { getMe } from '~/server/functions/auth'

export const Route = createFileRoute('/settings')({
  loader: async () => {
    const user = await getMe()
    if (!user) {
      throw redirect({ to: '/auth' })
    }
    return { user }
  },
  component: SettingsPage,
})

function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggle = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card padding={6}>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="text-sm text-muted mb-4">Customize how Beer Cellar looks.</p>
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <Button variant="secondary" size="sm" onClick={toggle}>
            {resolvedTheme === 'light' ? (
              <>
                <Moon className="mr-2 h-4 w-4" /> Dark mode
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4" /> Light mode
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
