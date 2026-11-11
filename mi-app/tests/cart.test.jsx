import { beforeEach, expect, test, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { ApiError } from '../src/api/errors.js'
import { addCartItem, deleteCartItem, getCartItems } from '../src/api/cart'
import reducer, {
  addToCart,
  clearCart,
  fetchCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectIsInCart,
} from '../src/store/cartSlice'

vi.mock('../src/api/cart', () => ({
  getCartItems: vi.fn(),
  addCartItem: vi.fn(),
  deleteCartItem: vi.fn(),
}))

const item = {
  id: 3,
  propertyId: 7,
  propertyTitle: 'Casa con patio',
  createdAt: '2026-11-11T12:00:00Z',
}
const other = { id: 4, propertyId: 9, propertyTitle: 'Cabaña', createdAt: '2026-11-11T12:05:00Z' }
const makeStore = () => configureStore({ reducer: { cart: reducer } })
beforeEach(() => vi.clearAllMocks())

test('reducer de addToCart: pending, fulfilled y rejected', () => {
  let state = reducer(undefined, { type: 'init' })
  expect(state).toEqual({ items: [], status: 'idle', error: null })

  state = reducer(state, addToCart.pending('req-1', 7))
  expect(state).toMatchObject({ status: 'loading', error: null })

  state = reducer(state, addToCart.fulfilled(item, 'req-1', 7))
  expect(state).toEqual({ items: [item], status: 'succeeded', error: null })

  state = reducer(state, addToCart.rejected(new Error('Ya está en tu carrito'), 'req-2', 7))
  expect(state).toMatchObject({ status: 'failed', error: 'Ya está en tu carrito' })
  expect(state.items).toEqual([item])

  // Un nuevo intento limpia el error anterior.
  state = reducer(state, addToCart.pending('req-3', 9))
  expect(state).toMatchObject({ status: 'loading', error: null })
})

test('reducer: addToCart no duplica ítems; fetchCart y removeFromCart reflejan la base', () => {
  let state = reducer(undefined, addToCart.fulfilled(item, 'r1', 7))
  state = reducer(state, addToCart.fulfilled(item, 'r2', 7))
  expect(state.items).toEqual([item])

  state = reducer(state, fetchCart.pending('r3'))
  expect(state.status).toBe('loading')
  state = reducer(state, fetchCart.fulfilled([item, other], 'r3'))
  expect(state).toMatchObject({ status: 'succeeded', items: [item, other] })
  state = reducer(state, fetchCart.rejected(new Error('offline'), 'r4'))
  expect(state).toMatchObject({ status: 'failed', error: 'offline' })

  state = reducer(state, removeFromCart.pending('r5', 3))
  expect(state.status).toBe('loading')
  state = reducer(state, removeFromCart.fulfilled(3, 'r5', 3))
  expect(state).toMatchObject({ status: 'succeeded', items: [other] })
  state = reducer(state, removeFromCart.rejected(new Error('boom'), 'r6', 4))
  expect(state).toMatchObject({ status: 'failed', error: 'boom', items: [other] })

  expect(reducer(state, clearCart())).toEqual({ items: [], status: 'idle', error: null })
})

test('selectores: items, cantidad y pertenencia por propertyId', () => {
  const state = { cart: { items: [item, other], status: 'idle', error: null } }
  expect(selectCartItems(state)).toEqual([item, other])
  expect(selectCartCount(state)).toBe(2)
  expect(selectIsInCart(7)(state)).toBe(true)
  expect(selectIsInCart(8)(state)).toBe(false)
})

test('addToCart llama al endpoint con el propertyId y guarda el ítem devuelto', async () => {
  vi.mocked(addCartItem).mockResolvedValue(item)
  const store = makeStore()
  await store.dispatch(addToCart(7))
  expect(addCartItem).toHaveBeenCalledWith(7)
  expect(store.getState().cart).toEqual({ items: [item], status: 'succeeded', error: null })
})

test('addToCart traduce el 409 a "Ya está en tu carrito" y guarda otros errores tal cual', async () => {
  const store = makeStore()
  vi.mocked(addCartItem).mockRejectedValueOnce(
    new ApiError(409, 'La propiedad ya está en tu carrito'),
  )
  const duplicate = await store.dispatch(addToCart(7))
  expect(duplicate.meta.requestStatus).toBe('rejected')
  expect(duplicate.error.message).toBe('Ya está en tu carrito')
  expect(store.getState().cart).toMatchObject({ status: 'failed', error: 'Ya está en tu carrito' })

  vi.mocked(addCartItem).mockRejectedValueOnce(new ApiError(404, 'Aviso no encontrado'))
  await store.dispatch(addToCart(99))
  expect(store.getState().cart.error).toBe('Aviso no encontrado')
})

test('fetchCart acepta lista o página y removeFromCart quita el ítem borrado en la base', async () => {
  const store = makeStore()
  vi.mocked(getCartItems).mockResolvedValueOnce([item, other])
  await store.dispatch(fetchCart())
  expect(selectCartItems(store.getState())).toEqual([item, other])

  vi.mocked(getCartItems).mockResolvedValueOnce({ content: [other] })
  await store.dispatch(fetchCart())
  expect(selectCartItems(store.getState())).toEqual([other])

  vi.mocked(getCartItems).mockResolvedValueOnce([item, other])
  await store.dispatch(fetchCart())
  vi.mocked(deleteCartItem).mockResolvedValueOnce(null)
  await store.dispatch(removeFromCart(3))
  expect(deleteCartItem).toHaveBeenCalledWith(3)
  expect(selectCartItems(store.getState())).toEqual([other])
})
