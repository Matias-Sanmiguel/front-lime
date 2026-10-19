import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import {
  getProperty,
  getPropertyImages,
  pauseProperty,
  publishProperty,
  updateProperty,
} from '../api/properties'
import { useAuth } from '../auth/AuthContext.jsx'
import PropertyForm from './PropertyForm.jsx'
import PropertyImages from './PropertyImages.jsx'
import {
  EMPTY_VALUES,
  FIELD_LABELS,
  STATUS_HELP,
  changedFields,
  hasUnsavedChanges,
  missingToPublish,
  toFormValues,
} from './propertyFields'
import { ErrorAlert, ErrorState, Notice, StatusBadge } from './ui.jsx'

const ERROR_TITLES = {
  save: 'No se pudieron guardar los cambios',
  publish: 'No se pudo publicar el aviso',
  pause: 'No se pudo pausar el aviso',
}

const dateTimeFormat = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' })
const listFormat = new Intl.ListFormat('es', { type: 'conjunction' })

// /panel/:id/editar: edición con PATCH parcial, publicar / pausar y fotos.
export default function EditPropertyPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const formRef = useRef(null)

  const [property, setProperty] = useState(null)
  const [images, setImages] = useState([])
  const [values, setValues] = useState(EMPTY_VALUES)
  const [loadError, setLoadError] = useState(null)
  const [busy, setBusy] = useState(null)
  // Resultado de la última acción: { action, message } o { action, error }.
  const [feedback, setFeedback] = useState(() =>
    location.state?.notice ? { action: 'created', message: location.state.notice } : null,
  )

  const userId = user?.id

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const loaded = await loadOwnProperty(id, userId)
        const loadedImages = await getPropertyImages(id)
        if (!cancelled) {
          setProperty(loaded)
          setValues(toFormValues(loaded))
          setImages(loadedImages)
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, userId])

  if (loadError) {
    return <LoadError error={loadError} />
  }
  if (!property) {
    return (
      <p className="panel-loading" role="status">
        Cargando aviso…
      </p>
    )
  }

  const dirty = hasUnsavedChanges(values, property)
  const publishRejected = feedback?.action === 'publish' && feedback.error?.status === 400

  function handleFieldChange(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  // Un 403 en cualquier acción quiere decir que el aviso no es del usuario:
  // dejamos de mostrar el form y mostramos el error del backend.
  async function runAction(action, work) {
    setBusy(action)
    setFeedback(null)
    try {
      setFeedback({ action, message: await work() })
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setLoadError(error)
      } else {
        setFeedback({ action, error })
      }
    } finally {
      setBusy(null)
    }
  }

  function applySaved(saved) {
    setProperty(saved)
    setValues(toFormValues(saved))
  }

  function handleSave(event) {
    event.preventDefault()
    runAction('save', async () => {
      applySaved(await updateProperty(id, changedFields(values, property)))
      return 'Cambios guardados.'
    })
  }

  function handlePublish() {
    // El botón está fuera del <form>: corremos la misma validación que un submit.
    if (!formRef.current.reportValidity()) {
      return
    }
    runAction('publish', async () => {
      // El backend publica lo que está guardado: primero guardamos lo que está en pantalla.
      if (dirty) {
        applySaved(await updateProperty(id, changedFields(values, property)))
      }
      setProperty(await publishProperty(id))
      return 'Aviso publicado: ya aparece en el listado público.'
    })
  }

  function handlePause() {
    runAction('pause', async () => {
      setProperty(await pauseProperty(id))
      return 'Aviso pausado: ya no aparece en el listado público.'
    })
  }

  let publishLabel = dirty ? 'Guardar y publicar' : 'Publicar'
  if (busy === 'publish') {
    publishLabel = 'Publicando…'
  }

  return (
    <>
      <header className="page-head">
        <Link className="back-link" to="/panel">
          ← Volver al panel
        </Link>
        <h1>Editar aviso</h1>
        <p className="page-meta">
          {property.title?.trim() || 'Sin título'} · Aviso #{property.id} · Última edición{' '}
          {dateTimeFormat.format(new Date(property.updatedAt))}
        </p>
      </header>

      <section className="panel-card status-card" aria-label="Estado del aviso">
        <div className="status-info">
          <StatusBadge status={property.status} />
          <p>{STATUS_HELP[property.status]}</p>
        </div>
        <div className="status-actions">
          {property.status !== 'DRAFT' && (
            <Link className="text-link" to="/">
              Ver listado público
            </Link>
          )}
          {property.status === 'PUBLISHED' ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePause}
              disabled={busy !== null}
            >
              {busy === 'pause' ? 'Pausando…' : 'Pausar'}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePublish}
              disabled={busy !== null}
            >
              {publishLabel}
            </button>
          )}
        </div>
      </section>

      {feedback && feedback.action !== 'save' && (
        <ActionFeedback
          feedback={feedback}
          missing={publishRejected ? missingToPublish(property) : []}
        />
      )}

      <PropertyForm
        formRef={formRef}
        values={values}
        onFieldChange={handleFieldChange}
        onSubmit={handleSave}
        saved={property}
        invalid={publishRejected ? missingToPublish(values) : []}
        disabled={busy !== null}
      >
        <div className="form-footer">
          {feedback?.action === 'save' && <ActionFeedback feedback={feedback} />}
          <p className="dirty-hint">
            {dirty ? 'Tenés cambios sin guardar.' : 'No hay cambios sin guardar.'}
          </p>
          <button type="submit" className="btn btn-primary" disabled={!dirty || busy !== null}>
            {busy === 'save' ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </PropertyForm>

      <PropertyImages
        propertyId={property.id}
        images={images}
        setImages={setImages}
        onForbidden={setLoadError}
      />
    </>
  )
}

// GET /properties/{id} le devuelve los avisos publicados a cualquiera y esconde
// con 404 los borradores o pausados ajenos, así que no alcanza para saber si el
// aviso es del usuario. Si no lo es (o no lo vemos), le preguntamos al backend
// con un PATCH sin campos: no modifica nada y pasa por el mismo chequeo de dueño
// que guardar, publicar o pausar, así que responde 403 (es de otra cuenta) o 404.
async function loadOwnProperty(id, userId) {
  try {
    const property = await getProperty(id)
    if (property.owner?.id === userId) {
      return property
    }
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error
    }
  }
  return updateProperty(id, {})
}

function ActionFeedback({ feedback, missing = [] }) {
  if (!feedback.error) {
    return <Notice>{feedback.message}</Notice>
  }

  return (
    <ErrorAlert title={ERROR_TITLES[feedback.action]} error={feedback.error}>
      {missing.length > 0 && (
        <p>
          Para publicar falta completar{' '}
          {listFormat.format(missing.map((name) => FIELD_LABELS[name].toLowerCase()))}.
        </p>
      )}
    </ErrorAlert>
  )
}

function LoadError({ error }) {
  const status = error instanceof ApiError ? error.status : null
  const backToPanel = (
    <Link className="btn btn-secondary" to="/panel">
      Volver al panel
    </Link>
  )

  if (status === 403) {
    return (
      <ErrorState code={403} title="No podés editar este aviso">
        <p>Es de otra cuenta: solo su dueño puede editarlo, publicarlo, pausarlo o cambiar sus fotos.</p>
        {error.detail && <p className="muted">Respuesta del servidor: «{error.detail}»</p>}
        {backToPanel}
      </ErrorState>
    )
  }

  if (status === 404) {
    return (
      <ErrorState code={404} title="No encontramos este aviso">
        <p>Puede que se haya eliminado o que el enlace sea incorrecto.</p>
        {backToPanel}
      </ErrorState>
    )
  }

  return (
    <ErrorState code={status || null} title="No pudimos cargar el aviso">
      <p>{error.detail || 'Ocurrió un error inesperado.'}</p>
      {backToPanel}
    </ErrorState>
  )
}
