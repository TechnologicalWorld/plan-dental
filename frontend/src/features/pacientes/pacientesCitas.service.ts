import api from "@/shared/api/apiClient";
import type { Cita } from "@/types/cita";

export async function fetchCitasPorPaciente(idUsuario: number): Promise<Cita[]> {
  const { data } = await api.get(`/pacientes/${idUsuario}/citas`);

  const citas: Cita[] = data.citas ?? [];

  return citas;
}

/**
 * Listar especialidades
 */
export async function fetchEspecialidades() {
  const { data } = await api.get("/especialidades");

  const especialidades = data.data ?? [];

  return especialidades;
}

/**
 * Odontólogos por especialidad
 */
export async function fetchOdontologosPorEspecialidad(idEspecialidad: number) {
  const { data } = await api.get(`/especialidades/${idEspecialidad}/odontologos`);

  const odontologos = data.data ?? [];

  return odontologos;
}

/**
 * Agenda completa del odontólogo
 */
export async function fetchAgendaOdontologo(idOdontologo: number) {
  const { data } = await api.get(`/odontologos/${idOdontologo}/agenda`);

  const agenda = data.agenda ?? [];

  return agenda;
}

/**
 * Agendar cita
 */
export async function agendarCita(payload: {
  idUsuario_Paciente: number;
  idUsuario_Odontologo: number;
  fecha: string; 
  hora: string;  
  tipoCita: string;
  costo?: number;
}) {
  const { data } = await api.post("/citas", payload);

  return data.data ?? data;
}
