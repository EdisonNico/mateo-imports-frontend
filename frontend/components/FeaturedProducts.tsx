// Sección de productos destacados de la portada.
import Link from "next/link";
import ProductCard from "./ProductCard";
import { mockProducts } from "@/lib/mockProducts";

export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-3xl sm:text-4xl">Productos destacados</h2>
        <Link href="/catalogo" className="text-sm uppercase tracking-widest text-terracotta-dark hover:underline">
          Ver todo
        </Link>
      </div>
      {/* Cuadrícula responsiva: 2 columnas en móvil y 4 en escritorio. */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {mockProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
