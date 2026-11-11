import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '@/auth/AuthContext.jsx'
import { clearCart, fetchCart } from '@/store/cartSlice'

// Mantiene el carrito alineado con la sesión: al iniciar sesión (o recargar la
// página con la sesión abierta) lo carga desde la base; al cerrar sesión lo vacía.
export function CartSync() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart())
    else dispatch(clearCart())
  }, [isAuthenticated, dispatch])

  return null
}
