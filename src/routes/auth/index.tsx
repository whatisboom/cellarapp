import { createFileRoute } from '@tanstack/react-router'
import { Button, Card } from '@whatisboom/boom-ui'

export const Route = createFileRoute('/auth/')({
  component: AuthPage,
})

function AuthPage() {
  const untappdUrl = `https://untappd.com/oauth/authenticate/?client_id=${
    import.meta.env.VITE_UNTAPPD_CLIENT_ID
  }&redirect_url=${encodeURIComponent(
    import.meta.env.VITE_UNTAPPD_CALLBACK_URL
  )}&response_type=code`

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card padding={8} className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold">Sign in to Beer Cellar</h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
          Connect your Untappd account to manage your beer inventory.
        </p>
        <div className="mt-6 flex justify-center">
          <a href={untappdUrl}>
            <Button variant="primary" size="lg">
              Sign in with Untappd
            </Button>
          </a>
        </div>
      </Card>
    </div>
  )
}
