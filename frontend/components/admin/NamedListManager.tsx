"use client";
// Gestor genérico de listas con nombre (se usa para categorías y marcas): agregar, renombrar y eliminar.
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";
import { btnPrimary, btnSmall, cardClass, inputClass } from "@/lib/ui";
import type { NamedItem } from "@/types/api";

interface Props {
  title: string;        // Título de la sección
  readPath: string;     // Ruta pública para listar, por ejemplo "/categories"
  adminPath: string;    // Ruta administrativa para modificar, por ejemplo "/admin/categories"
  queryKey: string;     // Clave de caché de TanStack Query
}

export default function NamedListManager({ title, readPath, adminPath, queryKey }: Props) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: [queryKey], queryFn: () => api<NamedItem[]>(readPath) });

  // Refresca las listas (también las de los selectores del formulario de productos) y el dashboard.
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const create = useMutation({
    mutationFn: (name: string) => api(adminPath, { method: "POST", body: { name } }),
    onSuccess: () => { setNewName(""); setMessage(null); refresh(); },
    onError: (e) => setMessage(errorMessage(e)),
  });

  const rename = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      api(`${adminPath}/${id}`, { method: "PUT", body: { name } }),
    onSuccess: () => { setEditingId(null); setMessage(null); refresh(); },
    onError: (e) => setMessage(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => api(`${adminPath}/${id}`, { method: "DELETE" }),
    onSuccess: () => { setMessage(null); refresh(); },
    onError: (e) => setMessage(errorMessage(e)), // Por ejemplo: "hay productos en esta categoría"
  });

  return (
    <section className={cardClass}>
      <h2 className="mb-4 font-sans text-lg font-semibold">{title}</h2>

      {/* Formulario para agregar. */}
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (newName.trim()) create.mutate(newName.trim());
        }}
      >
        <label htmlFor={`nuevo-${queryKey}`} className="sr-only">Nuevo nombre</label>
        <input
          id={`nuevo-${queryKey}`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre nuevo"
          maxLength={60}
          className={inputClass}
        />
        <button type="submit" className={btnPrimary} disabled={create.isPending || !newName.trim()}>Agregar</button>
      </form>

      {message && <p role="alert" className="mb-3 text-sm text-terracotta-dark">{message}</p>}
      {isLoading && <p className="text-sm text-charcoal-soft">Cargando…</p>}

      <ul className="divide-y divide-cream-dark">
        {data?.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-2 py-2">
            {editingId === item.id ? (
              // Modo edición de un elemento.
              <form
                className="flex flex-1 gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingName.trim()) rename.mutate({ id: item.id, name: editingName.trim() });
                }}
              >
                <label htmlFor={`edit-${queryKey}-${item.id}`} className="sr-only">Nuevo nombre</label>
                <input
                  id={`edit-${queryKey}-${item.id}`}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  maxLength={60}
                  className={inputClass}
                  autoFocus
                />
                <button type="submit" className={btnSmall} disabled={rename.isPending}>Guardar</button>
                <button type="button" className={btnSmall} onClick={() => setEditingId(null)}>Cancelar</button>
              </form>
            ) : (
              <>
                <span className="text-sm">{item.name}</span>
                <div className="flex gap-2">
                  <button className={btnSmall} onClick={() => { setEditingId(item.id); setEditingName(item.name); setMessage(null); }}>
                    Renombrar
                  </button>
                  <button
                    className={btnSmall}
                    disabled={remove.isPending}
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${item.name}"?`)) remove.mutate(item.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {data && data.length === 0 && <p className="text-sm text-charcoal-soft">Aún no hay elementos.</p>}
    </section>
  );
}
