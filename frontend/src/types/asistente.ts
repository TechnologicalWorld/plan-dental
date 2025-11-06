export interface Asistente {
  idUsuario_Asistente: number;
  turno: string;
  fechaContratacion: string; // 'YYYY-MM-DD'
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
}
