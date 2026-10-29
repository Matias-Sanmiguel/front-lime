import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readSearchFilters, searchParamsFor, validateSearch } from '../src/lib/property-search.js'

test('search URL roundtrip preserves zero prices and excludes unknown fields', () => {
  const filters = readSearchFilters(
    new URLSearchParams('city=La+Plata&currency=ARS&minPrice=0&sort=price_asc&unknown=x&page=2'),
  )
  assert.deepEqual(filters, { city: 'La Plata', currency: 'ARS', minPrice: '0', sort: 'price_asc' })
  const params = searchParamsFor(filters)
  assert.equal(params.has('page'), false)
  assert.deepEqual(readSearchFilters(params), filters)
  assert.equal(searchParamsFor({ minPrice: 0 }).get('minPrice'), '0')
})

test('price comparisons require a currency and valid bounds', () => {
  for (const filters of [
    { minPrice: '0' },
    { sort: 'price_asc' },
    { currency: 'EUR' },
    { currency: 'USD', minPrice: '100', maxPrice: '50' },
    { minBedrooms: '1.5' },
    { currency: 'ARS', maxPrice: 'Infinity' },
  ])
    assert.ok(validateSearch(filters))
  assert.equal(
    validateSearch({ currency: 'USD', minPrice: '0', maxPrice: '100', sort: 'price_desc' }),
    null,
  )
  assert.equal(validateSearch({}), null)
})
