import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { getProperties } from '@/api/properties'
import { OPERATION_TYPES, PROPERTY_TYPES } from '@/lib/property-enums'
import { readSearchFilters, searchParamsFor } from '@/lib/property-search'

export function Home() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [properties, setProperties] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getProperties({ size: 4 })
      .then((data) => {
        if (cancelled) return
        setProperties(data.content)
        setStatus(data.content.length === 0 ? 'empty' : 'success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.detail ?? err.message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  function handleQuickSearch(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = searchParamsFor(readSearchFilters(formData))
    navigate(`/buscar${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-2 sm:pt-14">
          <div className="max-w-2xl">
            <h1 className="text-balance font-display text-[2.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground sm:text-[3.25rem]">
              Encontrá tu próximo lugar
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              Casas, departamentos y más. Elegí dónde querés vivir y compará las opciones.
            </p>
          </div>

          <form
            onSubmit={handleQuickSearch}
            className="grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 sm:items-end sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_auto]"
          >
            <label className="grid gap-1.5 text-sm font-medium">
              Operación
              <Select name="operation">
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
              <Input name="city" placeholder="¿En qué ciudad buscás?" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Tipo de propiedad
              <Select name="type">
                <option value="">Todos los tipos</option>
                {PROPERTY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
            <Button type="submit" className="sm:w-auto">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Explorá propiedades
          </h2>
          <Link
            to="/buscar"
            className="inline-flex min-h-11 items-center text-sm font-medium text-accent-ink underline underline-offset-4"
          >
            Ver todas las propiedades
          </Link>
        </div>
        <PropertyGrid status={status} properties={properties} error={error} skeletonCount={4} />
      </section>
    </div>
  )
}
