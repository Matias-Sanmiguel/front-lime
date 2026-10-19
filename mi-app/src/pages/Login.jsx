import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch, ApiError } from '@/api/client'
import { useAuth } from '@/auth/AuthContext.jsx'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Ingresá tu email y tu contraseña')
      return
    }
    setSending(true)
    setError(null)
    try {
      const session = await apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password },
      })
      login(session.token, session.user)
      navigate('/panel')
    } catch (err) {
      setError(err instanceof ApiError && err.detail ? err.detail : 'No pudimos iniciar sesión')
      setSending(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Ingresar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accedé a tu cuenta para publicar y gestionar tus avisos.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password">Contraseña</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={sending}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={sending}>
          {sending ? 'Ingresando...' : 'Ingresar'}
        </Button>

        <p className="text-sm text-muted-foreground">
          Datos de prueba: <strong>lime@test.com</strong> y la contraseña <strong>12345678</strong>.
        </p>
      </form>

      <p className="text-sm text-muted-foreground">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="font-medium text-accent-ink underline-offset-4 hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}