import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { InquiryForm } from '@/components/InquiryForm'
import { apiFetch, ApiError } from '@/api/client'
import { formatPrice, formatArea } from '@/lib/format'
import { getPropertyImages, imageUrl } from '@/api/properties.js'
import { operationTypeLabel, propertyTypeLabel } from '@/lib/property-enums'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'

interface PropertyImage {
  id: number
  url: string
}

// Misma forma que el DTO de propiedad del backend.
interface Property {
  id: number
  title: string
  description: string
  type: string
  operation: string
  price: number
  currency: string
  address: string
  city: string
  province: string
  bedrooms: number | null
  bathrooms: number | null
  coveredArea: number | null
  totalArea: number
  status: string
  images: PropertyImage[]
}

function PropertyGallery({ images }: { images: PropertyImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-gray-200 text-gray-500 sm:h-96">
        Sin fotos
      </div>
    )
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-96">
      <img
        src={imageUrl(images[currentIndex])}
        alt={`Foto ${currentIndex + 1}`}
        className="h-full w-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reinicia la carga al navegar a otro ID.
    setLoading(true)
    setError(null)
    apiFetch(`/api/v1/properties/${id}`)
      .then(async (data: Property) => {
        const images = await getPropertyImages(id)
        if (cancelled) return
        setProperty({ ...data, images })
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError && err.status === 404 ? '404' : 'error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return <div className="p-12 text-center text-xl text-gray-500">Buscando propiedad...</div>
  }

  if (error === 'error') return <div role="alert" className="p-12 text-center">No pudimos cargar el aviso. Intentá nuevamente.</div>

  if (error === '404' || !property) {
    return (
      <div className="p-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">404 - Propiedad no encontrada</h1>
        <p className="mb-6 text-gray-600">El aviso que buscás no existe o ya no está publicado.</p>
        <Link to="/" className="rounded bg-primary px-6 py-2 text-white hover:opacity-90">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-4 md:grid-cols-3 md:p-8">
      {/* Izquierda: galería y descripción */}
      <div className="space-y-6 md:col-span-2">
        <PropertyGallery key={property.id} images={property.images} />

        <div>
         <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold sm:text-3xl">{property.title}</h1>
          <FavoriteButton property={property} className={undefined} />
          </div>
          <p className="mb-4 text-gray-500">
            {property.address}, {property.city}, {property.province}
          </p>

          <div className="mb-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-border bg-accent/20 px-3 py-1 text-sm font-medium text-accent-ink">
              {operationTypeLabel(property.operation)}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {propertyTypeLabel(property.type)}
            </span>
            {property.bedrooms != null && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {property.bedrooms} {property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}
              </span>
            )}
            {property.coveredArea != null && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {formatArea(property.coveredArea)} cubiertos
              </span>
            )}
          </div>

          <h2 className="mb-3 text-xl font-bold">Descripción</h2>
          <p className="whitespace-pre-line leading-relaxed text-gray-700">{property.description}</p>
        </div>
      </div>

      {/* Derecha: precio y consulta */}
      <div className="md:col-span-1">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:sticky md:top-24">
          <p className="mb-2 text-3xl font-bold sm:text-4xl">
            {formatPrice(property.price, property.currency)}
          </p>
          <InquiryForm propertyId={property.id} />
        </div>
      </div>
    </div>
  )
}