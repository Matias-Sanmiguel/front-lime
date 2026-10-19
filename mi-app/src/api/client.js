import { clearSession, getToken } from '../auth/AuthContext.jsx'

const BASE_URL = import.meta.env.VITE_API_URL

// Espeja el Problem Details (RFC 9457) que devuelve el backend: siempre
// exponemos `status` y `detail` para que la UI pueda mostrar el mensaje real
// en vez de un error genérico.
export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = getToken()
  // Con FormData (subida de fotos) el navegador arma el Content-Type multipart
  // con su boundary; si lo forzamos a JSON el backend no encuentra el archivo.
  const isFormData = body instanceof FormData
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let payload = body
  if (body !== undefined && !isFormData) {
    payload = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: payload,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  if (!response.ok) {
    let detail = response.statusText
    try {
      const data = await response.json()
      detail = data.detail ?? detail
    } catch {
      // el body no era JSON (ej. el servidor ni respondió con un body); nos
      // quedamos con el statusText.
    }

    if (response.status === 401) {
      clearSession()
    }

    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) {
    return null
  }
  return response.json()
}
