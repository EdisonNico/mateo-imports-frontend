"use client";
// Tarjeta de producto: imagen, nombre, precios, descuento, tallas y disponibilidad.
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    // Aparece suavemente cuando entra en pantalla.
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/producto/${product.id}`} className="block">
        {/* Contenedor de la imagen (placeholder hasta tener fotos reales). */}
        <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-cream-dark text-xs uppercase tracking-widest text-charcoal-soft">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <span>{product.category}</span>
          )}
          {/* Etiqueta de descuento en terracota (acento). */}
          {discount > 0 && (
            <span className="absolute left-0 top-0 bg-terracotta px-3 py-1 text-xs font-bold text-cream">-{discount}%</span>
          )}
          {/* Aviso de agotado. */}
          {!product.inStock && (
            <span className="absolute bottom-0 left-0 right-0 bg-charcoal py-1 text-center text-xs uppercase tracking-widest text-cream">Agotado</span>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs uppercase tracking-widest text-charcoal-soft">{product.brand} · {product.category}</p>
          <h3 className="font-sans text-base font-medium">{product.name}</h3>
          <p className="flex items-baseline gap-2">
            <span className="font-bold text-terracotta-dark">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-charcoal-soft line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </p>
          <p className="text-xs text-charcoal-soft">Tallas: {product.sizes.join(" · ")}</p>
        </div>
      </Link>

      {/* Botón de compra; lleva al detalle donde se eligen talla y color. */}
      <Link
        href={`/producto/${product.id}`}
        className={`mt-3 block border border-charcoal py-2 text-center text-xs uppercase tracking-widest transition-colors hover:bg-charcoal hover:text-cream ${!product.inStock ? "pointer-events-none opacity-40" : ""}`}
        aria-disabled={!product.inStock}
      >
        {product.inStock ? "Comprar" : "No disponible"}
      </Link>
    </motion.article>
  );
}
