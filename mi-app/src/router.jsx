
import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { HomeAnterior } from '@/pages/HomeAnterior'
import { PropertyDetail } from '@/pages/PropertyDetail.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'buscar', element: <Search /> },
      { path: 'propiedad/:id', element: <PropertyDetail /> },
      { path: 'home-anterior', element: <HomeAnterior /> },
    ],
  },
])
