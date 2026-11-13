// Cuadrícula de categorías de la portada.
import Link from "next/link";
import { categories } from "@/lib/mockProducts";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-10 text-3xl sm:text-4xl">Compra por categoría</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((name) => (
          <li key={name}>
            {/* Cada categoría lleva al catálogo filtrado. */}
            <Link
              href={`/catalogo?categoria=${encodeURIComponent(name)}`}
              className="flex h-32 items-end border border-charcoal p-4 text-sm uppercase tracking-widest text-charcoal transition-colors hover:bg-charcoal hover:text-cream"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
