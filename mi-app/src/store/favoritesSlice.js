import { createSlice } from '@reduxjs/toolkit'

function toFavorite(property) {
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    currency: property.currency,
    city: property.city,
    province: property.province,
    type: property.type,
    operation: property.operation,
    bedrooms: property.bedrooms ?? null,
    bathrooms: property.bathrooms ?? null,
    coveredArea: property.coveredArea ?? null,
    totalArea: property.totalArea ?? null,
    coverImage: property.coverImage ?? property.images?.[0] ?? null,
    images: property.images?.slice(0, 1) ?? [],
  }
}

const initialState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const property = action.payload
      if (!state.items.some((item) => item.id === property.id)) {
        state.items.push(toFavorite(property))
      }
    },
    removeFavorite(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    toggleFavorite(state, action) {
      const property = action.payload
      const index = state.items.findIndex((item) => item.id === property.id)
      if (index >= 0) state.items.splice(index, 1)
      else state.items.push(toFavorite(property))
    },
    clearFavorites(state) {
      state.items = []
    },
  },
})

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions

export const selectFavorites = (state) => state.favorites.items
export const selectFavoritesCount = (state) => state.favorites.items.length
export const selectIsFavorite = (id) => (state) =>
  state.favorites.items.some((item) => item.id === id)

export default favoritesSlice.reducer
