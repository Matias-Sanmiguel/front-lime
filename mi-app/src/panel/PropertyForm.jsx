import {
  CURRENCIES,
  FIELD_LABELS,
  OPERATIONS,
  PROPERTY_TYPES,
  REQUIRED_TO_PUBLISH,
  isRequiredField,
} from './propertyFields'

// Campos del aviso, compartidos por el alta y la edición. `saved` es el aviso
// tal como está en el backend (null en el alta) y define qué no se puede vaciar;
// `invalid` marca lo que falta cuando el backend rechazó la publicación.
export default function PropertyForm({
  formRef,
  values,
  onFieldChange,
  onSubmit,
  saved = null,
  invalid = [],
  disabled = false,
  children,
}) {
  function bind(name) {
    return {
      id: `property-${name}`,
      name,
      value: values[name],
      onChange: (event) => onFieldChange(name, event.target.value),
      required: saved ? isRequiredField(name, saved) : false,
      'aria-invalid': invalid.includes(name) || undefined,
    }
  }

  return (
    <form ref={formRef} className="property-form" onSubmit={onSubmit}>
      <fieldset className="form-fields" disabled={disabled}>
        <p className="form-note">
          <span className="field-mark">*</span> Obligatorio para publicar. El borrador se puede
          guardar incompleto.
        </p>

        <FormSection title="Datos principales">
          <Field name="title" wide>
            <input
              type="text"
              maxLength={120}
              placeholder="Ej.: 3 ambientes con balcón en Palermo"
              {...bind('title')}
            />
          </Field>
          <Field name="type">
            <select {...bind('type')}>
              <Options placeholder="Elegí un tipo" options={PROPERTY_TYPES} />
            </select>
          </Field>
          <Field name="operation">
            <select {...bind('operation')}>
              <Options placeholder="Elegí una operación" options={OPERATIONS} />
            </select>
          </Field>
          <Field name="description" wide>
            <textarea rows={5} maxLength={2000} {...bind('description')} />
          </Field>
        </FormSection>

        <FormSection title="Precio">
          <Field name="price">
            <input type="number" min="0" step="0.01" inputMode="decimal" {...bind('price')} />
          </Field>
          <Field name="currency">
            <select {...bind('currency')}>
              <Options placeholder="Elegí una moneda" options={CURRENCIES} />
            </select>
          </Field>
        </FormSection>

        <FormSection title="Ubicación">
          <Field name="address" wide>
            <input type="text" maxLength={200} {...bind('address')} />
          </Field>
          <Field name="city">
            <input type="text" maxLength={100} placeholder="Ej.: CABA" {...bind('city')} />
          </Field>
          <Field name="province">
            <input type="text" maxLength={100} placeholder="Ej.: Buenos Aires" {...bind('province')} />
          </Field>
        </FormSection>

        <FormSection title="Características">
          <Field name="bedrooms">
            <input type="number" min="0" step="1" inputMode="numeric" {...bind('bedrooms')} />
          </Field>
          <Field name="bathrooms">
            <input type="number" min="0" step="1" inputMode="numeric" {...bind('bathrooms')} />
          </Field>
          <Field name="coveredArea">
            <input type="number" min="0" step="0.01" inputMode="decimal" {...bind('coveredArea')} />
          </Field>
          <Field name="totalArea">
            <input type="number" min="0" step="0.01" inputMode="decimal" {...bind('totalArea')} />
          </Field>
        </FormSection>
      </fieldset>

      {children}
    </form>
  )
}

function FormSection({ title, children }) {
  return (
    <section className="panel-card form-section">
      <h2>{title}</h2>
      <div className="field-grid">{children}</div>
    </section>
  )
}

function Field({ name, wide = false, children }) {
  return (
    <div className={wide ? 'field field-wide' : 'field'}>
      <label htmlFor={`property-${name}`}>
        {FIELD_LABELS[name]}
        {REQUIRED_TO_PUBLISH.includes(name) && (
          <>
            <span className="field-mark" aria-hidden="true">
              {' '}
              *
            </span>
            <span className="visually-hidden"> (obligatorio para publicar)</span>
          </>
        )}
      </label>
      {children}
    </div>
  )
}

function Options({ placeholder, options }) {
  return (
    <>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </>
  )
}
