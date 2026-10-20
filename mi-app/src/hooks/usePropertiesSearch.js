import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProperties } from '@/api/properties'

const FILTER_KEYS = ['city', 'province', 'type', 'operation', 'minPrice', 'maxPrice', 'minBedrooms', 'minBathrooms']
const PAGE_SIZE = 8

// Sincroniza los filtros de /buscar con la query string y pide el listado
// a GET /api/v1/properties (con VITE_USE_MOCK=true, servido desde /public/data).
export function usePropertiesSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => {
    const result = {}
    for (const key of FILTER_KEYS) {
      const value = searchParams.get(key)
      if (value) result[key] = value
    }
    return result
  }, [searchParams])

  const page = Number(searchParams.get('page') ?? 0)

  const applyFilters = useCallback(
    (nextFilters) => {
      const next = new URLSearchParams()
      for (const key of FILTER_KEYS) {
        if (nextFilters[key]) next.set(key, nextFilters[key])
      }
      next.set('page', '0')
      setSearchParams(next)
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

  // Clave estable para no volver a pedir si los filtros no cambiaron.
  const queryKey = searchParams.toString()

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

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
  }, [queryKey])

  return { filters, page, applyFilters, goToPage, status, properties, error, pageInfo }
}