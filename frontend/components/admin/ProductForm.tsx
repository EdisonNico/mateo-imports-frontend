"use client";
// Formulario para crear y editar productos (datos, variantes y fotos).
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { btnOutline, btnPrimary, btnSmall, cardClass, fieldErrorClass, inputClass, labelClass } from "@/lib/ui";
import { productSchema, type ProductFormValues } from "@/schemas/product";
import type { ImageInfo, NamedItem, ProductDetail, UploadResult } from "@/types/api";

export default function ProductForm({ initial }: { initial?: ProductDetail }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Listas para los selectores.
  const categories = useQuery({ queryKey: ["categories"], queryFn: () => api<NamedItem[]>("/categories") });
  const brands = useQuery({ queryKey: ["brands"], queryFn: () => api<NamedItem[]>("/brands") });

  // Las fotos se manejan aparte del formulario porque se suben una por una a Cloudinary.
  const [images, setImages] = useState<ImageInfo[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    // Si se está editando, se cargan los datos actuales (los números pasan a texto).
    defaultValues: initial
      ? {
          name: initial.name,
          description: initial.description ?? "",
          categoryId: String(initial.categoryId),
          brandId: initial.brandId ? String(initial.brandId) : "",
          gender: initial.gender,
          price: String(initial.price),
          oldPrice: initial.oldPrice ? String(initial.oldPrice) : "",
          active: initial.active,
          variants: initial.variants.map((v) => ({ size: v.size, color: v.color, stock: String(v.stock) })),
        }
      : {
          name: "",
          description: "",
          categoryId: "",
          brandId: "",
          gender: "UNISEX",
          price: "",
          oldPrice: "",
          active: true,
          variants: [{ size: "", color: "", stock: "0" }],
        },
  });

  // Lista dinámica de variantes (agregar y quitar filas).
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  // Guarda el producto: POST si es nuevo, PUT si se edita.
  const save = useMutation({
    mutationFn: (values: ProductFormValues) => {
      const body = {
        name: values.name,
        description: values.description.trim() === "" ? null : values.description,
        categoryId: Number(values.categoryId),
        brandId: values.brandId === "" ? null : Number(values.brandId),
        price: Number(values.price),
        oldPrice: values.oldPrice === "" ? null : Number(values.oldPrice),
        gender: values.gender,
        active: values.active,
        variants: values.variants.map((v) => ({ size: v.size, color: v.color, stock: Number(v.stock) })),
        images, // La primera es la foto principal
      };
      return initial
        ? api(`/products/${initial.id}`, { method: "PUT", body })
        : api("/products", { method: "POST", body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      router.push("/admin/productos");
    },
    onError: (e) => setMessage(errorMessage(e)),
  });

  // Sube las fotos elegidas al backend (que las envía a Cloudinary).
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage(null);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await api<UploadResult>("/admin/uploads", { method: "POST", formData });
        setImages((prev) => [...prev, { url: result.url, publicId: result.publicId }]);
      }
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setUploading(false);
    }
  }

  // Mueve una foto al inicio para que sea la principal.
  function makeMain(index: number) {
    setImages((prev) => [prev[index], ...prev.filter((_, i) => i !== index)]);
  }

  return (
    <form onSubmit={handleSubmit((values) => { setMessage(null); save.mutate(values); })} noValidate className="space-y-6">
      {/* ===== Datos generales ===== */}
      <section className={`${cardClass} space-y-4`}>
        <h2 className="font-sans text-lg font-semibold">Datos del producto</h2>

        <div>
          <label htmlFor="name" className={labelClass}>Nombre</label>
          <input id="name" className={inputClass} {...register("name")} />
          {errors.name && <p className={fieldErrorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Descripción</label>
          <textarea id="description" rows={4} className={inputClass} {...register("description")} />
          {errors.description && <p className={fieldErrorClass}>{errors.description.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="categoryId" className={labelClass}>Categoría</label>
            <select id="categoryId" className={inputClass} {...register("categoryId")}>
              <option value="">Selecciona…</option>
              {categories.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className={fieldErrorClass}>{errors.categoryId.message}</p>}
          </div>
          <div>
            <label htmlFor="brandId" className={labelClass}>Marca</label>
            <select id="brandId" className={inputClass} {...register("brandId")}>
              <option value="">Sin marca</option>
              {brands.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="gender" className={labelClass}>Género</label>
            <select id="gender" className={inputClass} {...register("gender")}>
              <option value="UNISEX">Unisex</option>
              <option value="HOMBRE">Hombre</option>
              <option value="MUJER">Mujer</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={labelClass}>Precio (S/)</label>
            <input id="price" inputMode="decimal" className={inputClass} {...register("price")} />
            {errors.price && <p className={fieldErrorClass}>{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="oldPrice" className={labelClass}>Precio anterior (S/, opcional)</label>
            <input id="oldPrice" inputMode="decimal" className={inputClass} {...register("oldPrice")} />
            {errors.oldPrice && <p className={fieldErrorClass}>{errors.oldPrice.message}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("active")} />
          Visible en la tienda
        </label>
      </section>

      {/* ===== Variantes ===== */}
      <section className={`${cardClass} space-y-4`}>
        <h2 className="font-sans text-lg font-semibold">Tallas, colores y stock</h2>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr_1fr_5rem_auto] items-start gap-2">
            <div>
              <label htmlFor={`size-${index}`} className="sr-only">Talla</label>
              <input id={`size-${index}`} placeholder="Talla (M, 32…)" className={inputClass} {...register(`variants.${index}.size`)} />
              {errors.variants?.[index]?.size && <p className={fieldErrorClass}>{errors.variants[index]?.size?.message}</p>}
            </div>
            <div>
              <label htmlFor={`color-${index}`} className="sr-only">Color</label>
              <input id={`color-${index}`} placeholder="Color" className={inputClass} {...register(`variants.${index}.color`)} />
              {errors.variants?.[index]?.color && <p className={fieldErrorClass}>{errors.variants[index]?.color?.message}</p>}
            </div>
            <div>
              <label htmlFor={`stock-${index}`} className="sr-only">Stock</label>
              <input id={`stock-${index}`} inputMode="numeric" placeholder="Stock" className={inputClass} {...register(`variants.${index}.stock`)} />
              {errors.variants?.[index]?.stock && <p className={fieldErrorClass}>{errors.variants[index]?.stock?.message}</p>}
            </div>
            <button
              type="button"
              aria-label="Quitar variante"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="p-2 text-charcoal hover:text-terracotta disabled:opacity-30"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {/* Errores generales de la lista (por ejemplo, variantes repetidas). */}
        {errors.variants?.message && <p className={fieldErrorClass}>{errors.variants.message}</p>}
        {errors.variants?.root?.message && <p className={fieldErrorClass}>{errors.variants.root.message}</p>}

        <button type="button" className={btnSmall} onClick={() => append({ size: "", color: "", stock: "0" })}>
          <Plus size={14} className="mr-1" aria-hidden="true" /> Agregar variante
        </button>
      </section>

      {/* ===== Fotos ===== */}
      <section className={`${cardClass} space-y-4`}>
        <h2 className="font-sans text-lg font-semibold">Fotos</h2>
        <p className="text-sm text-charcoal-soft">JPG, PNG o WEBP de hasta 5 MB. La primera foto es la principal.</p>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
          aria-label="Subir fotos del producto"
          className="text-sm"
        />
        {uploading && <p className="text-sm text-charcoal-soft">Subiendo…</p>}

        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((img, index) => (
              <li key={img.url} className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={`Foto ${index + 1}`} className="aspect-square w-full object-cover" />
                <div className="flex flex-wrap items-center gap-2">
                  {index === 0 ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta-dark">Principal</span>
                  ) : (
                    <button type="button" className={btnSmall} onClick={() => makeMain(index)}>Hacer principal</button>
                  )}
                  <button type="button" className={btnSmall} onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}>
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {message && <p role="alert" className="text-sm text-terracotta-dark">{message}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={save.isPending || uploading} className={btnPrimary}>
          {save.isPending ? "Guardando…" : initial ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" className={btnOutline} onClick={() => router.push("/admin/productos")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
