import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { createProperty } from '../api/properties'
import PropertyForm from './PropertyForm.jsx'
import { EMPTY_VALUES, filledFields } from './propertyFields'
import { ErrorAlert } from './ui.jsx'

// /panel/nuevo: el aviso nace en DRAFT con lo que se haya completado. Las fotos
// y la publicación necesitan el id, así que después del alta seguimos en la edición.
export default function NewPropertyPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY_VALUES)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function handleFieldChange(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const created = await createProperty(filledFields(values))
      navigate(`/panel/${created.id}/editar`, {
        replace: true,
        state: { notice: 'Creamos el borrador. Sumá fotos y publicalo cuando esté listo.' },
      })
    } catch (err) {
      setError(err)
      setSaving(false)
    }
  }

  return (
    <>
      <header className="page-head">
        <Link className="back-link" to="/panel">
          ← Volver al panel
        </Link>
        <h1>Nuevo aviso</h1>
        <p className="page-meta">Se guarda como borrador: solo vos lo ves hasta que lo publiques.</p>
      </header>

      <PropertyForm
        values={values}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        disabled={saving}
      >
        <div className="form-footer">
          {error && <ErrorAlert title="No se pudo crear el aviso" error={error} />}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Creando…' : 'Crear borrador'}
          </button>
        </div>
      </PropertyForm>

      <section className="panel-card photos" aria-labelledby="photos-title">
        <h2 id="photos-title">Fotos</h2>
        <p className="muted">Vas a poder subirlas apenas crees el borrador.</p>
      </section>
    </>
  )
}
