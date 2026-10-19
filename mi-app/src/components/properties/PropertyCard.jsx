import { Link } from 'react-router-dom'
import { BedDouble, Bath, MapPin, Ruler } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatArea, formatPrice } from '@/lib/format'
import { operationTypeLabel, propertyTypeLabel } from '@/lib/property-enums'

function ImagePlaceholder() {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-t-lg bg-background">
      <svg viewBox="0 0 64 64" className="h-10 w-10 text-border" fill="currentColor" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="26" y="10" width="12" height="16" rx="2" />
        <rect x="28" y="30" width="8" height="8" />
      </svg>
    </div>
  )
}

export function PropertyCard({ property }) {
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
    images,
  } = property

  const location = [city, province].filter(Boolean).join(', ')
  const area = formatArea(coveredArea ?? totalArea)
  const cover = images?.[0]?.url

  return (
    <Link to={`/propiedad/${id}`} className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-[0_1px_2px_rgba(29,29,31,0.06)]">
        {cover ? (
          <img
            src={cover}
            alt={title}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-t-lg object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {operation != null && <Badge>{operationTypeLabel(operation)}</Badge>}
            {type != null && <Badge>{propertyTypeLabel(type)}</Badge>}
          </div>

          <p className="font-display text-lg font-semibold text-foreground">
            {formatPrice(price, currency) ?? 'Precio a consultar'}
          </p>

          <h3 className="line-clamp-2 text-sm font-medium text-foreground">{title}</h3>

          {location && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {location}
            </p>
          )}

          {(bedrooms != null || bathrooms != null || area) && (
            <div className="flex items-center gap-3 border-t border-border pt-2 text-sm text-muted-foreground">
              {bedrooms != null && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" aria-hidden="true" />
                  {bedrooms}
                </span>
              )}
              {bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" aria-hidden="true" />
                  {bathrooms}
                </span>
              )}
              {area && (
                <span className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" aria-hidden="true" />
                  {area}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}