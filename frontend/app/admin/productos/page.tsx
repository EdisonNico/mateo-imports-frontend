"use client";
// Lista de productos del panel: búsqueda, paginación, edición y eliminación.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/admin/Pagination";
import { api, errorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { btnPrimary, btnSmall, inputClass } from "@/lib/ui";
import type { AdminProductSummary, PageResponse } from "@/types/api";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");      // Lo que escribe el usuario
  const [query, setQuery] = useState("");        // Lo que realmente se consulta (con retraso)
  const [page, setPage] = useState(0);

  // Espera 400 ms después de escribir antes de consultar, para no hacer una petición por tecla.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
      setPage(0); // Al buscar se vuelve a la primera página
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "products", query, page],
    queryFn: () =>
      api<PageResponse<AdminProductSummary>>(
        `/admin/products?q=${encodeURIComponent(query)}&page=${page}&size=10`,
      ),
  });

  // Eliminación (lógica): el producto deja de mostrarse en la tienda.
  const remove = useMutation({
    mutationFn: (id: number) => api(`/products/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });

  function confirmDelete(product: AdminProductSummary) {
    if (window.confirm(`¿Eliminar "${product.name}"? Dejará de mostrarse en la tienda.`)) {
      remove.mutate(product.id);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Productos</h1>
        <Link href="/admin/productos/nuevo" className={btnPrimary}>Nuevo producto</Link>
      </div>

      <label htmlFor="buscar" className="sr-only">Buscar productos</label>
      <input
        id="buscar"
        type="search"
        placeholder="Buscar por nombre, marca o categoría…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${inputClass} mb-6 max-w-md`}
      />

      {isLoading && <p className="text-sm text-charcoal-soft">Cargando…</p>}
      {error && <p role="alert" className="text-sm text-terracotta-dark">{errorMessage(error)}</p>}
      {remove.error && <p role="alert" className="mb-4 text-sm text-terracotta-dark">{errorMessage(remove.error)}</p>}

      {data && data.content.length === 0 && (
        <p className="text-sm text-charcoal-soft">No se encontraron productos.</p>
      )}

      {data && data.content.length > 0 && (
        // overflow-x-auto: la tabla se desplaza dentro de su contenedor sin desbordar la página.
        <div className="overflow-x-auto border border-cream-dark bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-cream-dark text-xs uppercase tracking-widest text-charcoal-soft">
              <tr>
                <th className="p-3">Foto</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((p) => (
                <tr key={p.id} className="border-b border-cream-dark last:border-0">
                  <td className="p-3">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-12 w-12 object-cover" />
                    ) : (
                      <div className="h-12 w-12 bg-cream-dark" aria-hidden="true" />
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    {p.name}
                    {p.brand && <span className="block text-xs font-normal text-charcoal-soft">{p.brand}</span>}
                  </td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className={`p-3 ${p.totalStock === 0 ? "font-bold text-terracotta-dark" : ""}`}>{p.totalStock}</td>
                  <td className="p-3">{p.active ? "Activo" : "Inactivo"}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/productos/${p.id}`} className={btnSmall}>Editar</Link>
                      <button className={btnSmall} onClick={() => confirmDelete(p)} disabled={remove.isPending || !p.active}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
