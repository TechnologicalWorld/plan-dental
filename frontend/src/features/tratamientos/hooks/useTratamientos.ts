import { useCallback, useEffect, useState } from 'react';
import type { Tratamiento, TratamientoCreate, TratamientoUpdate } from '@/types/tratamiento';
import { getTratamientos, createTratamiento, updateTratamiento, deleteTratamiento } from '../tratamientos.service';

export function useTratamientos() {
  const [rows, setRows] = useState<Tratamiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const list = await getTratamientos();
      setRows(list);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar tratamientos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onCreate = useCallback(async (payload: TratamientoCreate) => {
    await createTratamiento(payload);
    await load();
  }, [load]);

  const onUpdate = useCallback(async (id: number, payload: TratamientoUpdate) => {
    await updateTratamiento(id, payload);
    await load();
  }, [load]);

  const onDelete = useCallback(async (id: number) => {
    await deleteTratamiento(id);
    await load();
  }, [load]);

  return { rows, loading, error, reload: load, onCreate, onUpdate, onDelete };
}
