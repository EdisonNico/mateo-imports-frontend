// Layout raíz de la tienda: carga las tipografías y los estilos globales.
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import Providers from "./providers";

// Tipografía sans-serif moderna para textos y navegación.
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Variable CSS usada en tailwind.config.ts
  display: "swap",
});

// Tipografía editorial elegante para los titulares.
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display", // Variable CSS usada en tailwind.config.ts
  display: "swap",
});

// Metadatos base para SEO y pestañas del navegador.
export const metadata: Metadata = {
  title: {
    default: "MATEO IMPORTS | Moda americana en Perú",
    template: "%s | MATEO IMPORTS",
  },
  description:
    "Prendas americanas seleccionadas para destacar en cada ocasión. Polos, hoodies, jeans, casacas y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang="es" mejora la accesibilidad y el SEO.
    <html lang="es" className={`${sans.variable} ${display.variable}`}>
      <body>
        {/* Todas las animaciones respetan prefers-reduced-motion. */}
        <Providers>
          <MotionProvider>{children}</MotionProvider>
        </Providers>
      </body>
    </html>
  );
}
