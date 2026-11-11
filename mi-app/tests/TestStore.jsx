import { useState } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import favorites from '../src/store/favoritesSlice'
import cart from '../src/store/cartSlice'

export function TestStore({ children }) {
  const [store] = useState(() => configureStore({ reducer: { favorites, cart } }))
  return <Provider store={store}>{children}</Provider>
}
