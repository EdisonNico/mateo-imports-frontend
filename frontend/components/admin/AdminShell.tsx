"use client";
// Estructura del panel: barra lateral (en móvil se abre con un botón) y área de contenido.
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Boxes, LayoutDashboard, LogOut, Menu, Package, Store, Tags, X } from "lucide-react";
import Logo from "@/components/Logo";
import { api } from "@/lib/api";
import type { AuthUser } from "@/types/api";

// Secciones del panel.
const items = [
  { label: "Panel", href: "/admin", icon: LayoutDashboard },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Inventario", href: "/admin/inventario", icon: Boxes },
  { label: "Categorías y marcas", href: "/admin/categorias", icon: Tags },
];

export default function AdminShell({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // Menú lateral en móvil

  // Cierra la sesión en el servidor (borra la cookie) y vuelve al login.
  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => undefined);
    queryClient.clear();
    router.replace("/admin/login");
  }

  // "Panel" solo está activo en /admin exacto; las demás secciones también en sus subrutas.
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Barra superior solo en móvil. */}
      <div className="flex h-16 items-center justify-between border-b border-cream-dark px-4 lg:hidden">
        <Logo />
        <button aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Barra lateral: fija en escritorio, desplegable en móvil. */}
      <aside
        className={`${open ? "block" : "hidden"} border-b border-cream-dark bg-charcoal text-cream lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0`}
      >
        <div className="hidden px-6 py-8 lg:block">
          <Logo variant="light" />
        </div>
        <nav aria-label="Panel administrativo" className="px-3 pb-4 pt-2 lg:pt-0">
          <ul className="space-y-1">
            {items.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    isActive(href) ? "bg-terracotta text-cream" : "text-cream/80 hover:bg-cream/10"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-1 border-t border-cream/10 pt-4">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream/80 hover:bg-cream/10">
              <Store size={18} aria-hidden="true" /> Ver tienda
            </Link>
            <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-cream/80 hover:bg-cream/10">
              <LogOut size={18} aria-hidden="true" /> Cerrar sesión
            </button>
            <p className="truncate px-3 pt-3 text-xs text-cream/50">{user.email}</p>
          </div>
        </nav>
      </aside>

      {/* min-w-0 evita que las tablas anchas desborden la página. */}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
