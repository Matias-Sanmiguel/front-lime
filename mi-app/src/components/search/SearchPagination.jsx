import { Pagination, PaginationItem, PaginationNav } from '@/components/ui/pagination'

// `page` es 0-based (igual que PageResponse del backend); se muestra 1-based.
function visiblePages(current, total) {
  const pages = new Set([0, total - 1, current - 1, current, current + 1])
  return [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)
}

export function SearchPagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  const pages = visiblePages(page, totalPages)

  return (
    <Pagination>
      <PaginationNav direction="prev" disabled={page === 0} onClick={() => onPageChange(page - 1)} />
      {pages.map((p, i) => {
        const prev = pages[i - 1]
        const showEllipsis = prev != null && p - prev > 1
        return (
          <span key={p} className="flex items-center">
            {showEllipsis && <span className="px-1 text-sm text-muted-foreground">…</span>}
            <PaginationItem active={p === page} onClick={() => onPageChange(p)}>
              {p + 1}
            </PaginationItem>
          </span>
        )
      })}
      <PaginationNav
        direction="next"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      />
    </Pagination>
  )
}
