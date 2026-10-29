import { expect, test, vi } from 'vitest'
vi.mock('../src/api/client', () => ({ apiFetch: vi.fn() }))
import { apiFetch } from '../src/api/client'
import { getProperties } from '../src/api/properties'

test('the listing uses a single request even with multiple properties or absent covers', async () => {
  const page = {
    content: [
      { id: 1, coverImage: { url: '/one.jpg' } },
      { id: 2, coverImage: null },
    ],
    totalElements: 2,
  }
  apiFetch.mockResolvedValueOnce(page)
  expect(await getProperties({ currency: 'USD', sort: 'price_asc' })).toBe(page)
  expect(apiFetch).toHaveBeenCalledTimes(1)
  expect(apiFetch).toHaveBeenCalledWith('/api/v1/properties?currency=USD&sort=price_asc')
})
