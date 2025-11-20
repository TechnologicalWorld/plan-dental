import api from '@/shared/api/apiClient';
import type { Paciente } from '@/types/paciente';  
import type { Usuario } from '@/types/usuario';
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

// -------- TIPADO PARA MI PERFIL --------

export type PacientePerfil = {
  idUsuario_Paciente: number;
  codigoSeguro?: string;
  lugarNacimiento?: string;
  domicilio?: string;
  fechaIngreso?: string;

  usuario: {
    idUsuario: number;
    ci?: string;
    nombre: string;
    paterno?: string;
    materno?: string;
    fechaNacimiento?: string;
    genero?: 'M' | 'F';
    telefono?: string;
    correo?: string;
    direccion?: string;
  };
};

export async function obtenerUsuarioActual(): Promise<Usuario> {
  try {
    const { data } = await api.get('/user');
    const user = data.usuario;
    if (!user || user.idUsuario === undefined || user.idUsuario === null) {
      throw new Error('Usuario no válido o no autenticado');
    }
    
    return user;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    throw error;
  }
}

export async function obtenerPacientePorId(idUsuario: number): Promise<Paciente> {
  try {
    if (!idUsuario || isNaN(idUsuario)) {
      throw new Error('ID de usuario no válido');
    }

    const { data } = await api.get(`/pacientes/${idUsuario}`);
    const p = (data?.data ?? data) as Paciente;
    return p;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`No se encontró paciente para el usuario ${idUsuario}`);
      return {
        idUsuario_Paciente: idUsuario,
      } as Paciente;
    }
    console.error(`Error obteniendo paciente con ID ${idUsuario}:`, error);
    throw error;
  }
}

export async function obtenerMiPerfil(): Promise<PacientePerfil> {
  try {
    const user = await obtenerUsuarioActual();
    console.log('Usuario actual obtenido:', user);
    let paciente;
    try {
      paciente = await obtenerPacientePorId(user.idUsuario);
    } catch (error) {
      console.warn('Error obteniendo paciente, usando datos básicos');
      paciente = {
        idUsuario_Paciente: user.idUsuario,
      } as Paciente;
    }

    return {
      idUsuario_Paciente: paciente.idUsuario_Paciente || user.idUsuario,
      codigoSeguro: paciente.codigoSeguro ?? undefined,
      lugarNacimiento: paciente.lugarNacimiento ?? undefined,
      domicilio: paciente.domicilio ?? undefined,
      fechaIngreso: paciente.fechaIngreso ?? undefined,

      usuario: {
        idUsuario: user.idUsuario,
        ci: user.ci,
        nombre: user.nombre,
        paterno: user.paterno,
        materno: user.materno,
        fechaNacimiento: user.fechaNacimiento,
        genero: user.genero as 'M' | 'F',
        telefono: user.telefono,
        correo: user.correo,
        direccion: user.direccion,
      },
    };
  } catch (error) {
    console.error('Error en obtenerMiPerfil:', error);
    throw error;
  }
}

// ====== MI PERFIL: ACTUALIZAR DATOS PERSONALES ======
export async function actualizarMiPerfilDatosPersonales(
  idUsuario: number,
  payload: Partial<{
    nombre: string;
    paterno?: string;
    materno?: string;
    fechaNacimiento?: string;
    genero?: 'M' | 'F';
    telefono?: string;
    correo?: string;
    direccion?: string;
  }>
) {
  const { data } = await api.put(`/usuarios/${idUsuario}`, payload);
  return data;
}

// ====== MI PERFIL: CAMBIAR CONTRASEÑA ======
export async function cambiarPasswordPaciente(
  idUsuario: number,
  payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }
) {
  const { data } = await api.put(`/usuarios/${idUsuario}`, {
    contrasena: payload.password,
  });
  return data;
}
