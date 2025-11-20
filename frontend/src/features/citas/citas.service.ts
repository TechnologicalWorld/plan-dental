import api from '@/shared/api/apiClient';
import type { Cita } from '@/types/cita';

// === TIPOS ===
export type CitaCreatePayload = {
  hora: string;
  fecha: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  tipoCita: string;
  costo: number;
  pagado?: boolean;
  idUsuario_Paciente: number;
  idUsuario_Odontologo: number;
};

export type CitaUpdatePayload = Partial<{
  hora: string;
  fecha: string;
  estado: string;
  tipoCita: string;
  costo: number;
  pagado: boolean;
  observacion?: string;
}>;

export type CitaPaginada = {
  data: Cita[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export async function listarCitas(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  fecha?: string;
  estado?: string;
}): Promise<CitaPaginada> {
  try {
    const { data } = await api.get('/citas', { params });
    return data ?? { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
  } catch (error) {
    console.error('Error listando citas:', error);
    return { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
  }
}

export async function obtenerCita(id: number): Promise<Cita | null> {
  try {
    const { data } = await api.get(`/citas/${id}`);
    return data?.data ?? data ?? null;
  } catch (error) {
    console.error(`Error obteniendo cita ${id}:`, error);
    return null;
  }
}

export async function crearCita(payload: CitaCreatePayload): Promise<Cita | null> {
  try {
    const { data } = await api.post('/citas', payload);
    return data?.data ?? data ?? null;
  } catch (error) {
    console.error('Error creando cita:', error);
    return null;
  }
}

export async function actualizarCita(id: number, payload: CitaUpdatePayload): Promise<Cita | null> {
  try {
    const { data } = await api.put(`/citas/${id}`, payload);
    return data?.data ?? data ?? null;
  } catch (error) {
    console.error(`Error actualizando cita ${id}:`, error);
    return null;
  }
}

export async function eliminarCita(id: number): Promise<boolean> {
  try {
    await api.delete(`/citas/${id}`);
    return true;
  } catch (error) {
    console.error(`Error eliminando cita ${id}:`, error);
    return false;
  }
}

export async function listarCitasPorFecha(fecha: string): Promise<Cita[]> {
  try {
    const { data } = await api.get(`/citas/por-fecha/${fecha}`);
    const result = data?.data ?? data;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Error listando citas por fecha:', error);
    return [];
  }
}