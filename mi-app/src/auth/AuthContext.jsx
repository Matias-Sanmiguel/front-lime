import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'lime.session'
const AuthContext = createContext(null)

// El token vive en una cookie HttpOnly que maneja el navegador; JavaScript no
// puede leerla. Acá solo se recuerda el perfil del usuario (nombre, rol) para
// mostrar la UI sin parpadeos. No es una credencial.
function readStoredSession() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    return parsed?.user ? { user: parsed.user } : null
  } catch {
    return null
  }
}

function writeStoredSession(session) {
  try {
    if (session) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user: session.user }))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // sin sessionStorage la UI simplemente no recuerda el perfil entre recargas
  }
}

let currentSession = readStoredSession()
const listeners = new Set()

function setSession(session) {
  currentSession = session
  writeStoredSession(session)
  listeners.forEach((listener) => listener(session))
}

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(currentSession)

  useEffect(() => {
    listeners.add(setSessionState)
    return () => listeners.delete(setSessionState)
  }, [])

  const login = useCallback((user) => {
    setSession({ user })
  }, [])

  const logout = useCallback(() => {
    setSession(null)
  }, [])

  const value = {
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.user),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- Hook compartido del mismo contexto.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}