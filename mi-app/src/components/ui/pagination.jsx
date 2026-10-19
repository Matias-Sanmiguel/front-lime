import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Pagination({ className, ...props }) {
  return (
    <nav
      aria-label="Paginación"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    />
  )
}

export function PaginationItem({ active, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'h-9 min-w-9 rounded-sm px-3 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-border/40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function PaginationNav({ direction, className, ...props }) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Página anterior' : 'Página siguiente'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-sm text-foreground transition-colors hover:bg-border/40 disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
