import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { ApiError } from './api/client'
import { getProperties } from './api/properties'
import EditPropertyPage from './panel/EditPropertyPage.jsx'
import NewPropertyPage from './panel/NewPropertyPage.jsx'
import PanelLayout from './panel/PanelLayout.jsx'
import './App.css'

function PropertiesSmokeTest() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })

  useEffect(() => {
    let cancelled = false

    getProperties()
      .then((data) => {
        if (!cancelled) {
          setState({ status: 'success', data, error: null })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          const message = error instanceof ApiError ? error.detail : 'Error inesperado'
          setState({ status: 'error', data: null, error: message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') {
    return <p>Cargando propiedades…</p>
  }

  if (state.status === 'error') {
    return <p role="alert">No se pudo cargar: {state.error}</p>
  }

  return <pre>{JSON.stringify(state.data, null, 2)}</pre>
}

function ApiSmokeTest() {
  return (
    <main>
      <h1>Lime — prueba de API</h1>
      <PropertiesSmokeTest />
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ApiSmokeTest />} />
      <Route path="/panel" element={<PanelLayout />}>
        <Route path="nuevo" element={<NewPropertyPage />} />
        <Route path=":id/editar" element={<EditPropertyPage />} />
      </Route>
    </Routes>
  )
}

export default App
