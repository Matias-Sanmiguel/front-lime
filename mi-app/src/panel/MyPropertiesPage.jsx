import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { formatPrice } from '@/lib/format'
import { operationTypeLabel, propertyTypeLabel } from '@/lib/property-enums'
import { ErrorAlert, StatusBadge } from './ui.jsx'

// /panel: lista los avisos del usuario (GET /api/v1/me/properties),
// en cualquier estado: borrador, publicado o pausado.
export default function MyPropertiesPage() {
  const [properties, setProperties] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/v1/me/properties')
      .then((data) => {
        if (!cancelled) setProperties(data.content)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
    async function remove(property) {
    if (!window.confirm(`¿Eliminar el aviso «${property.title}»?`)) return
    try {
      await apiFetch(`/api/v1/properties/${property.id}`, {method:'DELETE'})
      setProperties(previous=>previous.filter(item=>item.id!==property.id))
    } catch(err) { setError(err) }
  }

  return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <header className="page-head">
        <h1>Mis avisos</h1>
        <p className="page-meta">Acá ves todos tus avisos, publicados o no.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link className="btn btn-primary" to="/panel/nuevo">
            Nuevo aviso
          </Link>
          <Link className="btn btn-secondary" to="/panel/consultas">
            Consultas recibidas
          </Link>
        </div>
      </header>

      {error && <ErrorAlert title="No se pudieron cargar tus avisos" error={error} />}

      {!error && properties === null && (
        <p className="panel-loading" role="status">
          Cargando tus avisos…
        </p>
      )}

      {properties?.length === 0 && (
        <section className="panel-card">
          <p className="muted">Todavía no creaste ningún aviso.</p>
        </section>
      )}

      {properties?.map((property) => (
        <section
          key={property.id}
          className="panel-card"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{property.title}</h2>
            <p className="muted">
              {propertyTypeLabel(property.type)} · {operationTypeLabel(property.operation)} ·{' '}
              {formatPrice(property.price, property.currency)}
            </p>
            <p className="muted">
              {property.city}, {property.province}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <StatusBadge status={property.status} />
            <Link className="btn btn-secondary" to={`/panel/${property.id}/editar`}>
              Editar
            </Link>
            <button type="button" className="btn btn-danger" onClick={()=>remove(property)}>Eliminar</button>
          </div>
        </section>
      ))}
    </>
  )
}