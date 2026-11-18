import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  fetchInquiries,
  fetchInquiry,
  markInquiryRead,
  selectInquiries,
  selectInquiriesError,
  selectInquiriesPage,
  selectInquiriesStatus,
  selectInquiriesTotalPages,
  selectUnreadCount,
} from '@/store/inquiriesSlice'

const dateFormat = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' })
export default function InquiriesPage() {
  const { inquiryId } = useParams()
  const [params, setParams] = useSearchParams()
  const dispatch = useDispatch()
  const items = useSelector(selectInquiries)
  const unreadCount = useSelector(selectUnreadCount)
  const page = useSelector(selectInquiriesPage)
  const totalPages = useSelector(selectInquiriesTotalPages)
  const status = useSelector(selectInquiriesStatus)
  const error = useSelector(selectInquiriesError)
  const [busy, setBusy] = useState(null)
  const [refreshVersion, setRefreshVersion] = useState(0)
  const [notice, setNotice] = useState('')
  const query = params.toString()

  useEffect(() => {
    if (inquiryId) {
      dispatch(fetchInquiry(inquiryId))
      return
    }
    const filters = new URLSearchParams(query)
    dispatch(
      fetchInquiries({
        page: filters.has('page') ? Number(filters.get('page')) : undefined,
        unreadOnly: filters.has('unreadOnly')
          ? filters.get('unreadOnly') === 'true'
          : undefined,
        propertyId: filters.has('propertyId') ? filters.get('propertyId') : undefined,
        size: filters.has('size') ? Number(filters.get('size')) : undefined,
      }),
    )
  }, [dispatch, inquiryId, query, refreshVersion])

  const visibleItems = inquiryId
    ? items.filter((item) => String(item.id) === String(inquiryId))
    : params.get('unreadOnly') === 'true'
      ? items.filter((item) => !item.readAt)
      : items
  const loading = status === 'loading' && visibleItems.length === 0

  function filter(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  async function markRead(id) {
    setBusy(id)
    try {
      await dispatch(markInquiryRead(id)).unwrap()
      setNotice('Consulta marcada como leída.')
    } catch {
      setNotice('')
    } finally {
      setBusy(null)
    }
  }
  return (
    <>
      <header className="page-head">
        <Link className="back-link" to={inquiryId ? '/panel/consultas' : '/panel'}>
          ← Volver {inquiryId ? 'a consultas' : 'al panel'}
        </Link>
        <h1>{inquiryId ? 'Detalle de consulta' : 'Consultas recibidas'}</h1>
        <p className="page-meta">
          {`Tenés ${unreadCount} ${unreadCount === 1 ? 'consulta' : 'consultas'} sin leer.`}
        </p>
      </header>
      {!inquiryId && (
        <div className="inbox-filters">
          <label className="inbox-check">
            <input
              type="checkbox"
              checked={params.get('unreadOnly') === 'true'}
              onChange={(e) => filter('unreadOnly', e.target.checked ? 'true' : '')}
            />
            Solo sin leer
          </label>
          <button
            className="btn btn-secondary btn-small"
            onClick={() => {
              setRefreshVersion((value) => value + 1)
            }}
          >
            Actualizar
          </button>
        </div>
      )}
      {notice && (
        <p className="visually-hidden" role="status">
          {notice}
        </p>
      )}
      {error && (
        <div className="alert alert-error" role="alert">
          <p className="alert-title">No pudimos cargar o actualizar las consultas</p>
          <p>{error}</p>
        </div>
      )}
      {loading && !error && (
        <p role="status" className="panel-loading">
          Cargando consultas…
        </p>
      )}
      {!loading && !error && visibleItems.length === 0 && (
        <section className="panel-card">
          <h2>No hay consultas{params.get('unreadOnly') === 'true' ? ' sin leer' : ''}</h2>
          <p className="muted">
            Cuando alguien consulte por tus avisos, vas a encontrar su mensaje acá.
          </p>
        </section>
      )}
      {visibleItems.map((item) => (
        <article key={item.id} className="panel-card inquiry-card">
          <div className="inquiry-heading">
            <div>
              <h2>
                <Link to={`/panel/consultas/${item.id}`}>{item.name}</Link>{' '}
                {!item.readAt && <span className="inquiry-new">Nueva</span>}
              </h2>
              <p className="muted inquiry-contact">
                <a href={`mailto:${item.email}`}>{item.email}</a>
                {item.phone && (
                  <>
                    {' '}
                    · <a href={`tel:${item.phone}`}>{item.phone}</a>
                  </>
                )}
              </p>
            </div>
            <time className="muted" dateTime={item.createdAt}>
              {dateFormat.format(new Date(item.createdAt))}
            </time>
          </div>
          <p className="muted">
            Sobre:{' '}
            <Link className="text-link underline" to={`/propiedad/${item.propertyId}`}>
              {item.propertyTitle}
            </Link>
          </p>
          <p className="inquiry-message">{item.message}</p>
          {!item.readAt && (
            <button
              className="btn btn-secondary btn-small"
              disabled={busy !== null}
              onClick={() => markRead(item.id)}
            >
              {busy === item.id ? 'Guardando…' : 'Marcar como leída'}
            </button>
          )}
        </article>
      ))}
      {!inquiryId && totalPages > 1 && (
        <nav className="inbox-pagination" aria-label="Páginas de consultas">
          <button
            className="btn btn-secondary"
            disabled={page === 0}
            onClick={() => filter('page', String(page - 1))}
          >
            Anterior
          </button>
          <span>
            {page + 1} de {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => filter('page', String(page + 1))}
          >
            Siguiente
          </button>
        </nav>
      )}
    </>
  )
}
