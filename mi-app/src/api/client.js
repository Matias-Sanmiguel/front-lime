
export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

async function readJson(file) {
  const response = await fetch(`/data/${file}`)
  if (!response.ok) throw new ApiError(response.status, `No se pudo leer /data/${file}`)
  return response.json()
}

function filterProperties(all, params) {
  const text = (key) => (params.get(key) || '').toLowerCase()
  const num = (key) => (params.get(key) ? Number(params.get(key)) : null)

  return all.filter((p) => {
    if (p.status !== 'PUBLISHED') return false
    if (text('city') && !p.city.toLowerCase().includes(text('city'))) return false
    if (text('province') && !p.province.toLowerCase().includes(text('province'))) return false
    if (params.get('type') && p.type !== params.get('type')) return false
    if (params.get('operation') && p.operation !== params.get('operation')) return false
    if (num('minPrice') != null && p.price < num('minPrice')) return false
    if (num('maxPrice') != null && p.price > num('maxPrice')) return false
    if (num('minBedrooms') != null && p.bedrooms < num('minBedrooms')) return false
    if (num('minBathrooms') != null && p.bathrooms < num('minBathrooms')) return false
    return true
  })
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  await wait()
  const [pathname, query = ''] = path.split('?')
  const params = new URLSearchParams(query)

  // POST /api/v1/auth/login: cualquier email, contraseña 12345678
  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    if (!body?.email || !body?.password) throw new ApiError(400, 'Email y contraseña son obligatorios')
    if (body.password !== '12345678') throw new ApiError(401, 'Credenciales inválidas')
    return readJson('auth.json')
  }

  // POST /api/v1/auth/register
  if (pathname === '/api/v1/auth/register' && method === 'POST') {
    const session = await readJson('auth.json')
    return {
      ...session,
      user: {
        ...session.user,
        email: body.email,
        name: body.name,
        role: body.role ?? 'USER',
        agencyName: body.agencyName ?? null,
      },
    }
  }

  // POST /api/v1/auth/logout
  if (pathname === '/api/v1/auth/logout' && method === 'POST') return null

  // GET /api/v1/me/properties: los avisos del usuario logueado (cualquier estado)
  if (pathname === '/api/v1/me/properties' && method === 'GET') {
    const data = await readJson('properties.json')
    const mine = data.content.filter((p) => p.owner.id === 1)
    return { content: mine, page: 0, size: 20, totalElements: mine.length, totalPages: 1 }
  }

  // GET /api/v1/me
  if (pathname === '/api/v1/me' && method === 'GET') return readJson('me.json')

  // GET /api/v1/properties (lista paginada)
  if (pathname === '/api/v1/properties' && method === 'GET') {
    const data = await readJson('properties.json')
    const filtered = filterProperties(data.content, params)
    const page = Number(params.get('page') || 0)
    const size = Number(params.get('size') || 20)
    return {
      content: filtered.slice(page * size, page * size + size),
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
    }
  }

  // /api/v1/properties/{id}[/images | /inquiries | /publish | /pause]
  const match = pathname.match(/^\/api\/v1\/properties\/(\d+)(?:\/(\w+))?(?:\/(\d+))?$/)
  if (match) {
    const [, id, sub] = match
    const data = await readJson('properties.json')
    const property = data.content.find((p) => String(p.id) === id)
    if (!property) throw new ApiError(404, 'Property not found')

    if (!sub && method === 'GET') return property
    if (!sub && method === 'PATCH') return { ...property, ...body }
    if (sub === 'images' && method === 'GET') return property.images ?? []
    if (sub === 'publish') return { ...property, status: 'PUBLISHED' }
    if (sub === 'pause') return { ...property, status: 'PAUSED' }

    if (sub === 'inquiries' && method === 'POST') {
      // Igual que el backend: aviso que no está PUBLISHED => 409 Conflict.
      if (property.status !== 'PUBLISHED') {
        throw new ApiError(409, 'Property is not published, cannot receive inquiries')
      }
      return { id: Date.now(), propertyId: property.id, ...body, createdAt: new Date().toISOString() }
    }
  }

  throw new ApiError(404, `Endpoint no mockeado: ${method} ${pathname}`)
}