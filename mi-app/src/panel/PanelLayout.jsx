import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { ErrorState } from './ui.jsx'
import './panel.css'

const PANEL_ROLES = ['AGENCY', 'ADMIN']

// Envuelve las rutas /panel/*: solo inmobiliarias y admins. El backend igual
// rechaza con 401/403; esto evita mostrar un formulario que va a fallar.
// Que el aviso sea del usuario lo resuelve cada pantalla contra el backend.
export default function PanelLayout() {
  const { isAuthenticated, user } = useAuth()
  const { pathname } = useLocation()
  const requiresAgency = !['/panel/consultas', '/panel/perfil'].includes(pathname)

  let content = <Outlet />
  if (!isAuthenticated) {
    content = (
      <ErrorState title="Iniciá sesión para seguir">
        <p>Para publicar o editar avisos necesitás ingresar con tu cuenta de inmobiliaria.</p>
        <Link className="btn btn-primary" to="/login">
          Ingresar
        </Link>
      </ErrorState>
    )
  } else if (requiresAgency && !PANEL_ROLES.includes(user?.role)) {
    content = (
      <ErrorState code={403} title="Solo para inmobiliarias">
        <p>Tu cuenta no puede publicar avisos: esta sección es para inmobiliarias y administradores.</p>
        <Link className="btn btn-secondary" to="/">
          Ir al inicio
        </Link>
      </ErrorState>
    )
  }

  return <div className="panel">{content}</div>
}
