import { ApiError } from './errors.js'
import { mockFetch } from './mock.js'
export { ApiError }

// En el navegador las variables vienen de Vite; los tests de `node --test` no tienen
// import.meta.env y las leen de process.env (ver tests/test.env).
const env = import.meta.env ?? globalThis.process?.env ?? {}

// La app usa la API real de Spring Boot. VITE_USE_MOCK=true vuelve a los JSON de
// public/data (la entrega estática del TPO 3); la UI usa el mismo contrato en ambos modos.
export const USE_MOCK = env.VITE_USE_MOCK === 'true'
// Default: el back levantado con `docker compose up` en back-lime.
export const API_URL = env.VITE_API_URL || 'http://localhost:8080'

export async function apiFetch(path, { method = 'GET', body } = {}) {
  if (USE_MOCK) return mockFetch(path, { method, body })
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
  const response = await fetch(`${API_URL}${path}`, {
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
