
import { Carousel_004 } from '@/components/ui/skiper-ui/skiper50'
import { ProductList } from '../components/ProductList.jsx'
import products from '../data/products.json'

const photos = products.flatMap((product) => product.images)

export function HomeAnterior() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Encontrá dónde vivir, alquilar o abrir tu local</h1>
        <p className="lead">
          {products.length} avisos publicados en Buenos Aires,
          con fotos y precio final.
        </p>
      </section>

      <div className="gallery">
        <Carousel_004 images={photos} showPagination loop />
      </div>

      <ProductList />
    </div>
  )
}
