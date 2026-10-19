export function validateRegistration(values) {
  const errors = {}
  if (!values.name?.trim() || values.name.length > 100) errors.name = 'Ingresá tu nombre (hasta 100 caracteres).'
  if (!/^\S+@\S+\.\S+$/.test(values.email || '') || values.email.length > 150) errors.email = 'Ingresá un email válido.'
  if (!values.password || values.password.length < 8 || new TextEncoder().encode(values.password).length > 72) errors.password = 'Usá al menos 8 caracteres y un máximo de 72 bytes.'
  const date = new Date(values.birthDate)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.birthDate || '') || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== values.birthDate || date >= new Date(new Date().toISOString().slice(0,10))) errors.birthDate = 'Ingresá una fecha de nacimiento anterior a hoy.'
  if (!['MALE','FEMALE','OTHER'].includes(values.sex)) errors.sex = 'Seleccioná una opción.'
  if (!['USER','AGENCY'].includes(values.role)) errors.role = 'Elegí Usuario o Inmobiliaria.'
  if (values.role === 'AGENCY' && (!values.agencyName?.trim() || values.agencyName.length > 150)) errors.agencyName = 'Ingresá el nombre de la inmobiliaria (hasta 150 caracteres).'
  return errors
}
