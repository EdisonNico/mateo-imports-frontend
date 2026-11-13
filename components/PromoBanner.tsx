// Banner promocional para nuevas colecciones y ofertas.
import Link from "next/link";

export default function PromoBanner() {
  return (
    // Fondo carbón (30%) con acento terracota (10%) en la llamada a la acción.
    <section className="bg-charcoal text-cream">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-wordmark text-terracotta">Ofertas de temporada</p>
          <h2 className="mt-2 text-3xl text-cream sm:text-4xl">Hasta 30% de descuento en prendas seleccionadas</h2>
        </div>
        <Link href="/catalogo?ofertas=1" className="bg-terracotta px-6 py-3 text-sm font-medium uppercase tracking-widest text-cream transition-colors hover:bg-terracotta-dark">
          Ver ofertas
        </Link>
      </div>
    </section>
  );
}
