// Opciones, etiquetas y conversiones del formulario de aviso. Los valores de los
// enums son los del backend (PropertyType, OperationType, PropertyStatus).

export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Departamento' },
  { value: 'HOUSE', label: 'Casa' },
  { value: 'LAND', label: 'Terreno' },
  { value: 'COMMERCIAL', label: 'Local comercial' },
  { value: 'OTHER', label: 'Otro' },
]

export const OPERATIONS = [
  { value: 'SALE', label: 'Venta' },
  { value: 'RENT', label: 'Alquiler' },
  { value: 'TEMPORARY_RENT', label: 'Alquiler temporario' },
]

export const CURRENCIES = [
  { value: 'ARS', label: 'ARS — Pesos' },
  { value: 'USD', label: 'USD — Dólares' },
]

export const STATUS_LABELS = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  PAUSED: 'Pausado',
}

export const STATUS_HELP = {
  DRAFT: 'Solo vos lo ves. Publicalo cuando esté listo para que aparezca en el listado.',
  PUBLISHED: 'Aparece en el listado público y puede recibir consultas.',
  PAUSED: 'No aparece en el listado público. Podés volver a publicarlo cuando quieras.',
}

export const FIELD_LABELS = {
  title: 'Título',
  description: 'Descripción',
  type: 'Tipo',
  operation: 'Operación',
  price: 'Precio',
  currency: 'Moneda',
  address: 'Dirección',
  city: 'Ciudad',
  province: 'Provincia',
  bedrooms: 'Dormitorios',
  bathrooms: 'Baños',
  coveredArea: 'Superficie cubierta (m²)',
  totalArea: 'Superficie total (m²)',
}

// Lo mismo que exige Property.requireComplete() en el backend para publicar.
export const REQUIRED_TO_PUBLISH = ['title', 'price', 'currency', 'city', 'type', 'operation']

const FIELD_NAMES = Object.keys(FIELD_LABELS)
const TEXT_FIELDS = ['title', 'description', 'address', 'city', 'province']
const NUMBER_FIELDS = ['price', 'bedrooms', 'bathrooms', 'coveredArea', 'totalArea']

export const EMPTY_VALUES = Object.fromEntries(FIELD_NAMES.map((name) => [name, '']))

// Los inputs trabajan con strings: un null del backend se muestra como campo vacío.
export function toFormValues(property) {
  return Object.fromEntries(
    FIELD_NAMES.map((name) => [name, property[name] == null ? '' : String(property[name])]),
  )
}

// Lleva un valor del form o del backend a lo que viaja en el JSON: texto sin
// espacios en los bordes, números como number y vacío como null (salvo textos).
function normalize(name, value) {
  const text = value == null ? '' : String(value).trim()
  if (TEXT_FIELDS.includes(name)) {
    return text
  }
  if (text === '') {
    return null
  }
  return NUMBER_FIELDS.includes(name) ? Number(text) : text
}

// Campos del form que difieren de `saved` (el aviso como está en el backend).
// Un texto que se vació viaja como "". Un número o un select vacío no se manda:
// el PATCH toma null como "no tocar" (por eso isRequiredField no deja vaciarlos).
export function changedFields(values, saved) {
  const changes = {}
  for (const name of FIELD_NAMES) {
    const next = normalize(name, values[name])
    if (next !== null && next !== normalize(name, saved[name])) {
      changes[name] = next
    }
  }
  return changes
}

// Para el alta: todo lo que se completó, que es la diferencia contra un aviso vacío.
export function filledFields(values) {
  return changedFields(values, {})
}

// A diferencia de changedFields, cuenta también un número o select vaciado: no
// viaja en el PATCH, pero el form tiene que avisar (required) en vez de ignorarlo.
export function hasUnsavedChanges(values, saved) {
  return FIELD_NAMES.some((name) => normalize(name, values[name]) !== normalize(name, saved[name]))
}

// Sirve tanto para un aviso del backend como para los valores del form.
export function missingToPublish(source) {
  return REQUIRED_TO_PUBLISH.filter((name) => {
    const value = normalize(name, source[name])
    return value === null || value === ''
  })
}

// Al editar, el form no deja vaciar:
// - números y selects que ya tienen valor, porque vaciarlos no tendría efecto;
// - lo obligatorio para publicar mientras el aviso está publicado, para que no
//   quede un aviso visible sin título o sin precio.
export function isRequiredField(name, saved) {
  if (!TEXT_FIELDS.includes(name) && saved[name] != null) {
    return true
  }
  return saved.status === 'PUBLISHED' && REQUIRED_TO_PUBLISH.includes(name)
}
