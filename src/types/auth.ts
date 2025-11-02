import type { Role } from '@/shared/config/roles';

export type ID = number;

export interface AuthUser {
  idUsuario: ID;
  nombre: string;
  paterno?: string | null;
  materno?: string | null;
  correo: string;
  telefono?: string | null;
  direccion?: string | null;
  estado: boolean;
  // relaciones (según tu backend)
  paciente?: unknown | null;
  odontologo?: unknown | null;
  administrador?: unknown | null;
  asistente?: unknown | null;
}

export interface LoginPayload {
  correo: string;
  contrasena: string;
  device_name: string; // requerido por tu API
}

export interface LoginResponse {
  token: string;
  usuario: AuthUser;
  roles: Role[]; // p.ej. ["paciente"]
}

export interface MeResponse {
  user: AuthUser;
  roles?: Role[];
}

// --- Registro ---
// src/types/auth.ts
export type RegisterPayload = {
  nombre: string;
  paterno: string;
  materno?: string | null;
  fechaNacimiento: string;   // "YYYY-MM-DD"
  genero: 'M' | 'F';
  telefono?: string | null;
  contrasena: string;
  correo: string;
  ci: string;

  // Campos del Paciente que tu backend espera
  codigoSeguro?: string | null;
  lugarNacimiento?: string | null;
  domicilio?: string | null;
  fechaIngreso: string;      // "YYYY-MM-DD"
};


// Lo que devuelve tu back en /register (igual que /login)
export interface LoginResponse {
  token: string;
  usuario: AuthUser;
  roles: string[]; // llegan en minúsculas desde tu back
}
