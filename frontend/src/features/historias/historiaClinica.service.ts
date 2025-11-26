import api from '@/shared/api/apiClient';
import type {
  HistoriaClinica,
  PacienteMin,
  OdontogramaMin,
  PiezaDentalMin,
  EvolucionMin,
  PlanMin,
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

export async function createHistoria(payload: Partial<HistoriaClinica>) {
  const { data } = await api.post('/historias-clinicas', payload);
  return data.data as HistoriaClinica;
}

export async function updateHistoria(id: number, payload: Partial<HistoriaClinica>) {
  const { data } = await api.put(`/historias-clinicas/${id}`, payload);
  return data.data as HistoriaClinica;
}

export async function fetchPaciente(id: number) {
  const { data } = await api.get(`/pacientes/${id}`);
  return data as PacienteMin;
}

export async function fetchOdontogramas(): Promise<OdontogramaMin[]> {
  const { data } = await api.get('/odontogramas');
  return (data.data ?? []) as OdontogramaMin[];
}

export async function fetchPiezas(): Promise<PiezaDentalMin[]> {
  const { data } = await api.get('/piezas-dentales');
  return data as PiezaDentalMin[];
}

export async function fetchEvoluciones(): Promise<EvolucionMin[]> {
  const { data } = await api.get('/evoluciones');
  return (data.data ?? []) as EvolucionMin[];
}

export async function buildMiniOdontogramaForPaciente(pacienteId: number) {
  const [odontogramas, piezas, evoluciones] = await Promise.all([
    fetchOdontogramas(),
    fetchPiezas(),
    fetchEvoluciones(),
  ]);

  const candidatos = odontogramas.filter((o) =>
    (o.planes ?? []).some((p: PlanMin) => p.idUsuario_Paciente === pacienteId),
  );

  if (!candidatos.length) {
    return { odontograma: null as OdontogramaMin | null, piezas: [] as PiezaDentalMin[], evoluciones: [] as EvolucionMin[] };
  }

  const odontograma = [...candidatos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  )[0];

  const piezasDeEse = piezas.filter((pz) => pz.idOdontograma === odontograma.idOdontograma);
  const idsPiezas = new Set(piezasDeEse.map((p) => p.idPieza));
  const evolDeEse = evoluciones.filter((ev) => idsPiezas.has(ev.idPieza));

  return { odontograma, piezas: piezasDeEse, evoluciones: evolDeEse };
}
