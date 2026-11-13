// Tipos de datos del catálogo. Más adelante coincidirán con los DTOs del backend.

// Categorías disponibles en la tienda.
export type Category =
  | "Polos"
  | "Poleras"
  | "Hoodies"
  | "Jeans"
  | "Casacas"
  | "Zapatillas"
  | "Accesorios";

// Producto tal como se muestra en las tarjetas.
export interface Product {
  id: number;
  name: string;
  category: Category;
  brand: string;
  price: number;          // Precio actual en soles
  oldPrice?: number;      // Precio anterior (si hay descuento)
  sizes: string[];        // Tallas disponibles
  inStock: boolean;       // Disponibilidad
  imageUrl?: string;      // URL de Cloudinary (opcional por ahora)
}
