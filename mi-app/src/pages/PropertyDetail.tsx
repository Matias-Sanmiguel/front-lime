import { useParams, useLocation, Link } from 'react-router-dom'
import { InquiryForm } from '@/components/InquiryForm'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { PropertyGallery } from '@/components/properties/PropertyGallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatArea } from '@/lib/format'
import { operationTypeLabel, propertyTypeLabel } from '@/lib/property-enums'
import { usePropertyDetail } from '@/hooks/usePropertyDetail'

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const search =
    typeof location.state?.search === 'string' && /^\/buscar(?:\?|$)/.test(location.state.search)
      ? location.state.search
      : '/buscar'
  const { property, loading, error, images, imagesLoading, imagesError, retry, retryImages } =
    usePropertyDetail(id)
  if (loading)
    return (
      <div role="status" className="p-12 text-center text-muted-foreground">
        Cargando aviso…
      </div>
    )
  if (error === 'error')
    return (
      <div className="space-y-4 p-12 text-center">
        <p role="alert">No pudimos cargar el aviso.</p>
        <Button onClick={retry}>Reintentar</Button>
      </div>
    )
  if (!property)
    return (
      <div className="space-y-6 p-12 text-center">
        <h1 className="text-3xl">Propiedad no encontrada</h1>
        <p className="text-muted-foreground">
          El aviso que buscás no existe o ya no está publicado.
        </p>
        <Link
          to={search}
          className="inline-flex rounded-md bg-primary px-6 py-3 text-primary-foreground"
        >
          Buscar otras propiedades
        </Link>
      </div>
    )
  const price = formatPrice(property.price, property.currency) ?? 'Precio a consultar'
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:p-8">
      <header className="mb-6 space-y-3">
        <Link
          to={search}
          className="inline-flex min-h-11 items-center text-sm text-accent-ink underline underline-offset-4"
        >
          Volver a resultados
        </Link>
        <div className="flex flex-wrap gap-2">
          <FavoriteButton property={{ ...property, coverImage: images[0] ?? null }} />
          <Badge className="">{operationTypeLabel(property.operation)}</Badge>
          <Badge className="">{propertyTypeLabel(property.type)}</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl">{property.title}</h1>
        <p className="text-muted-foreground">
          {[property.address, property.city, property.province].filter(Boolean).join(', ')}
        </p>
        <p className="font-sans text-3xl font-semibold tabular-nums">{price}</p>
      </header>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {imagesLoading ? (
            <div
              role="status"
              className="flex h-64 items-center justify-center rounded-lg bg-background text-muted-foreground"
            >
              Cargando fotos…
            </div>
          ) : imagesError ? (
            <div className="space-y-3 rounded-lg border border-border bg-surface p-6">
              <p role="alert">
                No pudimos cargar las fotos. Podés consultar por el aviso igualmente.
              </p>
              <Button onClick={retryImages}>Reintentar fotos</Button>
            </div>
          ) : (
            <PropertyGallery key={property.id} images={images} title={property.title} />
          )}
          <dl className="grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
            {property.bedrooms != null && (
              <div>
                <dt className="text-sm text-muted-foreground">Dormitorios</dt>
                <dd className="font-medium tabular-nums">{property.bedrooms}</dd>
              </div>
            )}
            {property.bathrooms != null && (
              <div>
                <dt className="text-sm text-muted-foreground">Baños</dt>
                <dd className="font-medium tabular-nums">{property.bathrooms}</dd>
              </div>
            )}
            {property.coveredArea != null && (
              <div>
                <dt className="text-sm text-muted-foreground">Superficie cubierta</dt>
                <dd className="font-medium tabular-nums">{formatArea(property.coveredArea)}</dd>
              </div>
            )}
            {property.totalArea != null && (
              <div>
                <dt className="text-sm text-muted-foreground">Superficie total</dt>
                <dd className="font-medium tabular-nums">{formatArea(property.totalArea)}</dd>
              </div>
            )}
          </dl>
          <section aria-labelledby="descripcion">
            <h2 id="descripcion" className="mb-3 text-xl">
              Descripción
            </h2>
            <p className="whitespace-pre-line leading-relaxed">{property.description}</p>
          </section>
        </div>
        <aside className="md:col-span-1">
          <div
            id="consulta"
            tabIndex={-1}
            className="scroll-mt-24 rounded-lg border border-border bg-surface p-6 md:sticky md:top-24"
          >
            <InquiryForm key={property.id} propertyId={property.id} />
          </div>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        <a
          href="#consulta"
          className="flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground"
        >
          Consultar por esta propiedad
        </a>
      </div>
    </div>
  )
}
