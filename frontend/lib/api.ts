// Cliente HTTP para comunicarse con el backend Spring Boot.
// La sesión viaja en una cookie HttpOnly, por eso todas las peticiones usan credentials: "include".

// URL base de la API (se define en .env.local).
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// Error con el estado HTTP y los errores por campo que devuelve el backend.
export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// Opciones de una petición: método, cuerpo JSON o formulario con archivos.
interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  formData?: FormData;
}

// Hace una petición a la API y devuelve el JSON ya tipado.
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;

  if (options.formData) {
    // Con FormData el navegador agrega solo el Content-Type correcto (multipart).
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
    credentials: "include", // Envía y recibe la cookie de sesión
  });

  // 204 = sin contenido (por ejemplo, al eliminar o cerrar sesión).
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? "Ocurrió un error. Inténtalo nuevamente.",
      data?.errors ?? {},
    );
  }
  return data as T;
}

// Convierte cualquier error en un mensaje legible para mostrar en pantalla.
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // Si hay errores por campo, se agregan al mensaje principal.
    const details = Object.values(error.fieldErrors);
    return details.length > 0 ? `${error.message} ${details.join(" ")}` : error.message;
  }
  return "No se pudo conectar con el servidor.";
}
