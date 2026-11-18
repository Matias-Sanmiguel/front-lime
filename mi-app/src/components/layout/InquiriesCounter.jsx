import { useSelector } from 'react-redux'
import { selectUnreadCount } from '@/store/inquiriesSlice'

export function InquiriesCounter() {
  const unreadCount = useSelector(selectUnreadCount)
  if (unreadCount === 0) return null

  return (
    <span
      aria-label={`${unreadCount} consultas sin leer`}
      className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-lime px-1.5 text-xs font-semibold text-foreground"
    >
      {unreadCount}
    </span>
  )
}
