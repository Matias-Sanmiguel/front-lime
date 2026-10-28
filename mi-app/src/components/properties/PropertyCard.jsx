import { imageUrl } from '@/api/properties.js'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BedDouble, Bath, MapPin, Ruler, ImageOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatArea, formatPrice } from '@/lib/format'
import { operationTypeLabel, propertyTypeLabel } from '@/lib/property-enums'

function ImagePlaceholder() {
  return (
    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-t-lg bg-background text-muted-foreground">
      <ImageOff className="h-8 w-8" aria-hidden="true" />
      <span className="text-sm">Foto no disponible</span>
    </div>
  )
}

export function PropertyCard({ property }) {
  const route = useLocation()
  const [failedCover, setFailedCover] = useState(null)
  const {
    id,
    title,
    price,
    currency,
    city,
    province,
    type,
    operation,
    bedrooms,
    bathrooms,
    coveredArea,
    totalArea,
    coverImage,
  } = property

  const location = [city, province].filter(Boolean).join(', ')
  const area = formatArea(coveredArea ?? totalArea)
  const cover = coverImage ? imageUrl(coverImage) : null

  return (
    <Link
      to={`/propiedad/${id}`}
      state={{ search: route.pathname === '/buscar' ? `/buscar${route.search}` : '/buscar' }}
      className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Card className="h-full overflow-hidden transition-colors group-hover:border-accent-ink">
        {cover && failedCover !== cover ? (
          <img
            src={cover}
            alt={title}
            loading="lazy"
            onError={() => setFailedCover(cover)}
            className="aspect-[4/3] w-full rounded-t-lg object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
        <CardContent className="flex flex-col gap-2">
          <p className="font-sans text-xl font-semibold tabular-nums text-foreground">
            {formatPrice(price, currency) ?? 'Precio a consultar'}
          </p>

          {location && (
            <p className="flex items-start gap-1 text-sm font-medium text-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {location}
            </p>
          )}

          {(bedrooms != null || bathrooms != null || area) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-1 text-sm tabular-nums text-muted-foreground">
              {bedrooms != null && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" aria-hidden="true" />
                  {bedrooms} dorm.
                </span>
              )}
              {bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" aria-hidden="true" />
                  {bathrooms} {bathrooms === 1 ? 'baño' : 'baños'}
                </span>
              )}
              {area && (
                <span className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" aria-hidden="true" />
                  {area} {coveredArea != null ? 'cubiertos' : 'totales'}
                </span>
              )}
            </div>
          )}
          <h3 className="line-clamp-2 font-sans text-sm font-normal text-muted-foreground">
            {title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            {operation != null && <Badge>{operationTypeLabel(operation)}</Badge>}
            {type != null && <Badge>{propertyTypeLabel(type)}</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
