"use client";
// Administración de categorías y marcas.
import NamedListManager from "@/components/admin/NamedListManager";

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl">Categorías y marcas</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        <NamedListManager title="Categorías" readPath="/categories" adminPath="/admin/categories" queryKey="categories" />
        <NamedListManager title="Marcas" readPath="/brands" adminPath="/admin/brands" queryKey="brands" />
      </div>
    </div>
  );
}
