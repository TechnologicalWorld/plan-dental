import { useEffect, useState, useCallback } from 'react';
import type { HistoriaClinica, PacienteMin, OdontogramaMin, PiezaDentalMin, EvolucionMin } from '@/types/historia';
import { fetchHistoriaPorPaciente, buildMiniOdontogramaForPaciente } from '../historiaClinica.service';

export function useHistoriaClinica(pacienteId?: number) {
  const [loading, setLoading] = useState(false);
  const [paciente, setPaciente] = useState<PacienteMin | null>(null);
  const [historia, setHistoria] = useState<HistoriaClinica | null>(null);
  const [odontograma, setOdontograma] = useState<OdontogramaMin | null>(null);
  const [piezas, setPiezas] = useState<PiezaDentalMin[]>([]);
  const [evoluciones, setEvoluciones] = useState<EvolucionMin[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!pacienteId) return;
    setLoading(true);
    setError(null);
    try {
      const { paciente, historia } = await fetchHistoriaPorPaciente(pacienteId);
      setPaciente(paciente);
      setHistoria(historia);

      const mini = await buildMiniOdontogramaForPaciente(pacienteId);
      setOdontograma(mini.odontograma);
      setPiezas(mini.piezas);
      setEvoluciones(mini.evoluciones);
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando historia clínica');
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => { load(); }, [load]);

  return { loading, error, paciente, historia, odontograma, piezas, evoluciones, reload: load };
}
