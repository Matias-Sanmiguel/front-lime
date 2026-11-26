import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '@/auth/AuthContext.jsx'
import { authLogout } from '@/auth/actions'
import { apiFetch } from '@/api/client'
import { fetchInquiries } from '@/store/inquiriesSlice'
import { FavoritesCounter } from '@/components/favorites/FavoritesCounter'
import { CartCounter } from '@/components/cart/CartCounter'
import { InquiriesCounter } from './InquiriesCounter'
import { Brand } from './Brand'
import { ThemeToggle } from './ThemeToggle'

const navLinkClassName = ({ isActive }) =>
  `inline-flex min-h-10 items-center rounded-full px-2 text-xs font-medium transition-colors sm:px-3 sm:text-[13px] ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (isAuthenticated && user?.role === 'AGENCY') {
      dispatch(fetchInquiries({ unreadOnly: true, size: 1 }))
    }
  }, [dispatch, isAuthenticated, user?.role])

  function finishSignOut() {
    logout()
    dispatch(authLogout())
    navigate('/')
  }

  async function signOut() {
    setBusy(true)
    setError(null)
    try {
      await apiFetch('/api/v1/auth/logout', { method: 'POST' })
      finishSignOut()
    } catch (err) {
      if (err.status === 401) {
        finishSignOut()
      } else setError('No pudimos cerrar sesión. Intentá nuevamente.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-3 sm:gap-x-4 sm:px-6">
        <NavLink to="/" className="inline-flex min-h-11 items-center" aria-label="Lime, inicio">
          <Brand />
        </NavLink>

        <nav
          aria-label="Navegación principal"
          className="flex flex-wrap items-center gap-1 sm:gap-2"
        >
          <NavLink to="/buscar" className={navLinkClassName}>
            Buscar
          </NavLink>
          <NavLink to="/favoritos" className={navLinkClassName}>
            Favoritos
            <FavoritesCounter />
          </NavLink>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <CartCounter />
              <NavLink
                to={user?.role === 'USER' ? '/panel/perfil' : '/panel'}
                className={navLinkClassName}
              >
                Mi panel
                {user?.role === 'AGENCY' && <InquiriesCounter />}
              </NavLink>
              {user?.role !== 'USER' && (
                <NavLink to="/panel/perfil" className={navLinkClassName}>
                  Perfil
                </NavLink>
              )}
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
            <NavLink
              to="/login"
              className="inline-flex min-h-10 items-center rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:px-4 sm:text-[13px]"
            >
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
