import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'lime.session'
const AuthContext = createContext(null)

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStoredSession(session) {
  try {
    if (session) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // sessionStorage puede no estar disponible (modo privado, etc.); la sesión
    // simplemente no persiste entre recargas en ese caso.
  }
}

// Estado y accesores fuera de React: el cliente de API (api/client.js) necesita
// leer el token y poder forzar un logout en un 401 sin ser parte del árbol de
// componentes. AuthProvider se suscribe a los mismos cambios para re-renderizar.
let currentSession = readStoredSession()
const listeners = new Set()

function setSession(session) {
  currentSession = session
  writeStoredSession(session)
  listeners.forEach((listener) => listener(session))
}

export function getToken() {
  return currentSession?.token ?? null
}

export function clearSession() {
  setSession(null)
}

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(currentSession)

  useEffect(() => {
    listeners.add(setSessionState)
    return () => listeners.delete(setSessionState)
  }, [])

  const login = useCallback((token, user) => {
    setSession({ token, user })
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [])

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
