import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { Register } from '@/pages/Register'
import { Login } from '@/pages/Login'
import { HomeAnterior } from '@/pages/HomeAnterior'
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
        path: 'home-anterior',
        element: <HomeAnterior />,
      },
      {
        path: 'panel',
        element: <PanelLayout />,
        children: [
          { path: 'perfil', element: <ProfilePage /> },
          { path: 'consultas', element: <InquiriesPage /> },
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