import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AuthProvider } from './auth/AuthContext.jsx'
import { SessionBootstrap } from './auth/SessionBootstrap.jsx'
import { store } from './store/store'
import { router } from './router'
import './index.css'
import { applyTheme, getStoredTheme } from './theme'

applyTheme(getStoredTheme())
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <SessionBootstrap />
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)