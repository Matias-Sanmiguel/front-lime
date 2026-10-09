import { apiFetch } from './client'

export function getProperties(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/api/v1/properties${query ? `?${query}` : ''}`)
}

export function getProperty(id) {
  return apiFetch(`/api/v1/properties/${id}`)
}
