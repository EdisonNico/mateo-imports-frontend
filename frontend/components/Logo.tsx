// Logotipo tipográfico de MATEO IMPORTS.
// "MATEO" en tipografía editorial y "IMPORTS" pequeño con espaciado amplio.
import Link from "next/link";

type LogoProps = {
  // "dark" = texto carbón (sobre fondo crema); "light" = texto crema (sobre fondo carbón).
  variant?: "dark" | "light";
};

export default function Logo({ variant = "dark" }: LogoProps) {
  // Color del texto según el fondo donde se use.
  const color = variant === "dark" ? "text-charcoal" : "text-cream";

  return (
    // Enlace a la página de inicio con etiqueta accesible.
    <Link
      href="/"
      aria-label="MATEO IMPORTS - Ir al inicio"
      className={`inline-flex flex-col items-center leading-none ${color}`}
    >
      {/* Nombre principal en tipografía editorial. */}
      <span className="font-display text-2xl font-semibold tracking-wordmark">
        MATEO
      </span>
      {/* Subtítulo con línea terracota como detalle de acento. */}
      <span className="mt-1 flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-wordmark">
        <span className="h-px w-4 bg-terracotta" aria-hidden="true" />
        Imports
        <span className="h-px w-4 bg-terracotta" aria-hidden="true" />
      </span>
    </Link>
  );
}
