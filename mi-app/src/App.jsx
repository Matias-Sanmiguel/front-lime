import { useEffect, useState } from 'react'
import { ApiError } from './api/client'
import { getProperties } from './api/properties'
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

function App() {
  return (
    <main>
      <h1>Lime — prueba de API</h1>
      <PropertiesSmokeTest />
    </main>
  )
}

export default App
