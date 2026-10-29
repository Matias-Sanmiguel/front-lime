import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { readFile } from 'node:fs/promises'
import { Search } from '../src/pages/Search.jsx'
import { TestStore } from './TestStore'

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

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <output aria-label="Dirección actual">{location.search}</output>
      <button onClick={() => navigate(-1)}>Volver</button>
    </>
  )
}

function mount(initial = '/buscar') {
  render(
    <TestStore>
      <MemoryRouter initialEntries={[initial]}>
        <Navigation />
        <Routes>
          <Route path="/buscar" element={<Search />} />
          <Route path="/propiedad/:id" element={<p>Detalle del aviso</p>} />
        </Routes>
      </MemoryRouter>
    </TestStore>,
  )
}

test('search validates currency, applies filters and preserves them after opening an ad and going back', async () => {
  mount()
  await screen.findByText(/propiedades encontradas/)
  fireEvent.change(screen.getByLabelText('Precio mínimo'), { target: { value: '0' } })
  fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
  expect(screen.getByRole('alert').textContent).toContain('Elegí una moneda')
  fireEvent.change(screen.getByLabelText('Moneda'), { target: { value: 'USD' } })
  fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'price_asc' } })
  fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
  await waitFor(() =>
    expect(screen.getByLabelText('Dirección actual').textContent).toContain('sort=price_asc'),
  )
  await screen.findByText(/propiedades encontradas/)
  fireEvent.click(screen.getAllByRole('link')[0])
  expect(screen.getByText('Detalle del aviso')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
  await screen.findByText(/propiedades encontradas/)
  expect(screen.getByLabelText('Moneda').value).toBe('USD')
  expect(screen.getByLabelText('Ordenar por').value).toBe('price_asc')
  fireEvent.click(screen.getByRole('button', { name: 'Quitar Moneda: USD' }))
  await waitFor(() => expect(screen.getByLabelText('Dirección actual').textContent).toBe(''))
})

test('empty search offers a working recovery action', async () => {
  mount('/buscar?city=NoExiste')
  await screen.findByText('No encontramos propiedades')
  fireEvent.click(screen.getByRole('button', { name: 'Ver todas las propiedades' }))
  await screen.findByText(/propiedades encontradas/)
  expect(screen.queryByText('No encontramos propiedades')).toBeNull()
})
