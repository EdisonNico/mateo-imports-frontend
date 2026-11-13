// Funciones de ayuda para mostrar precios.

// Formatea un número como moneda peruana: S/ 159.00
export function formatPrice(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}

// Calcula el porcentaje de descuento entre el precio anterior y el actual.
export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
