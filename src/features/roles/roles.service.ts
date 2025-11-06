import api from '@/shared/api/apiClient';
import type { RolInfo } from '@/types/rol';

export async function resumenRoles(): Promise<RolInfo[]> {
  const [adminsR, odontosR, asisR, pacsR] = await Promise.all([
    api.get('/usuarios/administradores/listar'),
    api.get('/usuarios/odontologos/listar'),
    api.get('/usuarios/asistentes/listar'),
    api.get('/usuarios/pacientes/listar'),
  ]);

  // Los endpoints pueden devolver { data: [...] } o [...]
  const admins  = (adminsR.data?.data  ?? adminsR.data)  as unknown[];
  const odontos = (odontosR.data?.data ?? odontosR.data) as unknown[];
  const asis    = (asisR.data?.data    ?? asisR.data)    as unknown[];
  const pacs    = (pacsR.data?.data    ?? pacsR.data)    as unknown[];

  return [
    { clave: 'administrador', nombre: 'Administradores', descripcion: 'Acceso total al sistema',  cantidad: admins.length },
    { clave: 'odontologo',    nombre: 'Odontólogos',     descripcion: 'Atención clínica y agenda', cantidad: odontos.length },
    { clave: 'asistente',     nombre: 'Asistentes',      descripcion: 'Apoyo en citas y gestión',  cantidad: asis.length },
    { clave: 'paciente',      nombre: 'Pacientes',       descripcion: 'Usuarios atendidos',        cantidad: pacs.length },
  ];
}
