// types/historial.ts
export type HistoriaClinica = {
  idHistoriaClinica: number;
  antecedentesPatologicos?: string;
  motivoConsulta?: string;
  signosVitales?: string;
  descripcionSignosSintomasDentales?: string;
  examenClinicoBucoDental?: string;
  observaciones?: string;
  enfermedadActual?: string;
  idUsuario_Paciente: number;
  idUsuario_Odontologo: number;
  createdAt?: string;
  updatedAt?: string;
  
  odontologo?: {
    usuario: {
      nombre: string;
      paterno?: string;
      materno?: string;
    };
    especialidades?: Array<{
      nombre: string;
    }>;
  };
};

export type Diagnostico = {
  idTratamiento: number;
  nombre: string;
  precio: number;
  idCita: number;
  fecha?: string;
  diagnosticoCIE?: string;
  procedimientoIndicacion?: string;
  evoluciones?: Array<{
    idPieza: number;
    fecha: string;
    diagnosticoCIE: string;
    procedimientoIndicacion: string;
    piezaDental?: {
      nombre: string;
      posicion: string;
    };
  }>;
  cita?: {
    fecha: string;
    estado: string;
    odontologo?: {
      usuario: {
        nombre: string;
        paterno?: string;
        materno?: string;
      };
    };
  };
};

export type PlanTratamiento = {
  idPlan: number;
  observacion?: string;
  medicamentos?: string;
  duracionTotal?: number;
  duracionEstimada?: number;
  idUsuario_Paciente: number;
  idOdontograma: number;
  estado: 'activo' | 'completado' | 'cancelado';
  progreso?: number;
  fechaInicio?: string;
  fechaFinEstimada?: string;
  
  odontograma?: {
    nombre?: string;
    descripcion?: string;
    fecha: string;
  };
  
  tratamientos?: Array<{
    idTratamiento: number;
    nombre: string;
    estado: 'pendiente' | 'en_progreso' | 'completado';
    fechaProgramada?: string;
    fechaRealizada?: string;
  }>;
};