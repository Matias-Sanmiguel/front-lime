// Enums reales del backend (back-lime: PropertyType.java / OperationType.java).
// No agregar valores que el backend no exponga.

export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Departamento' },
  { value: 'HOUSE', label: 'Casa' },
  { value: 'LAND', label: 'Terreno' },
  { value: 'COMMERCIAL', label: 'Comercial' },
  { value: 'OTHER', label: 'Otro' },
]

export const OPERATION_TYPES = [
  { value: 'SALE', label: 'Venta' },
  { value: 'RENT', label: 'Alquiler' },
  { value: 'TEMPORARY_RENT', label: 'Alquiler temporario' },
]

const TYPE_LABELS = Object.fromEntries(PROPERTY_TYPES.map((t) => [t.value, t.label]))
const OPERATION_LABELS = Object.fromEntries(OPERATION_TYPES.map((o) => [o.value, o.label]))

export function propertyTypeLabel(value) {
  return TYPE_LABELS[value] ?? value
}

export function operationTypeLabel(value) {
  return OPERATION_LABELS[value] ?? value
}
