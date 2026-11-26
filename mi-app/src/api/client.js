import { ApiError } from './errors.js'
import { mockFetch } from './mock.js'
export { ApiError }

// AuthProvider registra acá cómo cerrar la sesión. Así el cliente no importa React ni el
// contexto de auth (y sigue pudiendo cargarse desde `node --test`).
let onUnauthorized = null
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

// El modo estático es el predeterminado para TPO 3. La UI usa el mismo contrato
// en ambos modos; VITE_USE_MOCK=false habilita el transporte HTTP real.
export async function apiFetch(path, { method = 'GET', body } = {}) {
  if (import.meta.env?.VITE_USE_MOCK !== 'false') return mockFetch(path, { method, body })

  const headers = { 'X-Requested-With': 'XMLHttpRequest' }
  const multipart = body instanceof FormData
  if (body != null && !multipart) headers['Content-Type'] = 'application/json'
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body == null ? undefined : multipart ? body : JSON.stringify(body),
  })
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
        // Un 401 fuera de /auth es una sesión vencida o inválida (la cookie expiró o la
    // revocaron): se cierra para que la UI pida iniciar sesión. Un 401 de login o
    // registro (credenciales incorrectas) no la toca.
    if (response.status === 401 && !path.startsWith('/api/v1/auth/')) onUnauthorized?.()
    throw new ApiError(response.status, problem.detail || 'No pudimos completar la operación')
  }
  return response.status === 204 ? null : response.json()
}
