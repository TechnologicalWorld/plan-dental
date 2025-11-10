export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  descripcion?: string | null;
  // opcional cuando venga expandido:
  odontologos?: Array<{
    idUsuario_Odontologo: number;
    usuario?: { idUsuario: number; nombre: string };
  }>;
}
