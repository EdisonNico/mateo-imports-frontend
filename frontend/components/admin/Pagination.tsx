// Controles de paginación para las tablas del panel.
import { btnSmall } from "@/lib/ui";

interface PaginationProps {
  page: number;        // Página actual (empieza en 0)
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  // Si hay una sola página no se muestra nada.
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación" className="mt-6 flex items-center justify-between">
      <button className={btnSmall} disabled={page === 0} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span className="text-sm text-charcoal-soft">
        Página {page + 1} de {totalPages}
      </span>
      <button className={btnSmall} disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        Siguiente
      </button>
    </nav>
  );
}
