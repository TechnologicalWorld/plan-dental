import type { Paciente } from './paciente';
import type { Cita } from '@/types/cita';
import type { Asistente } from './asistente';
import type { Odontologo } from './odontologo';

export interface Hace {
  idUsuario_Paciente: number;
  idCita: number;
  idUsuario_Asistente: number;
  idUsuario_Odontologo: number;
  fecha: string; 
//relaciones . 
  paciente?: Paciente;
  cita?: Cita;
  asistente?: Asistente;
  odontologo?: Odontologo;
}