import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from './favoritesSlice'
import cartReducer from './cartSlice'

const STORAGE_KEY = 'lime.favorites'

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { favorites: { items: JSON.parse(raw) } } : undefined
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    // El carrito no se persiste en localStorage: la fuente es el backend.
    cart: cartReducer,
  },
  preloadedState: loadFavorites(),
})

store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().favorites.items))
  } catch {
  }
})