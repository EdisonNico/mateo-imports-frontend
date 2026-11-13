"use client";
// Barra de navegación sticky con menú hamburguesa en móviles.
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Logo from "./Logo";

// Enlaces principales del menú.
const links = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Hombres", href: "/catalogo?genero=hombres" },
  { label: "Mujeres", href: "/catalogo?genero=mujeres" },
  { label: "Ofertas", href: "/catalogo?ofertas=1" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  // Controla si el menú móvil está abierto.
  const [open, setOpen] = useState(false);

  return (
    // sticky + z-50: la barra se queda arriba al hacer scroll.
    <header className="sticky top-0 z-50 border-b border-cream-dark bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Principal">
        <Logo />

        {/* Enlaces visibles solo en pantallas grandes. */}
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="text-sm uppercase tracking-widest text-charcoal transition-colors hover:text-terracotta">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Iconos de acciones: buscador, cuenta, carrito y botón del menú móvil. */}
        <div className="flex items-center gap-4 text-charcoal">
          <button aria-label="Buscar" className="hover:text-terracotta"><Search size={20} /></button>
          <Link href="/cuenta" aria-label="Mi cuenta" className="hover:text-terracotta"><User size={20} /></Link>
          <Link href="/carrito" aria-label="Carrito" className="relative hover:text-terracotta">
            <ShoppingBag size={20} />
            {/* Contador del carrito (valor fijo por ahora; se conectará en la Fase 6). */}
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[0.6rem] font-bold text-cream">0</span>
          </Link>
          <button
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil con animación de entrada y salida. */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-cream-dark bg-cream lg:hidden"
          >
            {links.map((l) => (
              <li key={l.label} className="border-b border-cream-dark">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)} // Cierra el menú al navegar
                  className="block px-6 py-4 text-sm uppercase tracking-widest text-charcoal"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
