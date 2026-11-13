"use client";
// Página para editar un producto existente.
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductForm from "@/components/admin/ProductForm";
import { api, errorMessage } from "@/lib/api";
import type { ProductDetail } from "@/types/api";

export default function EditProductPage() {
  // El id viene de la URL: /admin/productos/12
  const params = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "product", params.id],
    queryFn: () => api<ProductDetail>(`/admin/products/${params.id}`),
    // Siempre se pide el dato más reciente al abrir el formulario.
    staleTime: 0,
  });

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-3xl">Editar producto</h1>
      {isLoading && <p className="text-sm text-charcoal-soft">Cargando…</p>}
      {error && <p role="alert" className="text-sm text-terracotta-dark">{errorMessage(error)}</p>}
      {/* key obliga a recrear el formulario si cambia el producto. */}
      {data && <ProductForm key={data.id} initial={data} />}
    </div>
  );
}
