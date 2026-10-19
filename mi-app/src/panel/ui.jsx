import { ApiError } from '../api/client'
import { STATUS_LABELS } from './propertyFields'

export function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

// Muestra el error como lo devolvió el backend: código HTTP + detail del
// Problem Details. `children` suma contexto propio de la pantalla.
export function ErrorAlert({ title, error, children }) {
  const status = error instanceof ApiError && error.status > 0 ? error.status : null

  return (
    <div className="alert alert-error" role="alert">
      <p className="alert-title">
        {title}
        {status && <span className="alert-code">Error {status}</span>}
      </p>
      <p>{errorDetail(error)}</p>
      {children}
    </div>
  )
}

export function Notice({ children }) {
  return (
    <div className="alert alert-success" role="status">
      {children}
    </div>
  )
}

// Reemplaza la pantalla entera cuando no se puede seguir (sin sesión, 403, 404).
export function ErrorState({ code, title, children }) {
  return (
    <section className="panel-card error-state">
      {code && <p className="eyebrow">Error {code}</p>}
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function errorDetail(error) {
  if (!(error instanceof ApiError)) {
    return 'Ocurrió un error inesperado.'
  }
  return error.detail || `El servidor respondió con el código ${error.status}.`
}
