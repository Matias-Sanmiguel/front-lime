import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../src/auth/AuthContext.jsx'
import { Register } from '../src/pages/Register.jsx'
import MyPropertiesPage from '../src/panel/MyPropertiesPage.jsx'
import InquiriesPage from '../src/panel/InquiriesPage.jsx'
import { apiFetch } from '../src/api/client.js'
import { readFile } from 'node:fs/promises'
import { webcrypto } from 'node:crypto'

beforeEach(() => {
  sessionStorage.clear()
  vi.stubGlobal('crypto', webcrypto)
  vi.stubGlobal('fetch', async (path) => ({
    ok: true,
    json: async () => JSON.parse(await readFile(`${process.cwd()}/public${path}`, 'utf8')),
  }))
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const mount = (component) =>
  render(
    <MemoryRouter>
      <AuthProvider>{component}</AuthProvider>
    </MemoryRouter>,
  )
const signIn = () =>
  apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: { email: 'lime@test.com', password: '12345678' },
  })
test('register form validates and submits a complete agency account', async () => {
  mount(<Register />)
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
  expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
  for (const [label, value] of [
    ['Nombre', 'Ana'],
    ['Email', 'ana@example.com'],
    ['Contraseña', 'password123'],
    ['Fecha de nacimiento', '2000-01-01'],
    ['Sexo', 'FEMALE'],
  ])
    fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } })
  fireEvent.click(screen.getByLabelText('Inmobiliaria', { exact: true }))
  fireEvent.change(screen.getByLabelText('Nombre de la inmobiliaria'), {
    target: { value: 'Ana propiedades' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
  await waitFor(() =>
    expect(JSON.parse(sessionStorage.getItem('lime.session'))?.user.email).toBe('ana@example.com'),
  )
  expect((await apiFetch('/api/v1/me')).role).toBe('AGENCY')
})
test('delete button removes the selected property from the list', async () => {
  await signIn()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  mount(<MyPropertiesPage />)
  const title = await screen.findByRole('heading', {
    name: 'Departamento de 3 ambientes en Palermo',
  })
  fireEvent.click(within(title.closest('section')).getByRole('button', { name: 'Eliminar' }))
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: 'Departamento de 3 ambientes en Palermo' }),
    ).toBeNull(),
  )
  await expect(apiFetch('/api/v1/properties/1')).rejects.toMatchObject({ status: 404 })
})
test('mark read removes card from unread filter and survives reload', async () => {
  await signIn()
  mount(<InquiriesPage />)
  await screen.findByText('Tenés 2 consultas sin leer.')
  fireEvent.click(screen.getByLabelText('Solo sin leer'))
  await screen.findByText('Tenés 2 consultas sin leer.')
  const title = screen.getByRole('heading', { name: 'Sofía Gómez Nueva' })
  fireEvent.click(
    within(title.closest('article')).getByRole('button', { name: 'Marcar como leída' }),
  )
  await screen.findByText('Tenés 1 consulta sin leer.')
  expect(screen.queryByRole('heading', { name: /Sofía Gómez/ })).toBeNull()
  expect((await apiFetch('/api/v1/me/inquiries/1')).readAt).toBeTruthy()
})
test('image upload, replacement and deletion preserve ImageResponse contract', async () => {
  await signIn()
  const form = new FormData()
  form.append('file', new File(['photo'], 'test.png', { type: 'image/png' }))
  const created = await apiFetch('/api/v1/properties/1/images', { method: 'POST', body: form })
  expect(Object.keys(created).sort()).toEqual(['id', 'url', 'createdAt', 'updatedAt'].sort())
  expect(created.url).toMatch(/^data:image\/png/)
  const replaced = await apiFetch(`/api/v1/properties/1/images/${created.id}`, {
    method: 'PATCH',
    body: form,
  })
  expect(replaced.id).toBe(created.id)
  await apiFetch(`/api/v1/properties/1/images/${created.id}`, { method: 'DELETE' })
  expect((await apiFetch('/api/v1/properties/1/images')).some((x) => x.id === created.id)).toBe(
    false,
  )
  const invalid = new FormData()
  invalid.append('file', new File(['bad'], 'test.txt', { type: 'text/plain' }))
  await expect(
    apiFetch('/api/v1/properties/1/images', { method: 'POST', body: invalid }),
  ).rejects.toMatchObject({ status: 400 })
})
test('profile edits persist and password change rejects wrong current password', async () => {
  await signIn()
  await apiFetch('/api/v1/me', { method: 'PATCH', body: { name: 'Nombre editado' } })
  expect((await apiFetch('/api/v1/me')).name).toBe('Nombre editado')
  await expect(
    apiFetch('/api/v1/me', {
      method: 'PATCH',
      body: { currentPassword: 'incorrecta', newPassword: 'password123' },
    }),
  ).rejects.toMatchObject({ status: 403 })
  await apiFetch('/api/v1/me', {
    method: 'PATCH',
    body: { currentPassword: '12345678', newPassword: 'password123' },
  })
  await apiFetch('/api/v1/auth/logout', { method: 'POST' })
  expect(
    (
      await apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: { email: 'lime@test.com', password: 'password123' },
      })
    ).user.name,
  ).toBe('Nombre editado')
})
