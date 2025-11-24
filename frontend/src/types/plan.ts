export type Usuario = {
  idUsuario: number;
  ci: string;
  nombre: string;
  paterno: string;
  materno: string | null;
  fechaNacimiento: string | null;
  genero: 'M' | 'F' | string;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  estado: boolean;
  created_at: string;
  updated_at: string;
};

export type Paciente = {
  idUsuario_Paciente: number;
  codigoSeguro: string | null;
  lugarNacimiento: string | null;
  domicilio: string | null;
  fechaIngreso: string | null;
  created_at: string;
  updated_at: string;
  usuario: Usuario;
};

export type Odontograma = {
  idOdontograma: number;
  nombre: string | null;
  descripcion: string | null;
  fecha: string | null;
  observacion: string | null;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  idPlan: number;
  observacion: string | null;
  medicamentos: string | null;
  duracionTotal: number;
  duracionEstimada: number;
  idUsuario_Paciente: number;
  idOdontograma: number;
  created_at: string;
  updated_at: string;
  paciente: Paciente;
  odontograma: Odontograma;
};

export type PlanCreate = {
  observacion?: string | null;
  medicamentos?: string | null;
  duracionTotal?: number;
  duracionEstimada?: number;
  idUsuario_Paciente: number;
  idOdontograma: number;
};

export type PlanUpdate = Partial<Omit<PlanCreate, 'idUsuario_Paciente'|'idOdontograma'>>;
