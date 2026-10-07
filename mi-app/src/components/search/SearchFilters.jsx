import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { OPERATION_TYPES, PROPERTY_TYPES } from '@/lib/property-enums'

const FIELDS = ['city', 'province', 'type', 'operation', 'minPrice', 'maxPrice', 'minBedrooms', 'minBathrooms']

export function SearchFilters({ filters, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const next = {}
    for (const field of FIELDS) {
      const value = formData.get(field)
      if (value) next[field] = value
    }
    onSubmit(next)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(29,29,31,0.06)] sm:grid-cols-4"
    >
      <Input name="city" placeholder="Ciudad" defaultValue={filters.city ?? ''} className="col-span-2 sm:col-span-1" />
      <Input name="province" placeholder="Provincia" defaultValue={filters.province ?? ''} className="col-span-2 sm:col-span-1" />

      <Select name="operation" defaultValue={filters.operation ?? ''}>
        <option value="">Operación</option>
        {OPERATION_TYPES.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select name="type" defaultValue={filters.type ?? ''}>
        <option value="">Tipo</option>
        {PROPERTY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <Input name="minPrice" type="number" min="0" placeholder="Precio mín." defaultValue={filters.minPrice ?? ''} />
      <Input name="maxPrice" type="number" min="0" placeholder="Precio máx." defaultValue={filters.maxPrice ?? ''} />
      <Input
        name="minBedrooms"
        type="number"
        min="0"
        placeholder="Dormitorios mín."
        defaultValue={filters.minBedrooms ?? ''}
      />
      <Input
        name="minBathrooms"
        type="number"
        min="0"
        placeholder="Baños mín."
        defaultValue={filters.minBathrooms ?? ''}
      />

      <Button type="submit" className="col-span-2 sm:col-span-4">
        Buscar
      </Button>
    </form>
  )
}
