import { apiFetch } from './client'

export function getMe() {
  return apiFetch('/api/v1/me')
}
