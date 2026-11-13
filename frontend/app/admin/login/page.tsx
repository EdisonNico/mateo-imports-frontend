"use client";
// Pantalla de inicio de sesión del panel administrativo.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Logo from "@/components/Logo";
import { api, errorMessage } from "@/lib/api";
import { btnPrimary, fieldErrorClass, inputClass, labelClass } from "@/lib/ui";
import { loginSchema, type LoginValues } from "@/schemas/auth";
import type { AuthUser } from "@/types/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      const user = await api<AuthUser>("/auth/login", { method: "POST", body: values });

      // Un cliente puede iniciar sesión, pero no entrar al panel: se cierra su sesión de inmediato.
      if (user.role !== "ADMIN") {
        await api("/auth/logout", { method: "POST" }).catch(() => undefined);
        setError("Esta cuenta no tiene acceso al panel administrativo.");
        return;
      }

      // Guarda al usuario en la caché para que el guard no vuelva a consultarlo.
      queryClient.setQueryData(["me"], user);
      router.replace("/admin");
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-6 text-center text-2xl">Acceso administrador</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 border border-cream-dark bg-white p-6">
          <div>
            <label htmlFor="email" className={labelClass}>Correo</label>
            <input id="email" type="email" autoComplete="username" className={inputClass} {...register("email")} />
            {errors.email && <p className={fieldErrorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Contraseña</label>
            <input id="password" type="password" autoComplete="current-password" className={inputClass} {...register("password")} />
            {errors.password && <p className={fieldErrorClass}>{errors.password.message}</p>}
          </div>

          {/* role="alert" hace que los lectores de pantalla anuncien el error. */}
          {error && <p role="alert" className="text-sm text-terracotta-dark">{error}</p>}

          <button type="submit" disabled={isSubmitting} className={`${btnPrimary} w-full`}>
            {isSubmitting ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
