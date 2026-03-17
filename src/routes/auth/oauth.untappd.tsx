import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { loginWithUntappd } from '~/server/functions/auth'
import { Alert, Spinner } from '@whatisboom/boom-ui'

const searchSchema = z.object({
  code: z.string().optional(),
})

export const Route = createFileRoute('/auth/oauth/untappd')({
  validateSearch: (search) => searchSchema.parse(search),
  component: OAuthCallback,
})

function OAuthCallback() {
  const { code } = Route.useSearch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setError('No authorization code received from Untappd.')
      return
    }

    loginWithUntappd({ data: { code } })
      .then(() => {
        navigate({ to: '/dashboard' })
      })
      .catch((err: Error) => {
        setError(err.message || 'Authentication failed. Please try again.')
      })
  }, [code, navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="error" className="max-w-md">
          <strong>Authentication Error</strong>
          <p>{error}</p>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
      <p className="ml-3" style={{ color: 'var(--boom-theme-text-secondary)' }}>
        Authenticating with Untappd...
      </p>
    </div>
  )
}
