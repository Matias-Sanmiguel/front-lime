import { useSelector } from 'react-redux'
import { selectCartCount } from '@/store/cartSlice'

// Mismo estilo que FavoritesCounter (bg-accent es el lima de DESIGN.md).
export function CartCounter() {
  const count = useSelector(selectCartCount)
  if (count === 0) return null

  return (
    <span className="inline-flex min-h-10 items-center px-2 text-xs font-medium text-muted-foreground sm:px-3 sm:text-[13px]">
      Carrito
      <span
        aria-label={`${count} ${count === 1 ? 'propiedad' : 'propiedades'} en tu carrito`}
        className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-foreground"
      >
        {count}
      </span>
    </span>
  )
}
