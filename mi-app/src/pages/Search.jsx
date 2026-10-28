import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchPagination } from '@/components/search/SearchPagination'
import { usePropertiesSearch } from '@/hooks/usePropertiesSearch'
import { Button } from '@/components/ui/button'
import { filterLabel } from '@/lib/property-search'
import { X } from 'lucide-react'

export function Search() {
  const { filters, page, applyFilters, goToPage, status, properties, error, pageInfo, retry } =
    usePropertiesSearch()
  const activeFilters = Object.entries(filters).filter(([field]) => field !== 'sort')

  function removeFilter(field) {
    const next = { ...filters }
    delete next[field]
    if (field === 'currency') {
      delete next.minPrice
      delete next.maxPrice
      delete next.sort
    }
    applyFilters(next)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-foreground">Buscar propiedades</h1>

      <SearchFilters key={JSON.stringify(filters)} filters={filters} onSubmit={applyFilters} />

      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map(([field, value]) => (
          <Button
            key={field}
            variant="secondary"
            size="sm"
            onClick={() => removeFilter(field)}
            aria-label={`Quitar ${filterLabel(field, value)}`}
          >
            {filterLabel(field, value)}
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        ))}
        {Object.keys(filters).length > 0 && (
          <Button variant="link" onClick={() => applyFilters({})}>
            Limpiar filtros
          </Button>
        )}
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {status === 'loading'
          ? 'Buscando propiedades…'
          : pageInfo
            ? `${pageInfo.totalElements} ${pageInfo.totalElements === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
            : ''}
      </p>

      <PropertyGrid status={status} properties={properties} error={error} />
      {status === 'error' && (
        <Button variant="secondary" className="self-center" onClick={retry}>
          Reintentar búsqueda
        </Button>
      )}
      {status === 'empty' && (
        <Button
          variant="secondary"
          className="self-center"
          onClick={() => (page > 0 ? goToPage(0) : applyFilters({}))}
        >
          {page > 0 ? 'Volver a la primera página' : 'Ver todas las propiedades'}
        </Button>
      )}

      {status === 'success' && (
        <SearchPagination page={page} totalPages={pageInfo?.totalPages} onPageChange={goToPage} />
      )}
    </div>
  )
}
