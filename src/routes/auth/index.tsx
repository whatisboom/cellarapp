import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in to Beer Cellar</CardTitle>
          <CardDescription>
            Connect your Untappd account to manage your beer inventory.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild size="lg">
            <a href={untappdUrl}>Sign in with Untappd</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
