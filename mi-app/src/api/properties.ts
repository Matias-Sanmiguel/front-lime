import { Property } from '../types/property';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function getProperty(id: string): Promise<Property> {
  // Asumimos que si hay token de usuario, lo mandamos en los headers
  // para que el backend sepa si sos el dueño y evite el 404 en propiedades pausadas/draft.
  const token = localStorage.getItem('token'); 
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/v1/properties/${id}`, { headers });

  if (!response.ok) {
    // Si el backend devuelve 404 (No existe o no sos dueño de un no-publicado)
    if (response.status === 404) {
      throw new Error('404');
    }
    throw new Error('Error fetching property');
  }

  return response.json();
}