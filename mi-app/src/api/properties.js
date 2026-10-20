import { API_URL, apiFetch } from './client'

export async function getProperties(params = {}) {
  const query = new URLSearchParams(params).toString()
  const page = await apiFetch(`/api/v1/properties${query ? `?${query}` : ''}`)
  // Modelo de vista: las fotos se leen de su endpoint; no alteran PropertyResponse.
  return { ...page, content: await Promise.all(page.content.map(async property => ({
    ...property, images: await getPropertyImages(property.id),
  }))) }
}

export function getProperty(id) {
  return apiFetch(`/api/v1/properties/${id}`)
}

// Crea el aviso en DRAFT; el dueño es el usuario del token.
export function createProperty(data) {
  return apiFetch('/api/v1/properties', { method: 'POST', body: data })
}

// PATCH parcial: el backend ignora los campos que no vienen (o vienen en null).
export function updateProperty(id, changes) {
  return apiFetch(`/api/v1/properties/${id}`, { method: 'PATCH', body: changes })
}

export function publishProperty(id) {
  return apiFetch(`/api/v1/properties/${id}/publish`, { method: 'POST' })
}

export function pauseProperty(id) {
  return apiFetch(`/api/v1/properties/${id}/pause`, { method: 'POST' })
}

export function getPropertyImages(id) {
  return apiFetch(`/api/v1/properties/${id}/images`)
}

export function addPropertyImage(id, file) {
  return apiFetch(`/api/v1/properties/${id}/images`, { method: 'POST', body: imageForm(file) })
}

export function replacePropertyImage(id, imageId, file) {
  return apiFetch(`/api/v1/properties/${id}/images/${imageId}`, {
    method: 'PATCH',
    body: imageForm(file),
  })
}

export function deletePropertyImage(id, imageId) {
  return apiFetch(`/api/v1/properties/${id}/images/${imageId}`, { method: 'DELETE' })
}

// El backend devuelve la ruta relativa (/uploads/...); el <img> necesita la URL completa.
export function imageUrl(image) {
  return /^(https?:|data:|blob:)/.test(image.url) ? image.url : `${API_URL}${image.url}`
}

function imageForm(file) {
  const form = new FormData()
  form.append('file', file)
  return form
}
