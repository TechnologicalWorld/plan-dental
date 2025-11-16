import api from '@/shared/api/apiClient';
import type { Hace } from '@/types/hace';

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