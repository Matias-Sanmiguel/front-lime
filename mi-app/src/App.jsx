import { Link, Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { CartSync } from '@/components/cart/CartSync'
import { BrandMark } from '@/components/layout/Brand'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <CartSync />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-footer text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm text-footer-foreground">
          <p className="flex items-center gap-2.5">
            <BrandMark className="h-7 w-7 text-white" />
            <span>
              <span className="font-semibold text-white">Lime.</span> Tu próximo lugar.
            </span>
          </p>
          <nav aria-label="Enlaces del pie" className="flex gap-6">
            <Link to="/buscar" className="py-2 transition-colors hover:text-brand-lime">
              Buscar propiedades
            </Link>
            <Link to="/favoritos" className="py-2 transition-colors hover:text-brand-lime">
              Mis favoritos
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
