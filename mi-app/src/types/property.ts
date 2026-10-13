export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED';

export interface PropertyImage {
  id: number;
  url: string; // Ej: "/uploads/foto1.jpg"
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  operationType: string; // Ej: "VENTA", "ALQUILER"
  propertyType: string;  // Ej: "CASA", "DEPARTAMENTO"
  rooms: number;
  status: PropertyStatus;
  ownerId: number; // Útil para validar si sos el dueño
  images: PropertyImage[];
}