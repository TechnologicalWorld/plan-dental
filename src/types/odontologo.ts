export interface Odontologo {
  idUsuario_Odontologo: number;
  fechaContratacion: string; // 'YYYY-MM-DD'
  horario: string;
  usuario: {
    idUsuario: number;
    ci: string;
    nombre: string;
    paterno: string;
    materno?: string | null;
    correo: string;
    telefono: string;
    estado: boolean;
  };
  especialidades?: Array<{ idEspecialidad: number; nombre: string }>;
}
