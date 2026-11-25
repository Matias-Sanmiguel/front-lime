import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useState } from 'react'
import { readFile } from 'node:fs/promises'
import { webcrypto } from 'node:crypto'
import { AuthProvider, useAuth } from '../src/auth/AuthContext.jsx'
import { apiFetch, setUnauthorizedHandler } from '../src/api/client.js'
import { addPropertyImage, replacePropertyImage } from '../src/api/properties.js'
import PropertyImages from '../src/panel/PropertyImages.jsx'

// Espías que igualmente llaman a la implementación real: sirven para comprobar que un
// archivo inválido ni siquiera genera el request.
vi.mock('../src/api/properties.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    addPropertyImage: vi.fn(actual.addPropertyImage),
    replacePropertyImage: vi.fn(actual.replacePropertyImage),
  }
})

const MAX = 5 * 1024 * 1024

beforeEach(() => {
  sessionStorage.clear()
  addPropertyImage.mockClear()
  replacePropertyImage.mockClear()
  vi.stubGlobal('crypto', webcrypto)
  vi.stubGlobal('fetch', async (path) => ({
    ok: true,
    json: async () => JSON.parse(await readFile(`${process.cwd()}/public${path}`, 'utf8')),
  }))
})
afterEach(() => {
  cleanup()
  setUnauthorizedHandler(null)
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
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

async function mountPhotos() {
  await signIn()
  const initial = await apiFetch('/api/v1/properties/1/images')
  function Photos() {
    const [images, setImages] = useState(initial)
    return (
      <PropertyImages propertyId={1} images={images} setImages={setImages} onForbidden={vi.fn()} />
    )
  }
  const view = mount(<Photos />)
  return {
    initial,
    addInput: view.container.querySelector('input[type="file"][multiple]'),
    replaceInput: view.container.querySelector('input[type="file"]:not([multiple])'),
  }
}
const file = (name, type, content = 'x') => new File([content], name, { type })

test('un archivo que no es JPG, PNG o WEBP no se sube y se avisa', async () => {
  const { initial, addInput } = await mountPhotos()
  fireEvent.change(addInput, { target: { files: [file('nota.txt', 'text/plain', 'hola')] } })
  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toContain('nota.txt')
  expect(alert.textContent).toContain('JPG, PNG o WEBP')
  expect(addPropertyImage).not.toHaveBeenCalled()
  expect(await apiFetch('/api/v1/properties/1/images')).toHaveLength(initial.length)
})

test('un archivo de más de 5 MB no se sube y se avisa', async () => {
  const { addInput } = await mountPhotos()
  const big = new File([new Uint8Array(MAX + 1)], 'grande.png', { type: 'image/png' })
  fireEvent.change(addInput, { target: { files: [big] } })
  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toContain('grande.png')
  expect(alert.textContent).toContain('5 MB')
  expect(addPropertyImage).not.toHaveBeenCalled()
})

test('un archivo vacío no se sube', async () => {
  const { addInput } = await mountPhotos()
  fireEvent.change(addInput, { target: { files: [file('vacio.png', 'image/png', '')] } })
  expect((await screen.findByRole('alert')).textContent).toContain('vacío')
  expect(addPropertyImage).not.toHaveBeenCalled()
})

test('una foto válida sigue subiéndose', async () => {
  const { initial, addInput } = await mountPhotos()
  fireEvent.change(addInput, { target: { files: [file('ok.png', 'image/png')] } })
  await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(initial.length + 1))
  expect(addPropertyImage).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole('alert')).toBeNull()
})

test('con varias fotos se suben las válidas y se informan las inválidas', async () => {
  const { initial, addInput } = await mountPhotos()
  fireEvent.change(addInput, {
    target: { files: [file('ok.png', 'image/png'), file('nota.txt', 'text/plain', 'hola')] },
  })
  await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(initial.length + 1))
  expect(addPropertyImage).toHaveBeenCalledTimes(1)
  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toContain('nota.txt')
  expect(alert.textContent).not.toContain('ok.png')
})

test('reemplazar con un archivo inválido no genera el request', async () => {
  const { replaceInput } = await mountPhotos()
  fireEvent.click(screen.getAllByRole('button', { name: 'Reemplazar' })[0])
  fireEvent.change(replaceInput, { target: { files: [file('nota.txt', 'text/plain', 'hola')] } })
  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toContain('No se pudo reemplazar la foto')
  expect(alert.textContent).toContain('JPG, PNG o WEBP')
  expect(replacePropertyImage).not.toHaveBeenCalled()
})

test('un 401 con sesión abierta cierra la sesión', async () => {
  vi.stubEnv('VITE_USE_MOCK', 'false')
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Iniciá sesión para continuar' }),
    })),
  )
  function Probe() {
    const { isAuthenticated, login } = useAuth()
    return (
      <>
        <p>{isAuthenticated ? 'con sesión' : 'sin sesión'}</p>
        <button onClick={() => login('token-vencido', { id: 1, name: 'Lola' })}>entrar</button>
      </>
    )
  }
  mount(<Probe />)
  fireEvent.click(screen.getByRole('button', { name: 'entrar' }))
  await screen.findByText('con sesión')

  await expect(apiFetch('/api/v1/me')).rejects.toMatchObject({ status: 401 })

  await screen.findByText('sin sesión')
  expect(sessionStorage.getItem('lime.session')).toBeNull()
})

test('un 401 sin token (login fallido) no toca la sesión', async () => {
  vi.stubEnv('VITE_USE_MOCK', 'false')
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Email o contraseña incorrectos' }),
    })),
  )
  const handler = vi.fn()
  setUnauthorizedHandler(handler)
  await expect(
    apiFetch('/api/v1/auth/login', { method: 'POST', body: { email: 'x', password: 'y' } }),
  ).rejects.toMatchObject({ status: 401 })
  expect(handler).not.toHaveBeenCalled()
})
