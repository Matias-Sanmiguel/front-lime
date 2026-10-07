import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const FILTER_KEYS = ['city', 'province', 'type', 'operation', 'minPrice', 'maxPrice', 'minBedrooms', 'minBathrooms']

// Sincroniza los filtros de /buscar con la query string. No hace ningún
// fetch: la integración real con GET /api/v1/properties depende de
// src/api/properties.js (hoy solo en origin/busse/cliente-api-sesion, no
// mergeado a esta rama). Para no duplicar ese trabajo ni reimplementar su
// manejo de errores/sesión, queda un único punto de integración marcado
// abajo con TODO(LIM-37) — conectarlo ahí cuando el cliente esté disponible.
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

  // TODO(LIM-37): reemplazar por la llamada real, ej.
  //   const { data, status, error } = useQueryProperties({ ...filters, page })
  //   usando getProperties de src/api/properties.js
  const status = 'empty'
  const properties = []
  const pageInfo = null

  return { filters, page, applyFilters, goToPage, status, properties, pageInfo }
}
