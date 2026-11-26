import { useEffect } from 'react'
import { apiFetch } from '@/api/client'
import { useAuth } from './AuthContext.jsx'

export function SessionBootstrap() {
  const { login, logout } = useAuth()

  useEffect(() => {
    if (import.meta.env?.VITE_USE_MOCK !== 'false') return
    apiFetch('/api/v1/me')
      .then(login)
      .catch(() => logout())
  }, [login, logout])

  return null
}