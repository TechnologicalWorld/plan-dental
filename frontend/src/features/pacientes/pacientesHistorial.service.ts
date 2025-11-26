import api from '@/shared/api/apiClient';
import type {
  HistoriaClinica,
  PacienteMin,
} from '@/types/historia';

export async function fetchHistoriaPorPaciente(pacienteId: number) {
  const { data } = await api.get(`/historias-clinicas/paciente/${pacienteId}`);
  const paciente: PacienteMin = data.paciente;
  const historia: HistoriaClinica | null = data.paciente?.historias_clinicas ?? null;
  return { paciente, historia };
}

export async function fetchHistoriaById(id: number) {
  const { data } = await api.get(`/historias-clinicas/${id}`);
  return data.data as HistoriaClinica;
}