"use client";
// Inventario: ver y ajustar el stock de cada variante (talla + color).
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/admin/Pagination";
import { api, errorMessage } from "@/lib/api";
import { btnSmall, inputClass } from "@/lib/ui";
import type { InventoryItem, PageResponse } from "@/types/api";

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(0);
  // Valores escritos pero aún no guardados: { idVariante: "texto" }
  const [edits, setEdits] = useState<Record<number, string>>({});

  // Retraso de 400 ms al escribir en el buscador.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "inventory", query, lowStock, page],
    queryFn: () =>
      api<PageResponse<InventoryItem>>(
        `/admin/inventory?q=${encodeURIComponent(query)}&lowStock=${lowStock}&page=${page}&size=20`,
      ),
  });

  // Guarda el nuevo stock de una variante.
  const save = useMutation({
    mutationFn: ({ id, stock }: { id: number; stock: number }) =>
      api<InventoryItem>(`/admin/inventory/${id}`, { method: "PATCH", body: { stock } }),
    onSuccess: (_result, vars) => {
      // Quita la edición pendiente y recarga los datos (inventario, dashboard y productos).
      setEdits((prev) => {
        const next = { ...prev };
        delete next[vars.id];
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  // Solo se acepta un entero de 0 o más.
  const isValid = (text: string) => /^\d+$/.test(text.trim());

  return (
    <div>
      <h1 className="mb-6 text-3xl">Inventario</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label htmlFor="buscar-inv" className="sr-only">Buscar en inventario</label>
        <input
          id="buscar-inv"
          type="search"
          placeholder="Buscar por producto o SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} max-w-md`}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => { setLowStock(e.target.checked); setPage(0); }}
          />
          Solo stock bajo (5 o menos)
        </label>
      </div>

      {isLoading && <p className="text-sm text-charcoal-soft">Cargando…</p>}
      {error && <p role="alert" className="text-sm text-terracotta-dark">{errorMessage(error)}</p>}
      {save.error && <p role="alert" className="mb-4 text-sm text-terracotta-dark">{errorMessage(save.error)}</p>}
      {data && data.content.length === 0 && <p className="text-sm text-charcoal-soft">No hay variantes para mostrar.</p>}

      {data && data.content.length > 0 && (
        <div className="overflow-x-auto border border-cream-dark bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-cream-dark text-xs uppercase tracking-widest text-charcoal-soft">
              <tr>
                <th className="p-3">Producto</th>
                <th className="p-3">Talla</th>
                <th className="p-3">Color</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Stock</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {data.content.map((item) => {
                // Si hay un valor editado se usa; si no, el stock actual.
                const text = edits[item.variantId] ?? String(item.stock);
                const changed = edits[item.variantId] !== undefined && text.trim() !== String(item.stock);
                return (
                  <tr key={item.variantId} className="border-b border-cream-dark last:border-0">
                    <td className="p-3 font-medium">{item.productName}</td>
                    <td className="p-3">{item.size}</td>
                    <td className="p-3">{item.color}</td>
                    <td className="p-3 text-xs text-charcoal-soft">{item.sku}</td>
                    <td className="p-3">
                      <label htmlFor={`stock-${item.variantId}`} className="sr-only">
                        Stock de {item.productName} {item.size} {item.color}
                      </label>
                      <input
                        id={`stock-${item.variantId}`}
                        inputMode="numeric"
                        value={text}
                        onChange={(e) => setEdits((prev) => ({ ...prev, [item.variantId]: e.target.value }))}
                        className={`${inputClass} w-24 ${item.stock <= 5 ? "border-terracotta" : ""}`}
                      />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        className={btnSmall}
                        disabled={!changed || !isValid(text) || save.isPending}
                        onClick={() => save.mutate({ id: item.variantId, stock: Number(text) })}
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
