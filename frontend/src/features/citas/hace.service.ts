import api from '@/shared/api/apiClient';
import type { Hace } from '@/types/hace';
//PARA LOS HORARIOS
import { obtenerCita } from '@/features/citas/citas.service'; // ← ESTA ES LA IMPORTACIÓN QUE TE FALTABA
import type { Cita } from '@/types/cita';

export type HaceCreatePayload = {
  idUsuario_Paciente: number;
  idCita: number;
  idUsuario_Asistente: number;
  idUsuario_Odontologo: number;
  fecha: string;
};

export type HaceUpdatePayload = Partial<HaceCreatePayload>;

export type HacePaginada = {
  data: Hace[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};



// === SERVICIOS ===
export async function listarHace(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  fecha?: string;
  estado?: string;
}): Promise<HacePaginada> {
  try {
    const { data } = await api.get('/hace', { params });
    return data ?? { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
  } catch (error) {
    console.error('Error listando hace:', error);
    return { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
  }
}

export async function crearHace(payload: HaceCreatePayload): Promise<Hace | null> {
  try {
    const { data } = await api.post('/hace', payload);
    return data?.data ?? data ?? null;
  } catch (error) {
    console.error('Error creando hace:', error);
    return null;
  }
}

export async function obtenerHace(id: number): Promise<Hace | null> {
  try {
    const { data } = await api.get(`/hace/${id}`);
    return data?.data ?? data ?? null;
  } catch (error) {
    console.error(`Error obteniendo hace ${id}:`, error);
    return null;
  }
}

export async function actualizarHace(id: number, payload: HaceUpdatePayload): Promise<Hace | null> {
  try {
    const { data } = await api.put(`/hace/${id}`, payload);
    return data?.data ?? data ?? null;
  } catch (error) {
    console.error(`Error actualizando hace ${id}:`, error);
    return null;
  }
}

export async function eliminarHace(id: number): Promise<boolean> {
  try {
    await api.delete(`/hace/${id}`);
    return true;
  } catch (error) {
    console.error(`Error eliminando hace ${id}:`, error);
    return false;
  }
}

export async function obtenerHacePorOdontologoYFecha(
  fecha: string,
  idOdontologo: number
): Promise<Hace[]> {
  try {
    const { data } = await api.get('/hace', {
      params: { fecha, idUsuario_Odontologo: idOdontologo }
    });

    const result = data?.data ?? data;
    return Array.isArray(result) ? result : [];

  } catch (error) {
    console.error('Error obteniendo hace:', error);
    return [];
  }
}

/**
 * Devuelve solo las horas ocupadas (formato "14:00") del odontólogo en una fecha específica
 */
export const obtenerHorasOcupadas = async (
  fecha: string,
  odontologoId: number
): Promise<string[]> => {
  try {
    const haceList = await obtenerHacePorOdontologoYFecha(fecha, odontologoId);

    // Solo nos interesan los "hace" que ya tengan cita asignada
    const haceConCita = haceList.filter((h): h is Hace & { idCita: number } => 
      !!h.idCita
    );

    if (haceConCita.length === 0) {
      return []; // no hay citas ese día → todo libre
    }

    // Obtenemos todas las citas de una sola vez (mucho más rápido y limpio)
    const citas = await Promise.all(
      haceConCita.map(h => obtenerCita(h.idCita))
    );

    // Filtramos citas válidas y extraemos solo la hora (ej: "14:30:00" → "14:30")
    return citas
      .filter((cita): cita is Cita => cita !== null)
      .map(cita => cita.hora.substring(0, 5));

  } catch (error) {
    console.error('Error obteniendo horas ocupadas:', error);
    return [];
  }
};