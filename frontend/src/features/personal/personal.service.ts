import api from '@/shared/api/apiClient';
import type { Odontologo } from '@/types/odontologo';
import type { Asistente } from '@/types/asistente';
import type { Especialidad } from '@/types/especialidad';

/** ----- LISTADOS ----- */
export async function listarOdontologos(params?: { page?: number; per_page?: number; search?: string }): Promise<Odontologo[]> {
  try {
    const { data } = await api.get('/odontologos', { params });
    const resultado = data?.data ?? data;
    return Array.isArray(resultado) ? resultado : [];
  } catch (error) {
    console.error('Error listando odontologos:', error);
    return [];
  }
}

export async function listarAsistentes(params?: { page?: number; per_page?: number; search?: string }): Promise<Asistente[]> {
  try {
    const { data } = await api.get('/asistentes', { params });
    const resultado = data?.data ?? data;
    return Array.isArray(resultado) ? resultado : [];
  } catch (error) {
    console.error('Error listando asistentes:', error);
    return [];
  }
}

/** ----- USUARIO BASE (común) ----- */
export async function crearUsuario(payload: {
  ci: string; nombre: string; paterno: string; materno?: string;
  fechaNacimiento: string; genero: 'M'|'F'|'Otro';
  telefono: string; correo: string; direccion: string;
  contrasena: string; estado?: boolean;
}) {
  const { data } = await api.post('/usuarios', payload);
  return data; 
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

/** ======== ESPECIALIDADES ======== */
export async function listarEspecialidades(): Promise<Especialidad[]> {
  const { data } = await api.get('/especialidades');
  return (data?.data ?? data) as Especialidad[];
}

export async function crearEspecialidad(payload: { nombre: string; descripcion?: string }) {
  const { data } = await api.post('/especialidades', payload);
  return data?.data ?? data;
}

export async function actualizarEspecialidad(
  idEspecialidad: number,
  payload: Partial<{ nombre: string; descripcion?: string }>
) {
  const { data } = await api.put(`/especialidades/${idEspecialidad}`, payload);
  return data?.data ?? data;
}

export async function eliminarEspecialidad(idEspecialidad: number) {
  const { data } = await api.delete(`/especialidades/${idEspecialidad}`);
  return data;
}

// personal.service.ts
export async function asignarEspecialidadesAOdontologo(
  idUsuarioOdontologo: number,
  especialidades: number[]
) {
  const { data } = await api.post(
    `/odontologos/${idUsuarioOdontologo}/asignar-especialidades`,
    { especialidades }
  );
  return data;
}


/** Obtener un odontólogo por id de usuario (para ver especialidades) */
export async function getOdontologoByUsuario(idUsuario: number) {
  const { data } = await api.get('/odontologos');
  const arr = (data?.data ?? data) as Odontologo[];
  return arr.find((o) => o.usuario?.idUsuario === idUsuario);
}