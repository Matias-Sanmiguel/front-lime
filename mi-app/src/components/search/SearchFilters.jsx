import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { OPERATION_TYPES, PROPERTY_TYPES } from '@/lib/property-enums'
import { readSearchFilters, SORT_OPTIONS, validateSearch } from '@/lib/property-search'

export function SearchFilters({ filters, onSubmit }) {
  const [error, setError] = useState(null)
  const advanced = [
    'province',
    'currency',
    'minPrice',
    'maxPrice',
    'minBedrooms',
    'minBathrooms',
    'sort',
  ].some((field) => filters[field])

  function handleSubmit(event) {
    event.preventDefault()
    const next = readSearchFilters(new FormData(event.currentTarget))
    const message = validateSearch(next)
    setError(message)
    if (!message) onSubmit(next)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4 sm:p-5"
      aria-label="Filtros de propiedades"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
        <label className="grid gap-1.5 text-sm font-medium">
          Operación
          <Select name="operation" defaultValue={filters.operation ?? ''}>
            <option value="">Todas las operaciones</option>
            {OPERATION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Ciudad
          <Input
            name="city"
            placeholder="Por ejemplo, La Plata"
            defaultValue={filters.city ?? ''}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Tipo de propiedad
          <Select name="type" defaultValue={filters.type ?? ''}>
            <option value="">Todos los tipos</option>
            {PROPERTY_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit">Buscar</Button>
      </div>
      <details open={advanced || undefined} className="mt-4 border-t border-border pt-3">
        <summary className="w-fit cursor-pointer rounded-sm py-1 text-sm font-medium text-accent-ink">
          Más filtros y orden
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Provincia
            <Input name="province" defaultValue={filters.province ?? ''} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Moneda
            <Select name="currency" defaultValue={filters.currency ?? ''}>
              <option value="">Todas las monedas</option>
              <option value="ARS">Pesos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </Select>
          </label>
          {[
            ['minPrice', 'Precio mínimo'],
            ['maxPrice', 'Precio máximo'],
            ['minBedrooms', 'Dormitorios mínimos'],
            ['minBathrooms', 'Baños mínimos'],
          ].map(([field, label]) => (
            <label key={field} className="grid gap-1.5 text-sm font-medium">
              {label}
              <Input
                name={field}
                type="number"
                min="0"
                step={field.endsWith('Price') ? '0.01' : '1'}
                defaultValue={filters[field] ?? ''}
              />
            </label>
          ))}
          <label className="grid gap-1.5 text-sm font-medium">
            Ordenar por
            <Select name="sort" defaultValue={filters.sort ?? 'newest'}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
          <p className="self-end text-sm text-muted-foreground">
            Para comparar precios, elegí una moneda. Los importes no se convierten.
          </p>
        </div>
        <Button type="submit" variant="secondary" className="mt-4">
          Aplicar filtros
        </Button>
      </details>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  )
}
