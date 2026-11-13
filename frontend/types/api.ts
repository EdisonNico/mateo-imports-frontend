// Tipos de las respuestas del backend (coinciden con los DTOs de Spring Boot).

// Respuesta paginada genérica.
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Usuario con sesión iniciada.
export interface AuthUser {
  id: number;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  firstName: string | null;
  lastName: string | null;
  documentType: string | null;
  documentNumber: string | null;
  phone: string | null;
}

// Categoría o marca (solo id y nombre).
export interface NamedItem {
  id: number;
  name: string;
}

// Fila de la tabla de productos del panel.
export interface AdminProductSummary {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  price: number;
  active: boolean;
  totalStock: number;
  imageUrl: string | null;
}

// Foto de un producto.
export interface ImageInfo {
  url: string;
  publicId: string | null;
}

// Variante talla + color con stock.
export interface VariantInfo {
  id: number;
  size: string;
  color: string;
  stock: number;
}

// Detalle completo de un producto.
export interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  category: string;
  brandId: number | null;
  brand: string | null;
  price: number;
  oldPrice: number | null;
  discountPercent: number;
  gender: "HOMBRE" | "MUJER" | "UNISEX";
  active: boolean;
  inStock: boolean;
  images: ImageInfo[];
  variants: VariantInfo[];
}

// Fila de la pantalla de inventario.
export interface InventoryItem {
  variantId: number;
  productId: number;
  productName: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

// Datos del dashboard.
export interface Dashboard {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockVariants: number;
  categories: number;
  brands: number;
}

// Resultado de subir una imagen.
export interface UploadResult {
  url: string;
  publicId: string;
}
