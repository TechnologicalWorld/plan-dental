import { useState } from "react";
import { useTratamientos } from "../hooks/useTratamientos";
import TratamientosTable from "../components/TratamientosTable";
import { TratamientoFormModal } from "../components/TratamientoFormModal";
import type { Tratamiento } from "@/types/tratamiento";

export default function TratamientosListPage() {
  const { rows, loading, error, onCreate, onUpdate, onDelete } =
    useTratamientos();

  const [openNew, setOpenNew] = useState(false);
  const [editRow, setEditRow] = useState<Tratamiento | null>(null);

  return (
    <div className="w-full max-w-full min-w-0 space-y-4">
      {/* Tabla + filtros */}
      <TratamientosTable
        rows={rows}
        loading={loading}
        error={error}
        onNew={() => setOpenNew(true)}
        onEdit={(row) => setEditRow(row)}
        onDelete={(row) => onDelete(row.idTratamiento)}
      />

      {/* Crear */}
      <TratamientoFormModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        onSubmit={async (payload) => {
          await onCreate(payload as any);
          // onCreate ya recarga la lista
        }}
      />

      {/* Editar */}
      <TratamientoFormModal
        open={!!editRow}
        defaultValues={editRow ?? undefined}
        onClose={() => setEditRow(null)}
        onSubmit={async (payload) => {
          if (!editRow) return;
          await onUpdate(editRow.idTratamiento, payload as any);
        }}
      />
    </div>
  );
}
