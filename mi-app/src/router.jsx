
import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { HomeAnterior } from '@/pages/HomeAnterior'
import { PropertyDetail } from '@/pages/PropertyDetail.tsx'

import PanelLayout from '@/panel/PanelLayout.jsx'
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
      {
        path: 'home-anterior',
        element: <HomeAnterior />,
      },
      {
        path: 'panel',
        element: <PanelLayout />,
        children: [
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
