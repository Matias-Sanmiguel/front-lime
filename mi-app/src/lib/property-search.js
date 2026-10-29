import { OPERATION_TYPES, PROPERTY_TYPES } from './property-enums.js'

export const SEARCH_FIELDS = [
  'city',
  'province',
  'operation',
  'type',
  'currency',
  'minPrice',
  'maxPrice',
  'minBedrooms',
  'minBathrooms',
  'sort',
]
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
]
export const FILTER_LABELS = {
  city: 'Ciudad',
  province: 'Provincia',
  operation: 'Operación',
  type: 'Tipo',
  currency: 'Moneda',
  minPrice: 'Precio mínimo',
  maxPrice: 'Precio máximo',
  minBedrooms: 'Dormitorios mínimos',
  minBathrooms: 'Baños mínimos',
}

export function readSearchFilters(params) {
  return Object.fromEntries(
    SEARCH_FIELDS.flatMap((field) => {
      const value = params.get(field)?.trim()
      return value && !(field === 'sort' && value === 'newest') ? [[field, value]] : []
    }),
  )
}

export function searchParamsFor(filters, page = 0) {
  const params = new URLSearchParams()
  for (const field of SEARCH_FIELDS) {
    const value = filters[field]
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== '' &&
      !(field === 'sort' && value === 'newest')
    )
      params.set(field, String(value).trim())
  }
  if (page > 0) params.set('page', String(page))
  return params
}

export function validateSearch(filters) {
  const options = { operation: OPERATION_TYPES, type: PROPERTY_TYPES, sort: SORT_OPTIONS }
  for (const [field, values] of Object.entries(options)) {
    if (filters[field] && !values.some((option) => option.value === filters[field]))
      return 'Revisá el tipo de propiedad, la operación y el orden seleccionados.'
  }
  if (filters.currency && !['ARS', 'USD'].includes(filters.currency))
    return 'Elegí pesos (ARS) o dólares (USD).'
  const hasPrice = ['minPrice', 'maxPrice'].some(
    (field) => filters[field] != null && filters[field] !== '',
  )
  if ((hasPrice || filters.sort?.startsWith('price_')) && !filters.currency)
    return 'Elegí una moneda para filtrar u ordenar por precio.'
  for (const field of ['minPrice', 'maxPrice', 'minBedrooms', 'minBathrooms']) {
    if (filters[field] == null || filters[field] === '') continue
    const value = Number(filters[field])
    if (
      !Number.isFinite(value) ||
      value < 0 ||
      (['minBedrooms', 'minBathrooms'].includes(field) && !Number.isInteger(value))
    )
      return 'Ingresá precios positivos o cero y cantidades enteras de dormitorios y baños.'
  }
  if (
    filters.minPrice != null &&
    filters.maxPrice != null &&
    filters.minPrice !== '' &&
    filters.maxPrice !== '' &&
    Number(filters.minPrice) > Number(filters.maxPrice)
  )
    return 'El precio mínimo no puede superar al máximo.'
  return null
}

export function filterLabel(field, value) {
  const options = field === 'operation' ? OPERATION_TYPES : field === 'type' ? PROPERTY_TYPES : []
  return `${FILTER_LABELS[field]}: ${options.find((option) => option.value === value)?.label ?? value}`
}
