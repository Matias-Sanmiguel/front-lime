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
    getProperties({ size: 3 })
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
    <div className="pb-16">
      <section className="bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
          <div className="max-w-3xl text-center">
            <h1 className="text-balance font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-foreground">
              Encontrá tu próximo lugar
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Casas, departamentos y más. Elegí dónde querés vivir y compará las opciones.
            </p>
          </div>

          <form
            onSubmit={handleQuickSearch}
            className="grid w-full grid-cols-2 items-end gap-4 rounded-lg bg-background p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <label className="col-span-2 grid min-w-0 gap-1.5 text-sm font-medium lg:col-span-1">
              Ciudad
              <Input name="city" placeholder="¿En qué ciudad buscás?" />
            </label>
            <label className="grid min-w-0 gap-1.5 text-sm font-medium">
              Operación
              <Select name="operation">
                <option value="">Todas</option>
                {OPERATION_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid min-w-0 gap-1.5 text-sm font-medium">
              Tipo de propiedad
              <Select name="type">
                <option value="">Todos</option>
                {PROPERTY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
            <Button type="submit" className="col-span-2 lg:col-span-1">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pt-10 sm:px-6 sm:pt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Explorá propiedades
          </h2>
          <Link
            to="/buscar"
            className="inline-flex min-h-11 items-center text-sm font-medium text-accent-ink underline underline-offset-4"
          >
            Ver todas las propiedades
          </Link>
        </div>
        <PropertyGrid status={status} properties={properties} error={error} skeletonCount={3} />
      </section>
    </div>
  )
}
