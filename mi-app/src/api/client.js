import { ApiError } from './errors.js'
import { mockFetch } from './mock.js'
export { ApiError }

// El modo estático es el predeterminado para TPO 3. La UI usa el mismo contrato
// en ambos modos; VITE_USE_MOCK=false habilita el transporte HTTP real.
export async function apiFetch(path, { method = 'GET', body } = {}) {
  if (import.meta.env?.VITE_USE_MOCK !== 'false') return mockFetch(path, { method, body })
  let token
  try {
    token = JSON.parse(sessionStorage.getItem('lime.session'))?.token
  } catch {
    /* sin sesión */
  }
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const multipart = body instanceof FormData
  if (body != null && !multipart) headers['Content-Type'] = 'application/json'
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}${path}`, {
    method,
    headers,
    body: body == null ? undefined : multipart ? body : JSON.stringify(body),
  })
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
    throw new ApiError(response.status, problem.detail || 'No pudimos completar la operación')
  }
  return response.status === 204 ? null : response.json()
}
