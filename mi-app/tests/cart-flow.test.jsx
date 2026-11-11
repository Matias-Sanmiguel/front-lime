import { useEffect, useState } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { readFile } from 'node:fs/promises'
import { AuthProvider, useAuth } from '../src/auth/AuthContext.jsx'
import { PropertyDetail } from '../src/pages/PropertyDetail'
import { CartSync } from '../src/components/cart/CartSync'
import { CartCounter } from '../src/components/cart/CartCounter'
import { apiFetch } from '../src/api/client.js'
import { TestStore } from './TestStore'

const TITLE = 'Departamento de 3 ambientes en Palermo' // aviso 1, PUBLISHED en la semilla

beforeEach(() => {
  sessionStorage.clear()
  vi.stubGlobal('fetch', async (path) => ({
    ok: true,
    json: async () => JSON.parse(await readFile(`${process.cwd()}/public${path}`, 'utf8')),
  }))
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

const loginApi = () =>
  apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: { email: 'lime@test.com', password: '12345678' },
  })

// Inicia sesión contra el mock y la registra en el AuthContext antes de mostrar el detalle.
function SignedIn({ children }) {
  const { login, logout } = useAuth()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let active = true
    loginApi().then((session) => {
      if (!active) return
      login(session.token, session.user)
      setReady(true)
    })
    return () => {
      active = false
      logout()
    }
  }, [login, logout])
  return ready ? children : null
}

const mount = (page) =>
  render(
    <TestStore>
      <AuthProvider>
        <MemoryRouter initialEntries={['/propiedad/1']}>
          <Routes>
            <Route path="/propiedad/:id" element={page} />
            <Route path="/login" element={<p>Pantalla de login</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </TestStore>,
  )

test('sin sesión, "Agregar al carrito" lleva a /login', async () => {
  mount(<PropertyDetail />)
  await screen.findByRole('heading', { name: TITLE })
  fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
  await screen.findByText('Pantalla de login')
})

test('agregar desde el detalle crea la fila en la base, marca "En tu carrito" y suma al contador', async () => {
  mount(
    <SignedIn>
      <CartSync />
      <CartCounter />
      <PropertyDetail />
    </SignedIn>,
  )
  await screen.findByRole('heading', { name: TITLE })
  fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

  const done = await screen.findByRole('button', { name: 'En tu carrito' })
  expect(done.hasAttribute('disabled')).toBe(true)
  expect(screen.getByLabelText('1 propiedad en tu carrito')).toBeTruthy()
  // La fila existe en la "base" (mock): GET /me/cart/items la devuelve.
  const rows = await apiFetch('/api/v1/me/cart/items')
  expect(rows).toHaveLength(1)
  expect(rows[0]).toMatchObject({ propertyId: 1, propertyTitle: TITLE })
})

test('si ya estaba en la base, el 409 se muestra como "Ya está en tu carrito"', async () => {
  await loginApi()
  await apiFetch('/api/v1/me/cart/items', { method: 'POST', body: { propertyId: 1 } })
  // Sin CartSync el estado local no lo sabe: fuerza el camino del 409.
  mount(
    <SignedIn>
      <PropertyDetail />
    </SignedIn>,
  )
  await screen.findByRole('heading', { name: TITLE })
  fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toBe('Ya está en tu carrito')
  expect(await apiFetch('/api/v1/me/cart/items')).toHaveLength(1)
})

test('al recargar con la sesión abierta, el carrito se carga desde la base', async () => {
  await loginApi()
  await apiFetch('/api/v1/me/cart/items', { method: 'POST', body: { propertyId: 1 } })
  // Store nuevo = página recargada: el estado sale de GET /me/cart/items.
  mount(
    <SignedIn>
      <CartSync />
      <CartCounter />
      <PropertyDetail />
    </SignedIn>,
  )
  await screen.findByRole('button', { name: 'En tu carrito' })
  expect(screen.getByLabelText('1 propiedad en tu carrito')).toBeTruthy()
})
