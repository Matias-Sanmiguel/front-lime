import { apiFetch } from './client'

// Carrito del usuario: propiedades que quiere consultar o visitar, guardadas en
// la base. apiFetch agrega el token de la sesión; el modo mock usa el mismo contrato.

export function getCartItems() {
  return apiFetch('/api/v1/me/cart/items')
}

export function addCartItem(propertyId) {
  return apiFetch('/api/v1/me/cart/items', { method: 'POST', body: { propertyId } })
}

export function deleteCartItem(id) {
  return apiFetch(`/api/v1/me/cart/items/${id}`, { method: 'DELETE' })
}
