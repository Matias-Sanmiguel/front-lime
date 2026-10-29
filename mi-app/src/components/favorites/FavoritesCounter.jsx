import { useSelector } from 'react-redux'
import { selectFavoritesCount } from '@/store/favoritesSlice'

export function FavoritesCounter() {
  const count = useSelector(selectFavoritesCount)
  if (count === 0) return null

  return (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-foreground">
      {count}
    </span>
  )
}