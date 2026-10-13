import { apiFetch } from './client'

export function createInquiry(propertyId, { name, email, phone, message }) {
  return apiFetch(`/api/v1/properties/${propertyId}/inquiries`, {
    method: 'POST',
    body: { name, email, phone, message },
  })
}