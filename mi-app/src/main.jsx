import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' //Importa el router
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter> {/* envuelve la app */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)