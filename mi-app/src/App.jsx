import { Link, Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground">
          <p>Lime. Tu próximo lugar.</p>
          <nav aria-label="Enlaces del pie" className="flex gap-6">
            <Link to="/buscar" className="py-2 hover:text-foreground">
              Buscar propiedades
            </Link>
            <Link to="/favoritos" className="py-2 hover:text-foreground">
              Mis favoritos
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
