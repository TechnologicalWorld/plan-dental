import { useMemo, useState } from 'react';
import { useTratamientos } from '../hooks/useTratamientos';
import TratamientosTable from '../components/TratamientosTable';
import { TratamientoFormModal } from '../components/TratamientoFormModal';
import type { Tratamiento } from '@/types/tratamiento';

export default function TratamientosListPage() {
  const { rows, loading, error, onCreate, onUpdate, onDelete } = useTratamientos();
  const [openNew, setOpenNew] = useState(false);
  const [editRow, setEditRow] = useState<Tratamiento | null>(null);

  return (
    <div className="w-full max-w-full min-w-0 p-4">
      

      {loading && <div className="py-6">Cargando…</div>}
      {error && <div className="py-6 text-red-600">{error}</div>}

      {!loading && !error && (
        <TratamientosTable
          rows={rows}
          onEdit={(row) => setEditRow(row)}
          onDelete={(row) => onDelete(row.idTratamiento)}
        />
      )}

      {/* Crear */}
      <TratamientoFormModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        onSubmit={onCreate}
      />

      {/* Editar */}
      <TratamientoFormModal
        open={!!editRow}
        onClose={() => setEditRow(null)}
        onSubmit={(payload) => onUpdate(editRow!.idTratamiento, payload as any)}
        defaultValues={editRow ?? undefined}
      />
    </div>
  );
}
