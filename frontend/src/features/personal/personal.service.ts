import api from '@/shared/api/apiClient';
import type { Odontologo } from '@/types/odontologo';
import type { Asistente } from '@/types/asistente';

/** ----- LISTADOS ----- */
export async function listarOdontologos(): Promise<Odontologo[]> {
  const { data } = await api.get('/odontologos');
  // tu backend suele devolver { data: [...] } o directamente [...]
  return (data?.data ?? data) as Odontologo[];
}

export async function listarAsistentes(): Promise<Asistente[]> {
  const { data } = await api.get('/asistentes');
  return (data?.data ?? data) as Asistente[];
}

/** ----- USUARIO BASE (común) ----- */
export async function crearUsuario(payload: {
  ci: string; nombre: string; paterno: string; materno?: string;
  fechaNacimiento: string; genero: 'M'|'F'|'Otro';
  telefono: string; correo: string; direccion: string;
  contrasena: string; estado?: boolean;
}) {
  const { data } = await api.post('/usuarios', payload);
  return data; // devuelve el usuario creado (idUsuario, etc.)
}

/** ----- ROLES: ODONTOLOGO / ASISTENTE ----- */
export async function crearOdontologo(payload: {
  idUsuario_Odontologo: number;
  fechaContratacion: string;
  horario: string;
}) {
  const { data } = await api.post('/odontologos', payload);
  return data;
}

export async function crearAsistente(payload: {
  idUsuario_Asistente: number;
  turno: string;
  fechaContratacion: string;
}) {
  const { data } = await api.post('/asistentes', payload);
  return data;
}

export async function actualizarOdontologo(
  id: number,
  payload: Partial<{ fechaContratacion: string; horario: string }>
) {
  const { data } = await api.put(`/odontologos/${id}`, payload);
  return data;
}

export async function actualizarAsistente(
  id: number,
  payload: Partial<{ turno: string; fechaContratacion: string }>
) {
  const { data } = await api.put(`/asistentes/${id}`, payload);
  return data;
}

export async function eliminarOdontologo(id: number) {
  const { data } = await api.delete(`/odontologos/${id}`);
  return data;
}

export async function eliminarAsistente(id: number) {
  const { data } = await api.delete(`/asistentes/${id}`);
  return data;
}

/** ----- Toggle estado de USUARIO (botón de estado) ----- */
export async function actualizarEstadoUsuario(idUsuario: number, estado: boolean) {
  const { data } = await api.put(`/usuarios/${idUsuario}`, { estado });
  return data;
}

/** ----- USUARIO COMÚN: ver / editar / eliminar ----- */
export async function getUsuario(idUsuario: number) {
  const { data } = await api.get(`/usuarios/${idUsuario}`);
  return data; // UsuarioCore
}

export async function updateUsuario(
  idUsuario: number,
  payload: Partial<{
    ci: string;
    nombre: string;
    paterno: string;
    materno?: string;
    fechaNacimiento?: string;
    genero?: 'M' | 'F';
    telefono?: string;
    correo?: string;
    direccion?: string;
    estado?: boolean;
  }>
) {
  const { data } = await api.put(`/usuarios/${idUsuario}`, payload);
  return data; // UsuarioCore actualizado
}

export async function deleteUsuario(idUsuario: number) {
  await api.delete(`/usuarios/${idUsuario}`);
  return true;
}
