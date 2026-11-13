// Sección "Sobre nosotros" con la propuesta de valor de la tienda.

// Los tres valores que se muestran.
const values = [
  { title: "Calidad", text: "Prendas americanas seleccionadas una por una." },
  { title: "Exclusividad", text: "Piezas difíciles de encontrar en el mercado local." },
  { title: "Confianza", text: "Atención directa y personalizada por WhatsApp." },
];

export default function About() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl sm:text-4xl">Moda americana, seleccionada para ti</h2>
          <p className="mt-6 max-w-lg text-charcoal-soft">
            En MATEO IMPORTS traemos estilo vintage y streetwear directamente desde Estados Unidos,
            para que vistas con identidad propia.
          </p>
        </div>
        <ul className="space-y-6">
          {values.map((v) => (
            <li key={v.title} className="border-l-2 border-terracotta pl-4">
              <h3 className="font-sans text-lg font-semibold">{v.title}</h3>
              <p className="text-charcoal-soft">{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
