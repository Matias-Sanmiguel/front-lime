import { useState } from 'react'
import { applyTheme, getStoredTheme, saveTheme } from '@/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState(getStoredTheme)

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    saveTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className="inline-flex min-h-10 items-center rounded-full px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:text-[13px]"
    >
      {theme === 'dark' ? 'Claro' : 'Oscuro'}
    </button>
  )
}