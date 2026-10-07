import { cn } from '@/lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-sm border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/50 focus-visible:outline-none focus-visible:border-accent-ink focus-visible:ring-1 focus-visible:ring-accent-ink',
        className,
      )}
      {...props}
    />
  )
}
