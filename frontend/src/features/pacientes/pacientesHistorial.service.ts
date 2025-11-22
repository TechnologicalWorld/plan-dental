// src/services/pacientesHistorial.service.ts
import api from '@/shared/api/apiClient';
import type {
  HistoriaClinica,
  PacienteMin,
} from '@/types/historia';

export async function fetchHistoriaPorPaciente(pacienteId: number) {
  const { data } = await api.get(`/historias-clinicas/paciente/${pacienteId}`);
  // el backend envía { success, paciente: { usuario, historias_clinicas: {...} } }
  const paciente: PacienteMin = data.paciente;
  const historia: HistoriaClinica | null = data.paciente?.historias_clinicas ?? null;
  return { paciente, historia };
}

export async function fetchHistoriaById(id: number) {
  const { data } = await api.get(`/historias-clinicas/${id}`);
  return data.data as HistoriaClinica;
}