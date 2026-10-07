export function formatPrice(price, currency) {
  if (price == null) return null
  const amount = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(price)
  return currency ? `${currency} ${amount}` : amount
}

export function formatArea(value) {
  if (value == null) return null
  return `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)} m²`
}
