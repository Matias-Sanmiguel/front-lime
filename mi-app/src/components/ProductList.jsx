import { useState } from 'react'
import products from '../data/products.json'
import { ProductCard } from './ProductCard.jsx'

const ALL = 'Todos'
const operations = [ALL, ...new Set(products.map((product) => product.operation))]

function formatPrice(price, currency) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function ProductList() {
  const [operation, setOperation] = useState(ALL)
  const visible =
    operation === ALL ? products : products.filter((product) => product.operation === operation)

  return (
    <section className="listing" aria-labelledby="listing-title">
      <div className="listing__header">
        <h2 id="listing-title">Avisos</h2>
        <div className="filters" role="group" aria-label="Filtrar por operación">
          {operations.map((option) => (
            <button
              key={option}
              type="button"
              className="filter"
              aria-pressed={operation === option}
              onClick={() => setOperation(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <ul className="product-list">
        {visible.map((product) => (
          <li key={product.id}>
            <ProductCard
              title={product.title}
              description={product.description}
              price={formatPrice(product.price, product.currency)}
              operation={product.operation}
              images={product.images}
            >
              {product.entregaGratis ? <span className="flag">Entrega gratis</span> : null}
              {product.compraInternacional ? (
                <span className="flag">Compra internacional</span>
              ) : null}
            </ProductCard>
          </li>
        ))}
      </ul>
    </section>
  )
}
