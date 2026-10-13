import { useState } from 'react';
import { PropertyImage } from '../types/property';

interface Props {
  images: PropertyImage[];
}

export function PropertyGallery({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="bg-gray-200 h-64 flex items-center justify-center">Sin imágenes</div>;
  }

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Si las imágenes vienen como /uploads/..., asegúrate de concatenar la URL del backend
  const baseUrl = import.meta.env.VITE_API_URL;

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden group">
      <img 
        src={`${baseUrl}${images[currentIndex].url}`} 
        alt={`Foto ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Botones de navegación - Solo se muestran si hay más de 1 foto */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            ←
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            →
          </button>
          {/* Indicador de número de foto */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}