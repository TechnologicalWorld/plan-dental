import api from '@/shared/api/apiClient';

export async function listarPacientes(params?: { page?: number; per_page?: number; search?: string }) {
  const { data } = await api.get('/pacientes', { params });
  return data;
}

export async function registrarPaciente(payload: {
  ci: string; nombre: string; paterno: string; materno?: string;
  fechaNacimiento?: string; genero?: 'M'|'F';
  telefono?: string; contrasena: string; correo: string; direccion?: string;
  codigoSeguro?: string; lugarNacimiento?: string; domicilio?: string; fechaIngreso: string;
}) {
  const body = { device_name: 'react-app', ...payload };
  const { data } = await api.post('/register', body);
  return data;
}

export async function actualizarPaciente(
  idUsuario_Paciente: number,
  payload: Partial<{ codigoSeguro: string; lugarNacimiento: string; domicilio: string; fechaIngreso: string }>
) {
  const { data } = await api.put(`/pacientes/${idUsuario_Paciente}`, payload);
  return data;
}

export async function eliminarPaciente(idUsuario_Paciente: number) {
  const { data } = await api.delete(`/pacientes/${idUsuario_Paciente}`);
  return data;
}

export async function actualizarEstadoUsuario(idUsuario: number, estado: boolean) {
  const { data } = await api.put(`/usuarios/${idUsuario}`, { estado });
  return data;
}
