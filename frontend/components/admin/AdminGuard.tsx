"use client";
// Protege todas las rutas /admin: solo entra quien tenga sesión con rol ADMIN.
// (La seguridad real está en el backend; esto solo evita mostrar pantallas a quien no corresponde.)
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AuthUser } from "@/types/api";
import AdminShell from "./AdminShell";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  // Consulta quién tiene sesión. Si no hay cookie, el backend responde 401 y la consulta falla.
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api<AuthUser>("/auth/me"),
    retry: false,
  });

  const isAdmin = user?.role === "ADMIN";

  // Si terminó de cargar y no es administrador, se redirige al login.
  useEffect(() => {
    if (!isLoading && !isLoginPage && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isLoading, isLoginPage, isAdmin, router]);

  // La pantalla de login se muestra sin la estructura del panel.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Mientras se verifica la sesión (o se redirige) no se muestra nada del panel.
  if (isLoading || !user || !isAdmin) {
    return <p className="p-8 text-sm text-charcoal-soft">Verificando sesión…</p>;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
