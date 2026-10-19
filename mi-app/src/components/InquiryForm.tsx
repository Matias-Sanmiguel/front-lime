import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ApiError } from '@/api/client'
import { createInquiry } from '@/api/inquiries'

interface Props {
  propertyId: number | string
}

type FormValues = {
  name: string
  email: string
  phone: string
  message: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const EMPTY: FormValues = { name: '', email: '', phone: '', message: '' }
const EMAIL_REGEX = /^\S+@\S+\.\S+$/

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Ingresá tu nombre'
  if (!values.email.trim()) errors.email = 'Ingresá tu email'
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = 'El email no es válido'
  if (!values.message.trim()) errors.message = 'Escribí tu consulta'
  return errors
}

export function InquiryForm({ propertyId }: Props) {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      // al corregir un campo, le sacamos el error que tenía
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(false)
    setServerError(null)

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return // campos vacíos no salen del cliente

    setSending(true)
    try {
      await createInquiry(propertyId, {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        message: values.message.trim(),
      })
      setSent(true)
      setValues(EMPTY)
    } catch (err) {
      // 409 (aviso no PUBLISHED) y cualquier otro error: mostramos el `detail`
      // del Problem Details tal cual lo manda el backend.
      setServerError(
        err instanceof ApiError && err.detail
          ? err.detail
          : 'No pudimos enviar la consulta. Probá de nuevo.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-6">
      <h2 className="text-lg font-semibold">Consultar anunciante</h2>

      <div className="space-y-1.5">
        <Label htmlFor="inquiry-name">Nombre</Label>
        <Input
          id="inquiry-name"
          value={values.name}
          onChange={handleChange('name')}
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          disabled={sending}
        />
        {errors.name && <p role="alert" className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inquiry-email">Email</Label>
        <Input
          id="inquiry-email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          maxLength={150}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          disabled={sending}
        />
        {errors.email && <p role="alert" className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inquiry-phone">
          Teléfono <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="inquiry-phone"
          type="tel"
          value={values.phone}
          onChange={handleChange('phone')}
          maxLength={30}
          autoComplete="tel"
          disabled={sending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inquiry-message">Mensaje</Label>
        <Textarea
          id="inquiry-message"
          value={values.message}
          onChange={handleChange('message')}
          maxLength={1000}
          aria-invalid={Boolean(errors.message)}
          disabled={sending}
        />
        {errors.message && <p role="alert" className="text-sm text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" size="lg" className="h-10 w-full" disabled={sending}>
        {sending ? 'Enviando...' : 'Enviar consulta'}
      </Button>

      {sent && (
        <p role="status" className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-foreground">
          ¡Consulta enviada! El anunciante se va a comunicar con vos.
        </p>
      )}
      {serverError && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}
    </form>
  )
}