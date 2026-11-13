// Validación del formulario de producto (Zod).
// Los campos numéricos se manejan como texto en el formulario y se convierten al enviar.
import { z } from "zod";

// Monto mayor a 0.
const requiredMoney = z
  .string()
  .trim()
  .refine((v) => v !== "" && Number(v) > 0, "Ingresa un monto mayor a 0");

// Esquema de cada variante (talla + color + stock).
const variantSchema = z.object({
  size: z.string().trim().min(1, "La talla es obligatoria").max(20, "Máximo 20 caracteres"),
  color: z.string().trim().min(1, "El color es obligatorio").max(40, "Máximo 40 caracteres"),
  stock: z.string().trim().refine((v) => /^\d+$/.test(v), "Ingresa un número entero (0 o más)"),
});

export const productSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio").max(160, "Máximo 160 caracteres"),
    description: z.string().max(5000, "Máximo 5000 caracteres"),
    categoryId: z.string().min(1, "Selecciona una categoría"),
    brandId: z.string(), // vacío = sin marca
    gender: z.enum(["HOMBRE", "MUJER", "UNISEX"]),
    price: requiredMoney,
    oldPrice: z.string().trim().refine((v) => v === "" || Number(v) > 0, "Ingresa un monto mayor a 0"),
    active: z.boolean(),
    variants: z.array(variantSchema).min(1, "Agrega al menos una variante"),
  })
  // El precio anterior (si existe) debe ser mayor al precio actual.
  .refine((d) => d.oldPrice === "" || Number(d.oldPrice) > Number(d.price), {
    path: ["oldPrice"],
    message: "El precio anterior debe ser mayor al precio actual",
  })
  // No se permiten dos variantes con la misma talla y color.
  .refine(
    (d) => {
      const keys = d.variants.map((v) => `${v.size.trim().toLowerCase()}|${v.color.trim().toLowerCase()}`);
      return new Set(keys).size === keys.length;
    },
    { path: ["variants"], message: "Hay variantes repetidas (misma talla y color)" },
  );

// Tipo de los valores del formulario, deducido del esquema.
export type ProductFormValues = z.infer<typeof productSchema>;
