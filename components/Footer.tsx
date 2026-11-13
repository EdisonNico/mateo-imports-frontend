// Pie de página con información comercial, contacto y políticas.
import Link from "next/link";
import Logo from "./Logo";

// Enlaces legales obligatorios.
const legal = [
  { label: "Políticas de privacidad", href: "/privacidad" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Cambios y devoluciones", href: "/cambios-y-devoluciones" },
  { label: "Políticas de envío", href: "/envios" },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Logo variant="light" />
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            Prendas americanas seleccionadas para destacar en cada ocasión.
          </p>
        </div>
        <div>
          <h3 className="font-sans text-sm uppercase tracking-widest">Información</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            {legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-terracotta">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-sm uppercase tracking-widest">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            {/* Estos datos se completarán con los reales del negocio. */}
            <li>WhatsApp: por configurar</li>
            <li>Instagram · TikTok · Facebook</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} MATEO IMPORTS. Todos los derechos reservados.
      </p>
    </footer>
  );
}
