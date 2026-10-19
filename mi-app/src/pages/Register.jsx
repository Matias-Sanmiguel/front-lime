import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/auth/AuthContext.jsx'
import { validateRegistration } from '@/auth/registration.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    sex: '',
    role: 'USER',
    agencyName: '',
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  function change(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined }))
  }
  async function submit(event) {
    event.preventDefault()
    const found = validateRegistration(values)
    setErrors(found)
    setError(null)
    if (Object.keys(found).length) return
    setSending(true)
    try {
      const session = await apiFetch('/api/v1/auth/register', {
        method: 'POST',
        body: {
          ...values,
          name: values.name.trim(),
          email: values.email.trim(),
          agencyName: values.role === 'AGENCY' ? values.agencyName.trim() : null,
        },
      })
      login(session.token, session.user)
      navigate(values.role === 'AGENCY' ? '/panel' : '/buscar')
    } catch (err) {
      setError(err.detail || 'No pudimos crear tu cuenta. Intentá nuevamente.')
    } finally {
      setSending(false)
    }
  }
  function field(name, label, type = 'text', extra = {}) {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={`register-${name}`}>{label}</Label>
        <Input
          id={`register-${name}`}
          name={name}
          type={type}
          value={values[name]}
          onChange={change}
          disabled={sending}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          {...extra}
        />
        {errors[name] && (
          <p id={`${name}-error`} role="alert" className="text-sm text-danger">
            {errors[name]}
          </p>
        )}
      </div>
    )
  }
  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registrate para consultar avisos o publicar los tuyos.
        </p>
      </div>
      <form
        onSubmit={submit}
        noValidate
        className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
      >
        {field('name', 'Nombre', 'text', { autoComplete: 'name', maxLength: 100 })}
        {field('email', 'Email', 'email', { autoComplete: 'email', maxLength: 150 })}
        {field('password', 'Contraseña', 'password', {
          autoComplete: 'new-password',
          minLength: 8,
          maxLength: 72,
        })}
        <p className="-mt-2 text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {field('birthDate', 'Fecha de nacimiento', 'date', { autoComplete: 'bday' })}
          <div className="space-y-1.5">
            <Label htmlFor="register-sex">Sexo</Label>
            <select
              id="register-sex"
              name="sex"
              value={values.sex}
              onChange={change}
              disabled={sending}
              aria-invalid={Boolean(errors.sex)}
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            >
              <option value="">Seleccionar</option>
              <option value="FEMALE">Femenino</option>
              <option value="MALE">Masculino</option>
              <option value="OTHER">Otro</option>
            </select>
            {errors.sex && (
              <p role="alert" className="text-sm text-danger">
                {errors.sex}
              </p>
            )}
          </div>
        </div>
        <fieldset disabled={sending}>
          <legend className="mb-2 text-sm font-medium">Tipo de cuenta</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['USER', 'Usuario'],
              ['AGENCY', 'Inmobiliaria'],
            ].map(([role, label]) => (
              <label
                key={role}
                className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm ${values.role === role ? 'border-foreground' : 'border-border'}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={values.role === role}
                  onChange={change}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {values.role === 'AGENCY' && (
          <>
            {field('agencyName', 'Nombre de la inmobiliaria', 'text', { maxLength: 150 })}
            <p className="-mt-2 text-xs text-muted-foreground">
              Obligatorio para cuentas de inmobiliaria.
            </p>
          </>
        )}
        {error && (
          <p role="alert" className="rounded-md bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" disabled={sending}>
          {sending ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-accent-ink underline">
          Ingresá
        </Link>
      </p>
    </section>
  )
}
