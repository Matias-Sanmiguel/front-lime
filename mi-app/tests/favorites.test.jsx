import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TestStore } from './TestStore'
import { PropertyCard } from '../src/components/properties/PropertyCard'
import { Favorites } from '../src/pages/Favorites'

afterEach(cleanup)

test('favorites retain the list cover and can be removed without opening the property', () => {
  const property = {
    id: 18,
    title: 'Casa nueva',
    price: 100,
    currency: 'USD',
    coverImage: { id: 4, url: '/cover.jpg' },
  }
  render(
    <TestStore>
      <MemoryRouter>
        <PropertyCard property={property} />
        <Favorites />
      </MemoryRouter>
    </TestStore>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Agregar a favoritos' }))
  expect(screen.getAllByRole('img')).toHaveLength(2)
  expect(screen.getAllByRole('img')[1].getAttribute('src')).toBe('/cover.jpg')
  fireEvent.click(screen.getAllByRole('button', { name: 'Quitar de favoritos' })[0])
  expect(screen.getAllByRole('img')).toHaveLength(1)
})
