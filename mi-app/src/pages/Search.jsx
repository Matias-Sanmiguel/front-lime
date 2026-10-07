import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchPagination } from '@/components/search/SearchPagination'
import { usePropertiesSearch } from '@/hooks/usePropertiesSearch'

export function Search() {
  const { filters, page, applyFilters, goToPage, status, properties, error, pageInfo } = usePropertiesSearch()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-foreground">Buscar propiedades</h1>

      <SearchFilters filters={filters} onSubmit={applyFilters} />

      <PropertyGrid status={status} properties={properties} error={error} />

      <SearchPagination page={page} totalPages={pageInfo?.totalPages} onPageChange={goToPage} />
    </div>
  )
}
