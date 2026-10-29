import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProperties } from '@/api/properties'
import { readSearchFilters, searchParamsFor, validateSearch } from '@/lib/property-search'

const PAGE_SIZE = 8

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

  const [result, setResult] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const retry = () => setAttempt((value) => value + 1)
  const requestKey = `${searchParamsFor(filters, page)}:${attempt}`
  const validationError = validateSearch(filters)
  const current = result?.key === requestKey ? result : null
  const error = validationError ?? current?.error ?? null
  const properties = current?.data?.content ?? []
  const pageInfo = current?.data ?? null
  const status = error ? 'error' : !current ? 'loading' : properties.length ? 'success' : 'empty'

  useEffect(() => {
    let cancelled = false
    if (validationError) return

    getProperties({ ...filters, page, size: PAGE_SIZE })
      .then((data) => {
        if (cancelled) return
        setResult({ key: requestKey, data, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        setResult({
          key: requestKey,
          data: null,
          error: err.detail ?? err.message ?? 'No pudimos completar la búsqueda.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [filters, page, requestKey, validationError])

  return { filters, page, applyFilters, goToPage, status, properties, error, pageInfo, retry }
}
