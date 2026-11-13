// Validación del formulario de inicio de sesión (Zod).
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "El correo es obligatorio").email("El correo no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

// Tipo de los valores del formulario, deducido del esquema.
export type LoginValues = z.infer<typeof loginSchema>;
