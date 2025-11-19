import api from "@/shared/api/apiClient";

export async function fetchHistoriaPorPaciente(pacienteId: number | string) {
  const { data } = await api.get(`/historias-clinicas/paciente/${pacienteId}`);
  return {
    paciente: data.paciente,
    historia: data.paciente?.historias_clinicas ?? null,
  };
}

export async function fetchOdontogramasPacienteClientSide(pacienteId: number | string) {
  const { data } = await api.get("/odontogramas");
  const list = (data?.data ?? []) as any[];
  const pid = Number(pacienteId);
  return list.filter((o) => Array.isArray(o.planes) && o.planes.some((pl: any) => Number(pl.idUsuario_Paciente) === pid));
}
