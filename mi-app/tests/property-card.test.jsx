import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TestStore } from './TestStore'
import { PropertyCard } from '../src/components/properties/PropertyCard.jsx'

afterEach(cleanup)

test('card labels property facts and recovers from a failed cover image', () => {
  render(
    <TestStore>
      <MemoryRouter>
        <PropertyCard
          property={{
            id: 1,
            title: 'Casa',
            price: 100,
            currency: 'USD',
            bedrooms: 2,
            bathrooms: 1,
            totalArea: 90,
            coverImage: { url: 'https://example.com/image.jpg' },
          }}
        />
      </MemoryRouter>
    </TestStore>,
  )
  expect(screen.getByText('2 dorm.')).toBeTruthy()
  expect(screen.getByText('1 baño')).toBeTruthy()
  expect(screen.getByText('90 m² totales')).toBeTruthy()
  fireEvent.error(screen.getByRole('img'))
  expect(screen.getByText('Foto no disponible')).toBeTruthy()
  expect(screen.getByRole('link').getAttribute('href')).toBe('/propiedad/1')
})
