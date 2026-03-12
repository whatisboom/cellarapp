import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Moon, Sun } from 'lucide-react'
import { getMe } from '~/server/functions/auth'
import { useThemeStore } from '~/lib/stores/theme'

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
  const { mode, toggle } = useThemeStore()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Beer Cellar looks.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Theme</Label>
          <Button variant="outline" size="sm" onClick={toggle}>
            {mode === 'light' ? (
              <>
                <Moon className="mr-2 h-4 w-4" /> Dark mode
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4" /> Light mode
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
