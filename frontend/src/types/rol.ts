export type RolClave = 'administrador' | 'odontologo' | 'asistente' | 'paciente';

export interface RolInfo {
  clave: RolClave;
  nombre: string;
  descripcion: string;
  cantidad?: number;
}
