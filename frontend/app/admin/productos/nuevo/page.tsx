"use client";
// Página para crear un producto nuevo.
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-3xl">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
