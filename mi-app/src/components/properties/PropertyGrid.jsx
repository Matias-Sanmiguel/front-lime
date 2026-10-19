import { SearchX, TriangleAlert } from 'lucide-react'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyCardSkeleton } from '@/components/properties/PropertyCardSkeleton'

function StateMessage({ icon: Icon, title, description }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

export function PropertyGrid({ status, properties = [], error, skeletonCount = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {status === 'loading' &&
        Array.from({ length: skeletonCount }).map((_, i) => <PropertyCardSkeleton key={i} />)}

      {status === 'error' && (
        <StateMessage
          icon={TriangleAlert}
          title="No se pudieron cargar las propiedades"
          description={error ?? 'Intentá nuevamente en unos minutos.'}
        />
      )}

      {status !== 'loading' && status !== 'error' && properties.length === 0 && (
        <StateMessage
          icon={SearchX}
          title="No encontramos propiedades"
          description="Probá ajustar los filtros de búsqueda."
        />
      )}

      {status !== 'loading' &&
        status !== 'error' &&
        properties.map((property) => <PropertyCard key={property.id} property={property} />)}
    </div>
  )
}
