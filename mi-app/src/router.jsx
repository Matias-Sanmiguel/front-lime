import { Link, createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { Register } from '@/pages/Register'
import { Login } from '@/pages/Login'
import { PropertyDetail } from '@/pages/PropertyDetail.tsx'

import ProfilePage from '@/panel/ProfilePage.jsx'
import InquiriesPage from '@/panel/InquiriesPage.jsx'
import PanelLayout from '@/panel/PanelLayout.jsx'
import MyPropertiesPage from '@/panel/MyPropertiesPage.jsx'
import NewPropertyPage from '@/panel/NewPropertyPage.jsx'
import EditPropertyPage from '@/panel/EditPropertyPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {path:'*',element:<section className="mx-auto max-w-6xl px-4 py-16"><h1 className="text-3xl">Página no encontrada</h1><Link to="/" className="text-accent-ink underline">Volver al inicio</Link></section>},
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'buscar',
        element: <Search />,
      },
      {
        path: 'propiedad/:id',
        element: <PropertyDetail />,
      },
      { path: 'registro', element: <Register /> },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'panel',
        element: <PanelLayout />,
        children: [
          { path: 'perfil', element: <ProfilePage /> },
          { path: 'consultas', element: <InquiriesPage /> },
          { path: 'consultas/:inquiryId', element: <InquiriesPage /> },
          {
            index: true,
            element: <MyPropertiesPage />,
          },
          {
            path: 'nuevo',
            element: <NewPropertyPage />,
          },
          {
            path: ':id/editar',
            element: <EditPropertyPage />,
          },
        ],
      },
    ],
  },
])