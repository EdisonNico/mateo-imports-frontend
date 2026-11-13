// DATOS DE EJEMPLO TEMPORALES.
// Se reemplazarán por la respuesta real de GET /api/products en la Fase 4.
import type { Product } from "@/types/product";

export const mockProducts: Product[] = [
  { id: 1, name: "Hoodie Varsity", category: "Hoodies", brand: "Ralph Lauren", price: 159, oldPrice: 199, sizes: ["S", "M", "L", "XL"], inStock: true },
  { id: 2, name: "Jean Straight Fit", category: "Jeans", brand: "Levi's", price: 189, sizes: ["30", "32", "34"], inStock: true },
  { id: 3, name: "Polo Classic", category: "Polos", brand: "Tommy Hilfiger", price: 99, oldPrice: 129, sizes: ["S", "M", "L"], inStock: true },
  { id: 4, name: "Casaca Denim", category: "Casacas", brand: "Levi's", price: 249, sizes: ["M", "L"], inStock: false },
];

// Categorías para la cuadrícula de inicio.
export const categories = [
  "Polos",
  "Poleras",
  "Hoodies",
  "Jeans",
  "Casacas",
  "Zapatillas",
  "Accesorios",
] as const;
