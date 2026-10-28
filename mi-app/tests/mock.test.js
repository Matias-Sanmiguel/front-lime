import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { apiFetch } from '../src/api/client.js'

globalThis.fetch = async (path) => ({
  ok: true,
  json: async () =>
    JSON.parse(await readFile(new URL(`../public${path}`, import.meta.url), 'utf8')),
})
const values = new Map()
globalThis.sessionStorage = {
  getItem: (k) => values.get(k) ?? null,
  setItem: (k, v) => values.set(k, v),
  removeItem: (k) => values.delete(k),
}
beforeEach(() => values.clear())
const login = () =>
  apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: { email: 'lime@test.com', password: '12345678' },
  })

test('public price filtering requires a currency and sorting happens before pagination', async () => {
  await assert.rejects(apiFetch('/api/v1/properties?minPrice=0'), { status: 400 })
  await assert.rejects(apiFetch('/api/v1/properties?sort=price_asc'), { status: 400 })
  await assert.rejects(apiFetch('/api/v1/properties?currency=EUR'), { status: 400 })
  const all = await apiFetch('/api/v1/properties?currency=USD&sort=price_asc')
  assert.ok(all.content.length > 1)
  assert.ok(all.content.every((property) => property.currency === 'USD'))
  assert.deepEqual(
    all.content.map((property) => property.price),
    all.content.map((property) => property.price).sort((first, second) => first - second),
  )
  const secondPage = await apiFetch('/api/v1/properties?currency=USD&sort=price_asc&size=1&page=1')
  assert.equal(secondPage.content[0].id, all.content[1].id)
  const descending = await apiFetch('/api/v1/properties?currency=USD&sort=price_desc&size=1')
  assert.equal(descending.content[0].price, all.content.at(-1).price)
})

test('PropertyResponse has exactly the Java DTO fields, with full gallery separate', async () => {
  const p = await apiFetch('/api/v1/properties/1')
  assert.deepEqual(
    Object.keys(p).sort(),
    'id title description type operation price currency address city province bedrooms bathrooms coveredArea totalArea status owner createdAt updatedAt coverImage'
      .split(' ')
      .sort(),
  )
  assert.match(p.createdAt, /Z$/)
  assert.equal(p.coverImage, null)
  const photos = await apiFetch('/api/v1/properties/1/images')
  assert.deepEqual(Object.keys(photos[0]).sort(), ['id', 'url', 'createdAt', 'updatedAt'].sort())
})

test('public listings include the first image and null for an ad without images', async () => {
  const list = await apiFetch('/api/v1/properties')
  const photos = await apiFetch('/api/v1/properties/1/images')
  assert.deepEqual(list.content.find((property) => property.id === 1).coverImage, photos[0])
  await login()
  const created = await apiFetch('/api/v1/properties', {
    method: 'POST',
    body: {
      title: 'Sin fotos',
      currency: 'USD',
      price: 10,
      city: 'CABA',
      type: 'HOUSE',
      operation: 'SALE',
    },
  })
  await apiFetch(`/api/v1/properties/${created.id}/publish`, { method: 'POST' })
  const updated = await apiFetch('/api/v1/properties')
  assert.equal(updated.content.find((property) => property.id === created.id).coverImage, null)
})
test('inbox supports filters, pagination and idempotent marking as read', async () => {
  await login()
  const inbox = await apiFetch('/api/v1/me/inquiries?unreadOnly=true&size=1')
  assert.equal(inbox.content.length, 1)
  assert.ok(inbox.unreadCount >= 2)
  const id = inbox.content[0].id
  const read = await apiFetch(`/api/v1/me/inquiries/${id}`, {
    method: 'PATCH',
    body: { read: true },
  })
  assert.ok(read.readAt)
  const again = await apiFetch(`/api/v1/me/inquiries/${id}`, {
    method: 'PATCH',
    body: { read: true },
  })
  assert.equal(read.readAt, again.readAt)
  const after = await apiFetch('/api/v1/me/inquiries?unreadOnly=true')
  assert.equal(after.unreadCount, inbox.unreadCount - 1)
  assert.ok(!after.content.some((x) => x.id === id))
})
test('creates, edits, publishes, pauses and deletes a draft across reads', async () => {
  await login()
  const draft = await apiFetch('/api/v1/properties', {
    method: 'POST',
    body: {
      title: 'Prueba',
      type: 'HOUSE',
      operation: 'SALE',
      price: 100,
      currency: 'USD',
      city: 'CABA',
    },
  })
  assert.equal(draft.status, 'DRAFT')
  await apiFetch(`/api/v1/properties/${draft.id}`, { method: 'PATCH', body: { title: 'Editado' } })
  assert.equal((await apiFetch(`/api/v1/properties/${draft.id}`)).title, 'Editado')
  assert.equal(
    (await apiFetch(`/api/v1/properties/${draft.id}/publish`, { method: 'POST' })).status,
    'PUBLISHED',
  )
  assert.equal(
    (await apiFetch(`/api/v1/properties/${draft.id}/pause`, { method: 'POST' })).status,
    'PAUSED',
  )
  await apiFetch(`/api/v1/properties/${draft.id}`, { method: 'DELETE' })
  await assert.rejects(apiFetch(`/api/v1/properties/${draft.id}`), { status: 404 })
})
test('registration requires backend fields and rejects ADMIN', async () => {
  await assert.rejects(
    apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: { email: 'a@example.com', name: 'Ana', password: '12345678' },
    }),
    { status: 400 },
  )
  await assert.rejects(
    apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: {
        email: 'a@example.com',
        name: 'Ana',
        password: '12345678',
        birthDate: '2000-01-01',
        sex: 'OTHER',
        role: 'ADMIN',
      },
    }),
    { status: 400 },
  )
})
test('private endpoints reject anonymous users and hidden properties stay hidden', async () => {
  await assert.rejects(apiFetch('/api/v1/me/inquiries'), { status: 401 })
  await assert.rejects(apiFetch('/api/v1/properties/3'), { status: 404 })
})
test('sending a consultation returns the complete InquiryResponse and appears in inbox', async () => {
  const inquiry = await apiFetch('/api/v1/properties/1/inquiries', {
    method: 'POST',
    body: { name: 'Ana', email: 'ana@example.com', phone: null, message: 'Quiero visitarlo' },
  })
  assert.ok(inquiry.propertyTitle)
  assert.equal(inquiry.readAt, null)
  await login()
  assert.ok((await apiFetch('/api/v1/me/inquiries')).content.some((x) => x.id === inquiry.id))
})
test('registration creates a distinct account, persists login and rejects duplicate emails', async () => {
  const body = {
    name: 'Ana',
    email: 'ana@example.com',
    password: 'password123',
    birthDate: '2000-01-01',
    sex: 'FEMALE',
    role: 'AGENCY',
    agencyName: 'Ana Propiedades',
  }
  const session = await apiFetch('/api/v1/auth/register', { method: 'POST', body })
  assert.notEqual(session.user.id, 1)
  assert.equal((await apiFetch('/api/v1/me/properties')).totalElements, 0)
  await assert.rejects(
    apiFetch('/api/v1/properties/1', { method: 'PATCH', body: { title: 'Ajeno' } }),
    { status: 403 },
  )
  await apiFetch('/api/v1/auth/logout', { method: 'POST' })
  assert.equal(
    (await apiFetch('/api/v1/auth/login', { method: 'POST', body })).user.email,
    body.email,
  )
  await assert.rejects(apiFetch('/api/v1/auth/register', { method: 'POST', body }), { status: 409 })
})
test('parallel consultations are not lost', async () => {
  const before = await login()
  assert.ok(before.token)
  await Promise.all(
    ['Ana', 'Pedro'].map((name) =>
      apiFetch('/api/v1/properties/1/inquiries', {
        method: 'POST',
        body: { name, email: `${name}@example.com`, message: 'Visita' },
      }),
    ),
  )
  const inbox = await apiFetch('/api/v1/me/inquiries')
  assert.equal(inbox.totalElements, 5)
})

test('deleted property IDs are not reused and inquiries never transfer to another owner', async () => {
  await login()
  const created = await apiFetch('/api/v1/properties', {
    method: 'POST',
    body: {
      title: 'Privado',
      type: 'HOUSE',
      operation: 'SALE',
      price: 100,
      currency: 'USD',
      city: 'CABA',
    },
  })
  await apiFetch(`/api/v1/properties/${created.id}/publish`, { method: 'POST' })
  await apiFetch(`/api/v1/properties/${created.id}/inquiries`, {
    method: 'POST',
    body: {
      name: 'Cliente',
      email: 'cliente@example.com',
      message: 'Consulta para el dueño original',
    },
  })
  await apiFetch(`/api/v1/properties/${created.id}`, { method: 'DELETE' })
  await apiFetch('/api/v1/auth/register', {
    method: 'POST',
    body: {
      name: 'Otra agencia',
      email: 'otra@example.com',
      password: 'password123',
      birthDate: '2000-01-01',
      sex: 'OTHER',
      role: 'AGENCY',
      agencyName: 'Otra',
    },
  })
  const next = await apiFetch('/api/v1/properties', {
    method: 'POST',
    body: { title: 'Nuevo dueño' },
  })
  assert.notEqual(next.id, created.id)
  assert.equal((await apiFetch('/api/v1/me/inquiries')).totalElements, 0)
})
