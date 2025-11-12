import api from "@/shared/api/apiClient";
import type { Cita } from "@/types/cita";
import { extractHHmm, combineDateAndTime, addMinutes } from "@/shared/utils/dateHelper";

/** Tipo de evento para el calendario */
export type AgendaEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  estado: string;
  tipoCita: string;
  raw: Cita;
};

type OdontologoData = {
  idUsuario_Odontologo: number;
  usuario?: {
    idUsuario: number;
    nombre?: string;
    paterno?: string;
  };
};

type AgendaResponse = {
  message?: string;
  agenda: {
    idUsuario_Odontologo: number;
    usuario?: {
      idUsuario: number;
      nombre?: string;
      paterno?: string;
    };
    citas: Cita[];
  };
};

/**
 * Busca el odontólogo asociado al usuario actual
 * Primero intenta por ID directo, si falla lista todos y filtra
 */
export async function buscarOdontologoPorUsuario(idUsuario: number): Promise<number | null> {
  try {
    // Intento 1: Acceso directo (si idUsuario === idUsuario_Odontologo)
    const { data } = await api.get<OdontologoData>(`/odontologos/${idUsuario}`);
    if (data?.idUsuario_Odontologo) {
      return data.idUsuario_Odontologo;
    }
  } catch {
    // Intento 2: Listar todos y buscar por usuario.idUsuario
    try {
      const { data: response } = await api.get("/odontologos");
      const odontologos = Array.isArray(response?.data) ? response.data : response;
      
      if (Array.isArray(odontologos)) {
        const found = odontologos.find(
          (o: OdontologoData) => o.usuario?.idUsuario === idUsuario
        );
        return found?.idUsuario_Odontologo ?? null;
      }
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Obtiene todas las citas del odontólogo desde el endpoint /agenda
 */
export async function obtenerAgendaOdontologo(idOdontologo: number): Promise<Cita[]> {
  try {
    const { data } = await api.get<AgendaResponse>(`/odontologos/${idOdontologo}/agenda`);
    return data?.agenda?.citas ?? [];
  } catch (error) {
    console.error("Error al obtener agenda:", error);
    return [];
  }
}

/**
 * Convierte una Cita en un evento de calendario
 */
export function convertirCitaAEvento(cita: Cita): AgendaEvent {
  const hhmm = extractHHmm(cita.hora);
  const start = combineDateAndTime(cita.fecha, hhmm);
  const end = addMinutes(start, 60); // duración por defecto 1 hora

  // Construir título con paciente si existe
  let titulo = cita.tipoCita || "Cita";
  if (cita.pacientes && cita.pacientes.length > 0) {
    const paciente = cita.pacientes[0];
    const nombrePaciente = `${paciente.usuario?.nombre ?? ""} ${paciente.usuario?.paterno ?? ""}`.trim();
    if (nombrePaciente) {
      titulo = `${titulo} - ${nombrePaciente}`;
    }
  }

  return {
    id: cita.idCita,
    title: titulo,
    start,
    end,
    estado: cita.estado,
    tipoCita: cita.tipoCita,
    raw: cita,
  };
}

/**
 * Función principal: obtiene todos los eventos de la agenda del odontólogo
 */
export async function obtenerMisEventos(idUsuario: number): Promise<AgendaEvent[]> {
  // 1. Buscar el ID del odontólogo
  const idOdontologo = await buscarOdontologoPorUsuario(idUsuario);
  if (!idOdontologo) {
    throw new Error("No se encontró registro de odontólogo para este usuario");
  }

  // 2. Obtener las citas
  const citas = await obtenerAgendaOdontologo(idOdontologo);

  // 3. Convertir a eventos
  return citas.map(convertirCitaAEvento);
}