import { useState } from 'react'
import { Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext.jsx'
import { Button } from '@/components/ui/button'
import { addToCart, selectIsInCart } from '@/store/cartSlice'

export function AddToCartButton({ propertyId, className = '' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const inCart = useSelector(selectIsInCart(propertyId))
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)

  async function handleClick() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setAdding(true)
    setError(null)
    try {
      // Llama al endpoint: la fila se crea en la base y recién ahí se actualiza el estado.
      await dispatch(addToCart(propertyId)).unwrap()
    } catch (err) {
      setError(err.message || 'No pudimos agregar la propiedad al carrito')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={inCart ? 'secondary' : 'default'}
        onClick={handleClick}
        disabled={adding || inCart}
        aria-busy={adding}
        className="w-full disabled:opacity-100"
      >
        {inCart ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            En tu carrito
          </>
        ) : adding ? (
          'Agregando…'
        ) : (
          'Agregar al carrito'
        )}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
