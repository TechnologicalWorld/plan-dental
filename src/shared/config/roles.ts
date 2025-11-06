export type Role = 'ADMIN' | 'ODONTOLOGO' | 'ASISTENTE' | 'PACIENTE';

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Administrador',
  ODONTOLOGO: 'Odontólogo',
  ASISTENTE: 'Asistente',
  PACIENTE: 'Paciente',
};

// Mapa de rutas visibles por rol (útil para el sidebar)
export const MENU_BY_ROLE: Record<Role, Array<{ path: string; label: string }>> = {
  ADMIN: [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/usuarios', label: 'Usuarios' },
    { path: '/app/personal/odontologos', label: 'Odontólogos' },
    { path: '/app/personal/asistentes', label: 'Asistentes' },
    { path: '/app/pacientes', label: 'Pacientes' },
    { path: '/app/citas', label: 'Citas' },
    { path: '/app/reportes', label: 'Reportes' },
  ],
  ODONTOLOGO: [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/mi-agenda', label: 'Mi agenda' },
    { path: '/app/pacientes', label: 'Pacientes' },
    { path: '/app/historia', label: 'Historia clínica' },
    { path: '/app/odontograma', label: 'Odontograma' },
  ],
  ASISTENTE: [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/citas', label: 'Gestión de citas' },
    { path: '/app/pacientes', label: 'Pacientes' },
    { path: '/app/calendario', label: 'Calendario' },
  ],
  PACIENTE: [
    { path: '/app/dashboard', label: 'Inicio' },
    { path: '/app/mi-perfil', label: 'Mi perfil' },
    { path: '/app/mi-historial', label: 'Mi historial' },
    { path: '/app/agendar', label: 'Agendar cita' },
  ],
};
