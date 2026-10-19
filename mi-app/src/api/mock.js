import { ApiError } from './errors.js'

const KEY = 'lime.mock.v1'
let fallback = null
const now = () => new Date().toISOString()
const fail = (status, detail) => {
  throw new ApiError(status, detail)
}
const nextId = (items) => Math.max(0, ...items.map((x) => x.id)) + 1
const emailValid = (value) => /^\S+@\S+\.\S+$/.test(value || '')
async function json(file) {
  const response = await fetch(`/data/${file}.json`)
  if (!response.ok) fail(response.status, 'No se pudieron cargar los datos de demostración')
  return response.json()
}
function save(db) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    fallback = db
  }
}
async function database() {
  if (fallback) return fallback
  let stored
  try {
    stored = sessionStorage.getItem(KEY)
  } catch {
    if (fallback) return fallback
  }
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      /* restaurar semilla */
    }
  }
  const [properties, inquiries, auth] = await Promise.all([
    json('properties'),
    json('inquiries'),
    json('auth'),
  ])
  const images = Object.fromEntries(
    await Promise.all(properties.content.map(async (p) => [p.id, await json(`images-${p.id}`)])),
  )
  return {
    properties: properties.content,
    inquiries: inquiries.content,
    images,
    users: [auth.user],
    passwords: {},
    session: null,
  }
}
function page(items, params) {
  const index = Number(params.get('page') || 0),
    size = Number(params.get('size') || 20)
  if (!Number.isInteger(index) || index < 0 || !Number.isInteger(size) || size < 1 || size > 100)
    fail(400, 'Paginación inválida')
  const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
  return {
    content: sorted.slice(index * size, (index + 1) * size),
    page: index,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
  }
}
function filterProperties(items, params) {
  if (
    params.has('minPrice') &&
    params.has('maxPrice') &&
    Number(params.get('minPrice')) > Number(params.get('maxPrice'))
  )
    fail(400, 'El precio mínimo no puede superar al máximo')
  return items.filter((p) => {
    for (const key of ['city', 'province'])
      if (params.get(key) && !(p[key] || '').toLowerCase().includes(params.get(key).toLowerCase()))
        return false
    for (const key of ['type', 'operation', 'status'])
      if (params.get(key) && p[key] !== params.get(key)) return false
    for (const [key, field] of [
      ['minPrice', 'price'],
      ['minBedrooms', 'bedrooms'],
      ['minBathrooms', 'bathrooms'],
    ])
      if (params.has(key) && p[field] < Number(params.get(key))) return false
    return !params.has('maxPrice') || p.price <= Number(params.get('maxPrice'))
  })
}
const fields =
  'title description type operation price currency address city province bedrooms bathrooms coveredArea totalArea'.split(
    ' ',
  )
function propertyChanges(body) {
  const result = Object.fromEntries(fields.filter((k) => body[k] != null).map((k) => [k, body[k]]))
  for (const k of ['price', 'bedrooms', 'bathrooms', 'coveredArea', 'totalArea'])
    if (result[k] != null && (!Number.isFinite(result[k]) || result[k] < 0))
      fail(400, 'Los valores numéricos deben ser positivos o cero')
  if (result.type && !['APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL', 'OTHER'].includes(result.type))
    fail(400, 'Tipo inválido')
  if (result.operation && !['SALE', 'RENT', 'TEMPORARY_RENT'].includes(result.operation))
    fail(400, 'Operación inválida')
  for (const [key, max] of Object.entries({
    title: 120,
    description: 2000,
    currency: 3,
    address: 200,
    city: 100,
    province: 100,
  }))
    if (result[key]?.length > max) fail(400, `${key}: máximo ${max} caracteres`)
  return result
}
async function digest(password) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}
export async function mockFetch(path, { method = 'GET', body = {} } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const db = await database()
  const [pathname, query = ''] = path.split('?'),
    params = new URLSearchParams(query)
  const user = db.session
  const signed = () => {
    if (!user) fail(401, 'Iniciá sesión para continuar')
    return user
  }
  const agency = () => {
    signed()
    if (!['AGENCY', 'ADMIN'].includes(user.role))
      fail(403, 'Solo las inmobiliarias pueden gestionar avisos')
  }
  const owns = (p) => {
    agency()
    if (p.owner.id !== user.id) fail(403, 'Este aviso pertenece a otra cuenta')
  }
  const finish = (result) => {
    save(db)
    return structuredClone(result)
  }

  if (pathname === '/api/v1/auth/register' && method === 'POST') {
    const role = body.role || 'USER',
      email = body.email?.trim().toLowerCase()
    if (
      !emailValid(email) ||
      email.length > 150 ||
      !body.name?.trim() ||
      body.name.length > 100 ||
      !body.password ||
      body.password.length < 8 ||
      new TextEncoder().encode(body.password).length > 72 ||
      !['USER', 'AGENCY'].includes(role) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.birthDate || '') ||
      !(new Date(body.birthDate) < new Date(now().slice(0, 10))) ||
      !['MALE', 'FEMALE', 'OTHER'].includes(body.sex)
    )
      fail(400, 'Completá los datos obligatorios con valores válidos')
    if (role === 'AGENCY' && !body.agencyName?.trim())
      fail(400, 'Ingresá el nombre de la inmobiliaria')
    if (body.agencyName?.length > 150) fail(400, 'Nombre de inmobiliaria demasiado largo')
    if (db.users.some((u) => u.email === email)) fail(409, 'El email ya está registrado')
    const created = {
      id: nextId([...db.users, ...db.properties.map((p) => p.owner)]),
      email,
      name: body.name.trim(),
      role,
      agencyName: role === 'AGENCY' ? body.agencyName.trim() : null,
    }
    db.users.push(created)
    db.passwords[created.id] = await digest(body.password)
    db.session = created
    return finish({ ...(await json('auth')), user: created })
  }
  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    const found = db.users.find((u) => u.email === body.email?.trim().toLowerCase())
    const valid =
      found &&
      (found.id === 1 && !db.passwords[1]
        ? body.password === '12345678'
        : db.passwords[found.id] === (await digest(body.password || '')))
    if (!valid) fail(401, 'Email o contraseña incorrectos')
    db.session = found
    return finish({ ...(await json('auth')), user: found })
  }
  if (pathname === '/api/v1/auth/logout' && method === 'POST') {
    signed()
    db.session = null
    return finish(null)
  }
  if (pathname === '/api/v1/me') {
    signed()
    if (method === 'GET') return finish(user)
    if (method === 'PATCH') {
      if (body.name != null && !body.name.trim()) fail(400, 'Ingresá tu nombre')
      if (body.newPassword) {
        const valid =
          user.id === 1 && !db.passwords[1]
            ? body.currentPassword === '12345678'
            : db.passwords[user.id] === (await digest(body.currentPassword || ''))
        if (!valid) fail(403, 'La contraseña actual no es correcta')
        if (body.newPassword.length < 8 || new TextEncoder().encode(body.newPassword).length > 72)
          fail(400, 'La contraseña debe tener al menos 8 caracteres y hasta 72 bytes')
        db.passwords[user.id] = await digest(body.newPassword)
      }
      for (const k of ['name', 'agencyName']) if (body[k] != null) user[k] = body[k]
      db.users = db.users.map((u) => (u.id === user.id ? user : u))
      return finish(user)
    }
  }
  if (pathname === '/api/v1/me/properties' && method === 'GET') {
    signed()
    return finish(
      page(
        filterProperties(
          db.properties.filter((p) => p.owner.id === user.id),
          params,
        ),
        params,
      ),
    )
  }
  if (pathname.startsWith('/api/v1/me/inquiries')) {
    signed()
    const own = db.inquiries.filter((i) =>
      db.properties.some((p) => p.id === i.propertyId && p.owner.id === user.id),
    )
    if (pathname === '/api/v1/me/inquiries' && method === 'GET') {
      if (
        params.get('propertyId') &&
        !db.properties.some(
          (p) => p.id === Number(params.get('propertyId')) && p.owner.id === user.id,
        )
      )
        fail(404, 'Aviso no encontrado')
      const filtered = own.filter(
        (i) =>
          (params.get('unreadOnly') !== 'true' || !i.readAt) &&
          (!params.get('propertyId') || i.propertyId === Number(params.get('propertyId'))),
      )
      return finish({ ...page(filtered, params), unreadCount: own.filter((i) => !i.readAt).length })
    }
    const item = own.find((i) => String(i.id) === pathname.split('/').at(-1))
    if (!item) fail(404, 'Consulta no encontrada')
    if (method === 'GET') return finish(item)
    if (method === 'PATCH') {
      if (body.read !== true) fail(400, 'Solo se puede marcar como leída')
      item.readAt ||= now()
      return finish(item)
    }
  }
  if (pathname === '/api/v1/properties') {
    if (method === 'GET') {
      params.delete('status')
      return finish(
        page(
          filterProperties(
            db.properties.filter((p) => p.status === 'PUBLISHED'),
            params,
          ),
          params,
        ),
      )
    }
    if (method === 'POST') {
      agency()
      const { id, name, role, agencyName } = user
      const p = {
        id: nextId(db.properties),
        ...Object.fromEntries(fields.map((k) => [k, null])),
        ...propertyChanges(body),
        status: 'DRAFT',
        owner: { id, name, role, agencyName },
        createdAt: now(),
        updatedAt: now(),
      }
      db.properties.push(p)
      db.images[p.id] = []
      return finish(p)
    }
  }
  const match = pathname.match(
    /^\/api\/v1\/properties\/(\d+)(?:\/(images|inquiries|publish|pause))?(?:\/(\d+))?$/,
  )
  if (match) {
    const [, id, sub, imageId] = match,
      p = db.properties.find((p) => String(p.id) === id)
    if (!p) fail(404, 'Aviso no encontrado')
    if (sub === 'inquiries' && method === 'POST') {
      if (p.status !== 'PUBLISHED') fail(409, 'El aviso no está publicado')
      if (
        !body.name?.trim() ||
        body.name.length > 100 ||
        !emailValid(body.email) ||
        body.email.length > 150 ||
        !body.message?.trim() ||
        body.message.length > 1000 ||
        body.phone?.length > 30
      )
        fail(400, 'Revisá los datos de la consulta')
      const item = {
        id: nextId(db.inquiries),
        propertyId: p.id,
        propertyTitle: p.title,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message,
        createdAt: now(),
        readAt: null,
      }
      db.inquiries.push(item)
      return finish(item)
    }
    if (method === 'GET') {
      if (p.status !== 'PUBLISHED' && p.owner.id !== user?.id) fail(404, 'Aviso no encontrado')
      if (!sub) return finish(p)
      if (sub === 'images' && !imageId) return finish(db.images[id] || [])
    }
    owns(p)
    if (!sub && method === 'PATCH') {
      Object.assign(p, propertyChanges(body), { updatedAt: now() })
      return finish(p)
    }
    if (!sub && method === 'DELETE') {
      db.properties = db.properties.filter((x) => x !== p)
      return finish(null)
    }
    if (sub === 'publish' && method === 'POST') {
      if (
        ['title', 'currency', 'city', 'type', 'operation'].some((k) => !p[k]?.trim()) ||
        p.price == null
      )
        fail(400, 'Completá título, precio, moneda, ciudad, tipo y operación')
      p.status = 'PUBLISHED'
      p.updatedAt = now()
      return finish(p)
    }
    if (sub === 'pause' && method === 'POST') {
      if (p.status !== 'PUBLISHED') fail(409, 'Solo podés pausar un aviso publicado')
      p.status = 'PAUSED'
      p.updatedAt = now()
      return finish(p)
    }
    if (sub === 'images') {
      const photos = (db.images[id] ||= []),
        existing = photos.find((x) => String(x.id) === imageId)
      if (imageId && !existing) fail(404, 'Foto no encontrada')
      if (method === 'DELETE' && existing) {
        db.images[id] = photos.filter((x) => x !== existing)
        return finish(null)
      }
      if ((method === 'POST' && !imageId) || (method === 'PATCH' && existing)) {
        const file = body.get?.('file')
        if (
          !file ||
          !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
          file.size > 5 * 1024 * 1024
        )
          fail(400, 'Usá una foto JPG, PNG o WEBP de hasta 5 MB')
        const url = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new ApiError(400, 'No se pudo leer la foto'))
          reader.readAsDataURL(file)
        })
        const img = existing || { id: nextId(photos), createdAt: now() }
        Object.assign(img, { url, updatedAt: now() })
        if (!existing) photos.push(img)
        return finish(img)
      }
    }
  }
  fail(404, `Operación no disponible: ${method} ${pathname}`)
}
