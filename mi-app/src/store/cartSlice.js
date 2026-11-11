import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '@/api/errors.js'
import { addCartItem, deleteCartItem, getCartItems } from '@/api/cart'

export const ALREADY_IN_CART = 'Ya está en tu carrito'

// GET /api/v1/me/cart/items: la fuente de verdad es el backend, así que el
// estado se rehidrata desde ahí (por ejemplo al recargar la página).
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await getCartItems()
  return Array.isArray(response) ? response : (response?.content ?? [])
})

// POST /api/v1/me/cart/items: crea la fila en la base y devuelve el CartItemResponse.
// createAsyncThunk solo serializa name/message del error (no el status), por eso
// el 409 de duplicado se traduce acá a su mensaje para la UI.
export const addToCart = createAsyncThunk('cart/addToCart', async (propertyId) => {
  try {
    return await addCartItem(propertyId)
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) throw new Error(ALREADY_IN_CART)
    throw error
  }
})

// DELETE /api/v1/me/cart/items/{id}: devuelve el id para quitarlo del estado.
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId) => {
  await deleteCartItem(itemId)
  return itemId
})

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

const start = (state) => {
  state.status = 'loading'
  state.error = null
}
const fail = (state, action) => {
  state.status = 'failed'
  state.error = action.error.message ?? 'No pudimos completar la operación'
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Al cerrar sesión no debe quedar el carrito del usuario anterior.
    clearCart() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, start)
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCart.rejected, fail)
      .addCase(addToCart.pending, start)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (!state.items.some((item) => item.id === action.payload.id)) {
          state.items.push(action.payload)
        }
      })
      .addCase(addToCart.rejected, fail)
      .addCase(removeFromCart.pending, start)
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(removeFromCart.rejected, fail)
  },
})

export const { clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.length
export const selectIsInCart = (propertyId) => (state) =>
  state.cart.items.some((item) => item.propertyId === propertyId)

export default cartSlice.reducer
