import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { OPERATION_TYPES } from '@/lib/property-enums'

export function Home() {
  const navigate = useNavigate()

  function handleQuickSearch(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()
    for (const key of ['city', 'operation']) {
      const value = formData.get(key)
      if (value) params.set(key, value)
    }
    navigate(`/buscar${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-pill bg-accent/15 px-3 py-1 text-xs font-medium text-accent-ink">
              Propiedades en toda Argentina
            </span>
            <h1 className="mt-4 font-display text-[2.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground sm:text-[3.25rem]">
              Encontrá tu próximo lugar
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              Buscá avisos publicados por ciudad y tipo de operación, con filtros simples y
              resultados claros.
            </p>
          </div>

          <form
            onSubmit={handleQuickSearch}
            className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(29,29,31,0.06)] sm:flex-row sm:p-3"
          >
            <Input name="city" placeholder="¿En qué ciudad buscás?" className="sm:flex-1" />
            <Select name="operation" className="sm:w-48">
              <option value="">Operación</option>
              {OPERATION_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Button type="submit" className="sm:w-auto">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-4 font-display text-2xl font-semibold text-foreground">Propiedades destacadas</h2>
        <PropertyGrid status="empty" properties={[]} />
      </section>
    </div>
  )
}
