export type UsuarioBasic = {
  idUsuario: number;
  nombre: string;
  paterno: string | null;
  materno: string | null;
};

export type PacienteBasic = {
  idUsuario_Paciente: number;
  usuario?: UsuarioBasic;
};

export type CitaBasic = {
  idCita: number;
  fecha: string;       // ISO
  hora: string;        // ISO
  tipoCita: string;
  estado: string;
  costo: string;
  pagado: boolean;
  pacientes?: PacienteBasic[];
};

export type Tratamiento = {
  idTratamiento: number;
  nombre: string;
  precio: string;      // backend lo devuelve como string decimal
  idCita: number;
  created_at: string;
  updated_at: string;
  cita?: CitaBasic;
};

export type TratamientoCreate = {
  nombre: string;
  precio: number;      // enviamos número
  idCita: number;
};

export type TratamientoUpdate = TratamientoCreate;
