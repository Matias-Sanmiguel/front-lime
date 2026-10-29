import { Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsFavorite, toggleFavorite } from '@/store/favoritesSlice'
import { cn } from '@/lib/utils'

export function FavoriteButton({ property, className }) {
  const dispatch = useDispatch()
  const isFavorite = useSelector(selectIsFavorite(property.id))

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleFavorite(property))}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white',
        className,
      )}
    >
      <Heart
        className={cn('h-5 w-5', isFavorite ? 'fill-danger text-danger' : 'text-muted-foreground')}
        aria-hidden="true"
      />
    </button>
  )
}