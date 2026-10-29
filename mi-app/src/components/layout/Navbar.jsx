import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/auth/AuthContext.jsx'
import { apiFetch } from '@/api/client'
import { FavoritesCounter } from '@/components/favorites/FavoritesCounter'

function LimeMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/20">
      <svg
        viewBox="0 0 64 64"
        className="h-5 w-5 text-accent-ink"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
        <rect x="27" y="8" width="10" height="14" rx="2" />
        <rect x="29" y="29" width="6" height="6" />
      </svg>
    </span>
  )
}

const navLinkClassName = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  async function signOut() {
    setBusy(true)
    setError(null)
    try {
      await apiFetch('/api/v1/auth/logout', { method: 'POST' })
      logout()
      navigate('/')
    } catch (err) {
      if (err.status === 401) {
        logout()
        navigate('/')
      } else setError('No pudimos cerrar sesión. Intentá nuevamente.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2.5">
          <LimeMark />
          <span className="font-display text-xl font-semibold text-foreground">Lime</span>
        </NavLink>

        <nav className="flex flex-wrap items-center gap-3 sm:gap-6">
          <NavLink to="/" end className={navLinkClassName}>
            Home
          </NavLink>
          <NavLink to="/buscar" className={navLinkClassName}>
            Buscar
          </NavLink>
          <NavLink to="/favoritos" className={navLinkClassName}>
            Favoritos
            <FavoritesCounter />
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to={user?.role === 'USER' ? '/panel/perfil' : '/panel'}
                className={navLinkClassName}
              >
                Mi panel
              </NavLink>
              <NavLink to="/panel/perfil" className={navLinkClassName}>
                Perfil
              </NavLink>
              <button
                type="button"
                onClick={signOut}
                disabled={busy}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {busy ? 'Saliendo…' : 'Salir'}
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLinkClassName}>
              Ingresar
            </NavLink>
          )}
        </nav>
      </div>
      {error && (
        <p role="alert" className="px-4 pb-2 text-sm text-danger">
          {error}
        </p>
      )}
    </header>
  )
}