import { useState } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import favorites from '../src/store/favoritesSlice'

export function TestStore({ children }) {
  const [store] = useState(() => configureStore({ reducer: { favorites } }))
  return <Provider store={store}>{children}</Provider>
}
