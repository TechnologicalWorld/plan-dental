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

// -------- TIPADO PARA MI HISTORIAL --------

import type { 
  HistoriaClinica, 
  Diagnostico, 
  PlanTratamiento 
} from '@/types/historial';
import type { Cita } from '@/types/cita';

export type { 
  HistoriaClinica, 
  Diagnostico, 
  PlanTratamiento 
} from '@/types/historial';
// ====== MI HISTORIAL: OBTENER HISTORIAS CLÍNICAS ======
export async function obtenerMisHistoriasClinicas(): Promise<HistoriaClinica[]> {
  try {
    const user = await obtenerUsuarioActual();
    
    const { data } = await api.get(`/historias-clinicas/paciente/${user.idUsuario}`);
    console.log(data);
    const historias = (data?.data ?? data) as HistoriaClinica[];
    
    return Array.isArray(historias) ? historias : [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error('Error obteniendo historias clínicas:', error);
    throw error;
  }
}

// ====== MI HISTORIAL: OBTENER DIAGNÓSTICOS Y TRATAMIENTOS ======
export async function obtenerMisDiagnosticos(): Promise<Diagnostico[]> {
  try {
    const user = await obtenerUsuarioActual();
    
    // Usamos el endpoint de citas y tratamientos del paciente
    const { data } = await api.get(`/citas`, {
      params: { paciente_id: user.idUsuario }
    });
    
    const citas = (data?.data ?? data) as any[];
    
    // Transformar las citas a diagnósticos
    const diagnosticos: Diagnostico[] = [];
    
    for (const cita of citas) {
      if (cita.tratamientos && Array.isArray(cita.tratamientos)) {
        for (const tratamiento of cita.tratamientos) {
          diagnosticos.push({
            idTratamiento: tratamiento.idTratamiento,
            nombre: tratamiento.nombre,
            precio: tratamiento.precio,
            idCita: cita.idCita,
            fecha: cita.fecha,
            cita: {
              fecha: cita.fecha,
              estado: cita.estado,
              odontologo: cita.odontologo
            }
          });
        }
      }
    }
    
    return diagnosticos;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error('Error obteniendo diagnósticos:', error);
    throw error;
  }
}

// ====== MI HISTORIAL: OBTENER PLANES DE TRATAMIENTO ======
export async function obtenerMisPlanesTratamiento(): Promise<PlanTratamiento[]> {
  try {
    const user = await obtenerUsuarioActual();
    
    const { data } = await api.get(`/planes`, {
      params: { paciente_id: user.idUsuario }
    });
    
    const planes = (data?.data ?? data) as PlanTratamiento[];
    
    return Array.isArray(planes) ? planes : [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error('Error obteniendo planes de tratamiento:', error);
    throw error;
  }
}

// ====== MI HISTORIAL: OBTENER HISTORIAL MÉDICO COMPLETO ======
export async function obtenerMiHistorialMedico(): Promise<any> {
  try {
    const user = await obtenerUsuarioActual();
    
    const { data } = await api.get(`/pacientes/${user.idUsuario}/historial-medico`);
    return data?.data ?? data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error obteniendo historial médico:', error);
    throw error;
  }
}

// ====== MI HISTORIAL: OBTENER PIEZAS DENTALES ======
export async function obtenerMisPiezasDentales(): Promise<any[]> {
  try {
    const user = await obtenerUsuarioActual();
    
    const { data } = await api.get(`/pacientes/${user.idUsuario}/piezas-dentales`);
    return Array.isArray(data?.data ?? data) ? (data?.data ?? data) : [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error('Error obteniendo piezas dentales:', error);
    throw error;
  }
}

// ====== MI HISTORIAL: OBTENER DETALLE DE HISTORIA CLÍNICA ======
export async function obtenerDetalleHistoriaClinica(idHistoriaClinica: number): Promise<HistoriaClinica> {
  const { data } = await api.get(`/historias-clinicas/${idHistoriaClinica}`);
  return (data?.data ?? data) as HistoriaClinica;
}

// ====== MI HISTORIAL: OBTENER DETALLE DE TRATAMIENTO ======
export async function obtenerDetalleTratamiento(idTratamiento: number): Promise<any> {
  const { data } = await api.get(`/tratamientos/${idTratamiento}`);
  return data?.data ?? data;
}

// ====== MI HISTORIAL: OBTENER DETALLE DE PLAN TRATAMIENTO ======
export async function obtenerDetallePlanTratamiento(idPlan: number): Promise<PlanTratamiento> {
  const { data } = await api.get(`/planes/${idPlan}`);
  return (data?.data ?? data) as PlanTratamiento;
}

// -------- TIPOS PARA AGENDAR CITAS --------
export type Especialidad = {
  idEspecialidad: number;
  nombre: string;
  descripcion?: string;
};

export type Odontologo = {
  idUsuario_Odontologo: number;
  fechaContratacion?: string;
  horario?: string;
  usuario: {
    idUsuario: number;
    nombre: string;
    paterno?: string;
    materno?: string;
    telefono?: string;
    correo?: string;
  };
  especialidades?: Especialidad[];
};

export type HorarioDisponible = {
  fecha: string;
  hora: string;
  disponible: boolean;
};

export type CitaFormData = {
  fecha: string;
  hora: string;
  tipoCita: string;
  idEspecialidad: number;
  idUsuario_Odontologo?: number;
  observaciones?: string;
};

// ====== OBTENER ESPECIALIDADES ======
export async function obtenerEspecialidades(): Promise<Especialidad[]> {
  try {
    const { data } = await api.get('/especialidades-list');
    return Array.isArray(data?.data ?? data) ? (data?.data ?? data) : [];
  } catch (error) {
    console.error('Error obteniendo especialidades:', error);
    return [];
  }
}

// ====== OBTENER ODONTÓLOGOS POR ESPECIALIDAD ======
export async function obtenerOdontologosPorEspecialidad(idEspecialidad: number): Promise<Odontologo[]> {
  try {
    const { data } = await api.get(`/especialidades/${idEspecialidad}/odontologos`);
    return Array.isArray(data?.data ?? data) ? (data?.data ?? data) : [];
  } catch (error) {
    console.error('Error obteniendo odontólogos:', error);
    return [];
  }
}

// ====== OBTENER TODOS LOS ODONTÓLOGOS ======
export async function obtenerTodosOdontologos(): Promise<Odontologo[]> {
  try {
    const { data } = await api.get('/usuarios/odontologos/listar');
    return Array.isArray(data?.data ?? data) ? (data?.data ?? data) : [];
  } catch (error) {
    console.error('Error obteniendo odontólogos:', error);
    return [];
  }
}

// ====== OBTENER HORARIOS DISPONIBLES ======
export async function obtenerHorariosDisponibles(
  fecha: string, 
  idUsuario_Odontologo?: number
): Promise<HorarioDisponible[]> {
  try {
    const params: any = { fecha };
    if (idUsuario_Odontologo) {
      params.odontologo_id = idUsuario_Odontologo;
    }

    const { data } = await api.get('/citas/por-fecha/' + fecha, { params });
    if (!data || !Array.isArray(data?.data ?? data)) {
      return generarHorariosPorDefecto(fecha);
    }

    const citasExistentes = data?.data ?? data;
    return generarHorariosDisponibles(fecha, citasExistentes);
  } catch (error) {
    console.error('Error obteniendo horarios disponibles:', error);
    return generarHorariosPorDefecto(fecha);
  }
}

// ====== GENERAR HORARIOS POR DEFECTO ======
function generarHorariosPorDefecto(fecha: string): HorarioDisponible[] {
  const horarios: HorarioDisponible[] = [];
  const horas = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  
  horas.forEach(hora => {
    horarios.push({
      fecha,
      hora,
      disponible: true
    });
  });
  
  return horarios;
}

// ====== GENERAR HORARIOS DISPONIBLES ======
function generarHorariosDisponibles(fecha: string, citasExistentes: any[]): HorarioDisponible[] {
  const horariosBase = generarHorariosPorDefecto(fecha);
  const horasOcupadas = citasExistentes.map(cita => cita.hora?.slice(0, 5) || cita.hora);
  
  return horariosBase.map(horario => ({
    ...horario,
    disponible: !horasOcupadas.includes(horario.hora)
  }));
}

// ====== OBTENER MIS CITAS ======
export async function obtenerMisCitas(): Promise<Cita[]> {
  try {
    const user = await obtenerUsuarioActual();
    
    const { data } = await api.get('/citas', {
      params: { paciente_id: user.idUsuario }
    });
    
    const citas = (data?.data ?? data) as Cita[];
    return Array.isArray(citas) ? citas : [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error('Error obteniendo citas:', error);
    throw error;
  }
}

// ====== AGENDAR CITA ======
export async function agendarCita(citaData: CitaFormData): Promise<Cita> {
  try {
    const user = await obtenerUsuarioActual();
    
    const payload = {
      fecha: citaData.fecha,
      hora: citaData.hora + ':00', 
      tipoCita: citaData.tipoCita,
      estado: 'pendiente',
      costo: 0, 
      pagado: false,
      idUsuario_Paciente: user.idUsuario,
      idUsuario_Odontologo: citaData.idUsuario_Odontologo,
      observaciones: citaData.observaciones
    };

    const { data } = await api.post('/citas', payload);
    return (data?.data ?? data) as Cita;
  } catch (error) {
    console.error('Error agendando cita:', error);
    throw error;
  }
}

// ====== CANCELAR CITA ======
export async function cancelarCita(idCita: number): Promise<void> {
  try {
    await api.post(`/citas/${idCita}/cambiar-estado`, {
      estado: 'cancelada'
    });
  } catch (error) {
    console.error('Error cancelando cita:', error);
    throw error;
  }
}