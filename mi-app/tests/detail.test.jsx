import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PropertyDetail } from '../src/pages/PropertyDetail'
import { PropertyGallery } from '../src/components/properties/PropertyGallery'
import { getProperty, getPropertyImages } from '../src/api/properties'
import { createInquiry } from '../src/api/inquiries'

vi.mock('../src/api/properties', () => ({
  getProperty: vi.fn(),
  getPropertyImages: vi.fn(),
  imageUrl: (image) => image.url,
}))
vi.mock('../src/api/inquiries', () => ({ createInquiry: vi.fn() }))
const property = {
  id: 7,
  title: 'Casa con patio',
  description: 'Una casa luminosa.',
  operation: 'SALE',
  type: 'HOUSE',
  price: 120000,
  currency: 'USD',
  address: 'Calle 123',
  city: 'Buenos Aires',
  province: 'Buenos Aires',
  bedrooms: 2,
  bathrooms: 1,
  coveredArea: 80,
  totalArea: 100,
}
const images = [
  { id: 1, url: '/one.jpg' },
  { id: 2, url: '/two.jpg' },
]
beforeEach(() => {
  vi.mocked(getProperty).mockResolvedValue(property)
  vi.mocked(getPropertyImages).mockResolvedValue(images)
  vi.mocked(createInquiry).mockResolvedValue({})
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function () {
      this.open = true
    },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function () {
      this.open = false
      this.dispatchEvent(new Event('close'))
    },
  })
})
afterEach(() => {
  cleanup()
  delete HTMLDialogElement.prototype.showModal
  delete HTMLDialogElement.prototype.close
  vi.restoreAllMocks()
  vi.clearAllMocks()
})
const mountDetail = (state) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/propiedad/7', state }]}>
      <Routes>
        <Route path="/propiedad/:id" element={<PropertyDetail />} />
      </Routes>
    </MemoryRouter>,
  )

test('detail return link preserves the original filters and page', async () => {
  const search = '/buscar?currency=USD&sort=price_asc&page=1'
  mountDetail({ search })
  await screen.findByRole('heading', { name: property.title })
  expect(screen.getByRole('link', { name: 'Volver a resultados' }).getAttribute('href')).toBe(
    search,
  )
})

test('gallery wraps images, opens full photo and restores focus on close', () => {
  render(<PropertyGallery images={images} title="Casa" />)
  fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }))
  expect(screen.getByAltText('Casa, foto 2').getAttribute('src')).toBe('/two.jpg')
  const opener = screen.getByRole('button', { name: 'Ampliar foto' })
  fireEvent.click(opener)
  const dialog = screen.getByRole('dialog', { name: 'Fotos de Casa' })
  expect(within(dialog).getByAltText('Casa, foto ampliada 2').className).toContain('object-contain')
  fireEvent.click(within(dialog).getByRole('button', { name: 'Foto ampliada siguiente' }))
  expect(within(dialog).getByText('Foto 1 de 2')).toBeTruthy()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Cerrar fotos' }))
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(document.activeElement).toBe(opener)
})

test('failed photos do not block inquiries, and photo retry does not refetch the property', async () => {
  vi.mocked(getPropertyImages).mockRejectedValueOnce(new Error('offline'))
  mountDetail()
  await screen.findByText('No pudimos cargar las fotos. Podés consultar por el aviso igualmente.')
  expect(screen.getByRole('heading', { name: property.title })).toBeTruthy()
  const link = screen.getByRole('link', { name: 'Consultar por esta propiedad' })
  expect(link.getAttribute('href')).toBe('#consulta')
  expect(document.querySelectorAll('#consulta form')).toHaveLength(1)
  for (const [label, value] of [
    ['Nombre', 'Ana'],
    ['Email', 'ana@example.com'],
    ['Mensaje', 'Quiero visitar la casa'],
  ]) {
    fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } })
  }
  fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
  await waitFor(() =>
    expect(createInquiry).toHaveBeenCalledWith(7, {
      name: 'Ana',
      email: 'ana@example.com',
      phone: null,
      message: 'Quiero visitar la casa',
    }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar fotos' }))
  await screen.findByRole('button', { name: 'Ampliar foto' })
  expect(getProperty).toHaveBeenCalledTimes(1)
  expect(getPropertyImages).toHaveBeenCalledTimes(2)
})
