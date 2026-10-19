import { NavLink } from 'react-router-dom'

function LimeMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/20">
      <svg viewBox="0 0 64 64" className="h-5 w-5 text-accent-ink" fill="currentColor" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
        <rect x="27" y="8" width="10" height="14" rx="2" />
        <rect x="29" y="29" width="6" height="6" />
      </svg>
    </span>
  )
}

const navLinkClassName = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2.5">
          <LimeMark />
          <span className="font-display text-xl font-semibold text-foreground">Lime</span>
        </NavLink>

        <nav className="flex items-center gap-8">
          <NavLink to="/" end className={navLinkClassName}>
            Home
          </NavLink>
          <NavLink to="/buscar" className={navLinkClassName}>
            Buscar
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
