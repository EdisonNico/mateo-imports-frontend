"use client";
// Proveedores globales de la aplicación: TanStack Query para consultar el backend.
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Se crea una sola vez por navegador (useState evita recrearlo en cada render).
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,          // Los datos se consideran frescos por 30 segundos
            refetchOnWindowFocus: false, // No recargar al volver a la pestaña
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
