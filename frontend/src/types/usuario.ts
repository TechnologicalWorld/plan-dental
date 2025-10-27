export interface Usuario {
  idUsuario: number;
  ci: string;
  nombre: string;
  paterno: string;
  materno?: string;
  fechaNacimiento: string;
  genero: 'M' | 'F' | 'Otro';
  telefono: string;
  correo: string;
  direccion: string;
  estado?: boolean;
  contrasena?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateUsuarioRequest = Omit<Usuario, 'idUsuario' | 'created_at' | 'updated_at'> & {
  contrasena: string;
};

export type UpdateUsuarioRequest = Partial<CreateUsuarioRequest>;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface ErrorResponse {
  success: false;
  errors: Record<string, string[]>;
}