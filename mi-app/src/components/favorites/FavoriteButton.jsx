import { Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsFavorite, toggleFavorite } from '@/store/favoritesSlice'
import { cn } from '@/lib/utils'

export function FavoriteButton({ property, className = '' }) {
  const dispatch = useDispatch()
  const isFavorite = useSelector(selectIsFavorite(property.id))

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleFavorite(property))}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface text-foreground transition-colors hover:bg-background',
        className,
      )}
    >
      <Heart
        className={cn(
          'h-[18px] w-[18px]',
          isFavorite ? 'fill-foreground text-foreground' : 'text-foreground',
        )}
        aria-hidden="true"
      />
    </button>
  )
}
