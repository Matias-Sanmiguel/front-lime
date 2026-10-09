export function ProductCard({ title, description, price, operation, images, children }) {
  const cover = images[0]

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img className="product-card__image" src={cover.src} alt={cover.alt} loading="lazy" />
        <span className="product-card__operation">{operation}</span>
      </div>
      <div className="product-card__body">
        <p className="product-card__price">{price}</p>
        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__description">{description}</p>
        <div className="product-card__flags">{children}</div>
      </div>
    </article>
  )
}
