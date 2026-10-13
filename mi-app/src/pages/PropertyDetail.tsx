import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InquiryForm } from '@/components/InquiryForm';

interface PropertyImage {
  id: number;
  url: string;
}

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  operation: string; // En el JSON viene como "operation"
  type: string;      // En el JSON viene como "type"
  bedrooms: number;  // En el JSON viene como "bedrooms"
  images: PropertyImage[]; // Le ponemos el '?' porque en tu JSON de prueba no vinieron imágenes
}

// --- 2. DATOS DE PRUEBA (MOCKS) ---
// Simulamos lo que te va a devolver el backend para poder diseñar tranquilos
const MOCK_PROPERTIES: Record<string, Property> = {
  "123": {
    id: 123,
    title: "Hermoso departamento en Palermo",
    description: "Luminoso departamento de 3 ambientes al frente.\n\nCuenta con balcón, cocina integrada y seguridad 24hs. Ideal para estudiantes de UADE.",
    price: 120000,
    city: "Palermo, CABA",
    operation: "VENTA",
    type: "DEPARTAMENTO",
    bedrooms: 3,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" },
      { id: 2, url: "https://images.unsplash.com/photo-1502672260266-1c1c29408447" }
    ]
  }
};

// --- 3. COMPONENTE GALERÍA ---
function PropertyGallery({ images }: { images: PropertyImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">Sin fotos</div>;
  }

  // Obtenemos la URL del backend desde el .env, o usamos localhost:8080 por defecto
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  
  // Si la URL ya empieza con http (como nuestros mocks), la dejamos igual. 
  // Si viene del backend (ej: /uploads/foto.jpg), le pegamos el API_URL adelante.
  const imageUrl = images[currentIndex].url.startsWith('http') 
    ? images[currentIndex].url 
    : `${API_URL}${images[currentIndex].url}`;

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <img 
        src={imageUrl} 
        alt={`Foto ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 flex items-center justify-center rounded-full shadow cursor-pointer hover:bg-white"
          >
            ←
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 flex items-center justify-center rounded-full shadow cursor-pointer hover:bg-white"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}

// --- 4. COMPONENTE PRINCIPAL (LA PÁGINA) ---
export function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    fetch(`${API_URL}/api/v1/properties/${id}`)
      .then((response) => {
        if (!response.ok) {
          // Si el backend nos tira un 404 (no existe o no publicado), lanzamos el error
          throw new Error(response.status === 404 ? '404' : 'Error del servidor');
        }
        return response.json();
      })
      .then((data: Property) => {
        setProperty(data);
        setError(null);
      })
      .catch((err) => {
        // Atrapamos el error y seteamos el estado para que se muestre la pantalla de 404
        setError(err.message === '404' ? '404' : 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500 text-xl">Buscando propiedad...</div>;
  }
  
  if (error === '404' || !property) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Propiedad no encontrada</h1>
        <p className="text-gray-600 mb-6">El aviso que buscás no existe o ya no está publicado.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Lado izquierdo: Galería y Descripción */}
      <div className="md:col-span-2 space-y-6">
        <PropertyGallery images={property.images} />
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <p className="text-gray-500 mb-4">{property.city}</p>
          
          <div className="flex gap-3 mb-6">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
              {property.operation}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {property.type}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {property.bedrooms} ambientes
            </span>
          </div>

          <h2 className="text-xl font-bold mb-3">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {property.description}
          </p>
        </div>
      </div>

      {/* Lado derecho: Precio y Contacto */}
      <div className="md:col-span-1">
        <div className="sticky top-8 border border-gray-200 p-6 rounded-xl shadow-sm bg-white">
          <p className="text-4xl font-bold mb-6">
            USD {property.price.toLocaleString()}
          </p>
          <InquiryForm propertyId={property.id} />
        </div>
      </div>

    </div>
  );
}