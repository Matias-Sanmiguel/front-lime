import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProperties } from '@/api/properties'
import { readSearchFilters, searchParamsFor, validateSearch } from '@/lib/property-search'

const PAGE_SIZE = 8

// Sincroniza los filtros de /buscar con la query string y pide el listado
// a GET /api/v1/properties (en esta entrega, servido desde /public/data).
export function usePropertiesSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => readSearchFilters(searchParams), [searchParams])

  const requestedPage = Number(searchParams.get('page') ?? 0)
  const page = Number.isSafeInteger(requestedPage) && requestedPage >= 0 ? requestedPage : 0

  const applyFilters = useCallback(
    (nextFilters) => {
      setSearchParams(searchParamsFor(nextFilters))
    },
    [setSearchParams],
  )

  const goToPage = useCallback(
    (nextPage) => {
      const next = new URLSearchParams(searchParams)
      next.set('page', String(nextPage))
      setSearchParams(next)
    },
    [searchParams, setSearchParams],
  )

  const [status, setStatus] = useState('loading')
  const [properties, setProperties] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const retry = () => setAttempt((value) => value + 1)

  // Clave estable para no volver a pedir si los filtros no cambiaron.
  const queryKey = searchParams.toString()

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setPageInfo(null)
    const validationError = validateSearch(filters)
    if (validationError) {
      setError(validationError)
      setProperties([])
      setStatus('error')
      return
    }

    getProperties({ ...filters, page, size: PAGE_SIZE })
      .then((data) => {
        if (cancelled) return
        setProperties(data.content)
        setPageInfo({ totalPages: data.totalPages, totalElements: data.totalElements })
        setError(null)
        setStatus(data.content.length === 0 ? 'empty' : 'success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.detail ?? err.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, attempt])

  return { filters, page, applyFilters, goToPage, status, properties, error, pageInfo, retry }
}
