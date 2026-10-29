import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { X } from 'lucide-react'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { clearFavorites, removeFavorite, selectFavorites } from '@/store/favoritesSlice'

export function Favorites() {
  const favorites = useSelector(selectFavorites)
  const dispatch = useDispatch()

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Mis favoritos</h1>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearFavorites())}
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-background"
          >
            Vaciar favoritos
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-muted-foreground">
          Todavía no guardaste propiedades.{' '}
          <Link to="/buscar" className="text-accent-ink underline">
            Buscar propiedades
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard property={property} />
              <button
                type="button"
                onClick={() => dispatch(removeFavorite(property.id))}
                aria-label={`Quitar ${property.title} de favoritos`}
                className="absolute bottom-1 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white"
              >
                <X className="h-5 w-5 text-danger" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}