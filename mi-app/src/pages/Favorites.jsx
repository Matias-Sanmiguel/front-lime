import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart } from 'lucide-react'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { clearFavorites, selectFavorites } from '@/store/favoritesSlice'
import { Button } from '@/components/ui/button'

export function Favorites() {
  const favorites = useSelector(selectFavorites)
  const dispatch = useDispatch()

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Mis favoritos</h1>
        {favorites.length > 0 && (
          <Button type="button" onClick={() => dispatch(clearFavorites())} variant="secondary">
            Vaciar favoritos
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-lg bg-surface px-6 py-16 text-center">
          <Heart
            className="h-10 w-10 text-muted-foreground"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <h2 className="text-2xl">Un lugar para tus próximos lugares.</h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Todavía no guardaste propiedades. Tocá el corazón de un aviso para encontrarlo acá.
          </p>
          <Link
            to="/buscar"
            className="mt-2 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Buscar propiedades
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  )
}
