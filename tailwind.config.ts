// Configuración de Tailwind para MATEO IMPORTS.
// Aquí se define el sistema visual: colores (regla 60-30-10), tipografías y espaciado.
import type { Config } from "tailwindcss";

const config: Config = {
  // Carpetas donde Tailwind buscará clases para generar el CSS final.
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60% — color principal: fondos y superficies.
        cream: {
          DEFAULT: "#F5F1E8", // Cream Vintage
          dark: "#EAE4D6",    // Variante para bordes y superficies secundarias
        },
        // 30% — color secundario: textos, navegación, footer.
        charcoal: {
          DEFAULT: "#202020", // Charcoal Black
          soft: "#4A4A4A",    // Variante para textos secundarios
        },
        // 10% — acento: botones principales, ofertas y llamadas a la acción.
        terracotta: {
          DEFAULT: "#A65D3F", // Burnt Terracotta
          dark: "#8F4E33",    // Variante más oscura (hover y mejor contraste sobre crema)
        },
      },
      fontFamily: {
        // Las variables --font-* se cargan con next/font en app/layout.tsx.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],     // Textos y navegación
        display: ["var(--font-display)", "Georgia", "serif"],      // Titulares editoriales
      },
      letterSpacing: {
        // Espaciado amplio usado en el logotipo y en etiquetas en mayúsculas.
        wordmark: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
