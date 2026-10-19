import { useRef, useState } from 'react'
import { ApiError } from '../api/client'
import {
  addPropertyImage,
  deletePropertyImage,
  imageUrl,
  replacePropertyImage,
} from '../api/properties'
import { ErrorAlert } from './ui.jsx'

// Los mismos tipos que acepta FileStorageService en el backend.
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp'

// Las fotos se guardan en el momento (no esperan al "Guardar cambios" del form):
// cada alta, reemplazo o baja es su propio request contra /images.
export default function PropertyImages({ propertyId, images, setImages, onForbidden }) {
  const addInput = useRef(null)
  const replaceInput = useRef(null)
  const replaceTarget = useRef(null)
  const [progress, setProgress] = useState(null)
  const [failure, setFailure] = useState(null)
  const busy = progress !== null

  function fail(title, error) {
    if (error instanceof ApiError && error.status === 403) {
      onForbidden(error)
    } else {
      setFailure({ title, error })
    }
  }

  async function handleAdd(event) {
    const files = Array.from(event.target.files)
    // Limpiamos el input para que volver a elegir el mismo archivo dispare onChange.
    event.target.value = ''
    setFailure(null)

    let current = null
    try {
      for (const [index, file] of files.entries()) {
        current = file
        setProgress(`Subiendo ${index + 1} de ${files.length}…`)
        const created = await addPropertyImage(propertyId, file)
        setImages((previous) => [...previous, created])
      }
    } catch (error) {
      fail(`No se pudo subir «${current.name}»`, error)
    } finally {
      setProgress(null)
    }
  }

  function pickReplacement(imageId) {
    replaceTarget.current = imageId
    replaceInput.current.click()
  }

  async function handleReplace(event) {
    const [file] = event.target.files
    event.target.value = ''
    if (!file) {
      return
    }

    const imageId = replaceTarget.current
    setFailure(null)
    setProgress('Reemplazando la foto…')
    try {
      const updated = await replacePropertyImage(propertyId, imageId, file)
      setImages((previous) => previous.map((image) => (image.id === imageId ? updated : image)))
    } catch (error) {
      fail('No se pudo reemplazar la foto', error)
    } finally {
      setProgress(null)
    }
  }

  async function handleDelete(image, position) {
    if (!window.confirm(`¿Eliminar la foto ${position}? No se puede deshacer.`)) {
      return
    }

    setFailure(null)
    setProgress('Eliminando la foto…')
    try {
      await deletePropertyImage(propertyId, image.id)
      setImages((previous) => previous.filter((item) => item.id !== image.id))
    } catch (error) {
      fail('No se pudo eliminar la foto', error)
    } finally {
      setProgress(null)
    }
  }

  return (
    <section className="panel-card photos" aria-labelledby="photos-title">
      <div className="photos-head">
        <div>
          <h2 id="photos-title">Fotos</h2>
          <p className="muted">JPG, PNG o WEBP de hasta 5 MB. Se guardan apenas las subís.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addInput.current.click()}
          disabled={busy}
        >
          Agregar fotos
        </button>
        <input ref={addInput} type="file" accept={ACCEPTED_TYPES} multiple hidden onChange={handleAdd} />
        <input ref={replaceInput} type="file" accept={ACCEPTED_TYPES} hidden onChange={handleReplace} />
      </div>

      {busy && (
        <p className="photos-progress" role="status">
          {progress}
        </p>
      )}
      {failure && <ErrorAlert title={failure.title} error={failure.error} />}

      {images.length === 0 ? (
        <p className="photos-empty">Todavía no hay fotos en este aviso.</p>
      ) : (
        <ul className="photo-grid">
          {images.map((image, index) => (
            <li key={image.id} className="photo">
              <img src={imageUrl(image)} alt={`Foto ${index + 1} del aviso`} loading="lazy" />
              <div className="photo-actions">
                <button
                  type="button"
                  className="btn btn-small btn-secondary"
                  onClick={() => pickReplacement(image.id)}
                  disabled={busy}
                >
                  Reemplazar
                </button>
                <button
                  type="button"
                  className="btn btn-small btn-danger"
                  onClick={() => handleDelete(image, index + 1)}
                  disabled={busy}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
