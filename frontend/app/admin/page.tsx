"use client";
// Dashboard del panel: resumen de productos e inventario.
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";
import { cardClass } from "@/lib/ui";
import type { Dashboard } from "@/types/api";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => api<Dashboard>("/admin/dashboard"),
  });

  // Tarjetas del resumen; "alert" resalta los números que requieren atención.
  const cards = data
    ? [
        { label: "Productos registrados", value: data.totalProducts, href: "/admin/productos" },
        { label: "Productos activos", value: data.activeProducts, href: "/admin/productos" },
        { label: "Productos sin stock", value: data.outOfStockProducts, href: "/admin/inventario", alert: data.outOfStockProducts > 0 },
        { label: "Variantes con stock bajo (5 o menos)", value: data.lowStockVariants, href: "/admin/inventario", alert: data.lowStockVariants > 0 },
        { label: "Categorías", value: data.categories, href: "/admin/categorias" },
        { label: "Marcas", value: data.brands, href: "/admin/categorias" },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-8 text-3xl">Panel</h1>

      {isLoading && <p className="text-sm text-charcoal-soft">Cargando…</p>}
      {error && <p role="alert" className="text-sm text-terracotta-dark">{errorMessage(error)}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`${cardClass} transition-colors hover:border-charcoal`}>
            <p className="text-xs uppercase tracking-widest text-charcoal-soft">{c.label}</p>
            <p className={`mt-2 font-display text-4xl ${c.alert ? "text-terracotta-dark" : ""}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-charcoal-soft">
        Las ventas, los ingresos y los pedidos aparecerán aquí cuando se active la gestión de pedidos.
      </p>
    </div>
  );
}
