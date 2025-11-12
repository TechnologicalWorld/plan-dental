export interface Cita {
  idCita: number;
  hora: string;   
  fecha: string;  
  estado: string;
  tipoCita: string;
  costo: string | number;
  pagado: boolean;

  created_at?: string;
  updated_at?: string;

  pacientes?: Array<{
    idUsuario_Paciente: number;
    usuario?: {
      idUsuario: number;
      ci: string;
      nombre: string;
      paterno?: string;
      materno?: string | null;
    };
  }>;

  odontologos?: Array<{
    idUsuario_Odontologo: number;
    usuario?: {
      idUsuario: number;
      ci: string;
      nombre: string;
      paterno?: string;
      materno?: string | null;
    };
  }>;

  tratamientos?: Array<{
    idTratamiento: number;
    nombre: string;
    precio: string | number;
  }>;
}
