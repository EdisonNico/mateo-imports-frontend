"use client";
// Sección principal de la portada con título editorial y llamadas a la acción.
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
      {/* Columna de texto con aparición suave. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="mb-4 text-xs uppercase tracking-wordmark text-terracotta-dark">Nueva temporada</p>
        <h1 className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
          EL ESTILO QUE CRUZA FRONTERAS
        </h1>
        <p className="mt-6 max-w-md text-lg text-charcoal-soft">
          Descubre prendas americanas seleccionadas para destacar en cada ocasión.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {/* Botón principal en terracota (acento 10%). */}
          <Link href="/catalogo" className="bg-terracotta px-6 py-3 text-sm font-medium uppercase tracking-widest text-cream transition-colors hover:bg-terracotta-dark">
            Explorar colección
          </Link>
          <Link href="/catalogo?orden=novedades" className="border border-charcoal px-6 py-3 text-sm font-medium uppercase tracking-widest text-charcoal transition-colors hover:bg-charcoal hover:text-cream">
            Ver novedades
          </Link>
        </div>
      </motion.div>

      {/* Espacio para la foto editorial; se reemplazará por una imagen real de Cloudinary. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="flex aspect-[4/5] items-center justify-center bg-cream-dark text-sm uppercase tracking-widest text-charcoal-soft"
        role="img"
        aria-label="Fotografía editorial de moda americana"
      >
        Foto editorial
      </motion.div>
    </section>
  );
}
