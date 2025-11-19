// src/types/historia.ts
export type Sexo = 'M' | 'F';

export interface UsuarioMin {
  idUsuario: number;
  ci: string;
  nombre: string;
  paterno: string;
  materno?: string | null;
  fechaNacimiento: string; // ISO
  genero: Sexo;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  estado: boolean;
}

export interface PacienteMin {
  idUsuario_Paciente: number;
  codigoSeguro?: string | null;
  lugarNacimiento?: string | null;
  domicilio?: string | null;
  fechaIngreso?: string | null;
  usuario: UsuarioMin;
}

export interface OdontologoMin {
  idUsuario_Odontologo: number;
  fechaContratacion?: string | null;
  horario?: string | null;
  usuario: UsuarioMin;
}

export interface HistoriaClinica {
  idHistoriaClinica: number;
  antecedentesPatologicos?: string | null;
  motivoConsulta: string;
  signosVitales?: string | null;
  descripcionSignosSintomasDentales?: string | null;
  examenClinicoBucoDental?: string | null;
  observaciones?: string | null;
  enfermedadActual?: string | null;
  idUsuario_Paciente: number;
  idUsuario_Odontologo: number;
  created_at: string;
  updated_at: string;
  paciente?: PacienteMin;
  odontologo?: OdontologoMin;
}

export interface PlanMin {
  idPlan: number;
  observacion?: string | null;
  medicamentos?: string | null;
  duracionTotal?: number | null;
  duracionEstimada?: number | null;
  idUsuario_Paciente: number;
  idOdontograma: number;
  created_at: string;
}

export interface SesionMin {
  idSesion: number;
  nombre: string;
  descripcion?: string | null;
  hora?: string | null;
  observacion?: string | null;
  fecha: string; // ISO
  // puede venir vía 'pivot' en tu backend, pero no lo exigimos aquí
}

export interface OdontogramaMin {
  idOdontograma: number;
  nombre: string;
  descripcion?: string | null;
  fecha: string;
  observacion?: string | null;
  planes?: PlanMin[];
  sesiones?: SesionMin[];
}

export interface PiezaDentalMin {
  idPieza: number;
  posicion: string; // ej "46"
  nombre: string;
  tipo: string;
  estado: string;
  idOdontograma: number;
  created_at: string;
}

export interface EvolucionMin {
  idTratamiento: number;
  idPieza: number;
  fecha: string;
  diagnosticoCIE?: string | null;
  procedimientoIndicacion?: string | null;
  tratamiento?: { idTratamiento: number; nombre: string; precio: string; idCita: number };
  pieza?: PiezaDentalMin;
}
