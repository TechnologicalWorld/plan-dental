// src/app/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';

import EspecialidadesAdminPage from '@/features/especialidades/pages/EspecialidadesAdminPage';

import PublicLayout from '@/app/layout/PublicLayout';
import AppLayout from '@/app/layout/AppLayout';
import AuthGuard from '@/app/router/guards/AuthGuard';
import RoleGuard from '@/app/router/guards/RoleGuard';

import ErrorBoundary from '@/app/router/ErrorBoundary';
import RootGate from '@/app/router/RootGate';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import CalendarioGeneralAdminPage from '@/features/calendario/pages/CalendarioGeneralAdminPage';

import AgendaOdontologoPage from '@/features/agenda/pages/AgendaOdontologoPage';
import MisPacientesPage from '@/features/odonto-pacientes/pages/MisPacientesPage';

import Reportes from '@/features/reportes/pages/Reportes';
import AsistenteIA from '@/features/asistenteia/pages/AsistenteIA';

import Dashboard from '@/features/dashboard/pages/Dashboard';
import NotFound from '@/shared/ui/NotFound';
import Unauthorized from '@/pages/Unauthorized';



// 👉 NUEVAS PÁGINAS (ADMIN)
import PersonalListPage from '@/features/personal/pages/PersonalListPage';
import PacientesAdminListPage from '@/features/pacientes/pages/PacientesAdminListPage';
import RolesListPage from '@/features/roles/pages/RolesListPage';

//Agregando Pages de asistente
import PacientesAsistentePage from '@/features/pacientes/pages/PacientesAsistentePage'
import CalendarioAsistentePage from '@/features/calendario/pages/CalendarioAsistentePage'
import CitasAsistentePage from '@/features/citas/pages/CitasAsistentePage'
import CalendarioAsistenteCrear from '@/features/citas/pages/CitasAsistenteCrear'
export const router = createBrowserRouter([
  // Entrada raíz -> decide login o dashboard según sesión
  { path: '/', element: <RootGate /> },

  // Público
  {
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <RootGate /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // Privado
  {
    element: <AuthGuard />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          // Comunes
          { path: '/app/dashboard', element: <Dashboard /> },
          { path: '/app', element: <Dashboard /> },

          // ---------- ADMIN ----------
          {
            element: <RoleGuard allow={['ADMIN']} />,
            children: [
              { path: '/app/admin/usuarios/personal',  element: <PersonalListPage /> },
              { path: '/app/admin/usuarios/pacientes', element: <PacientesAdminListPage /> },
              { path: '/app/admin/usuarios/roles',     element: <RolesListPage /> },

              { path: '/app/admin/especialidades',     element: <EspecialidadesAdminPage /> },

              { path: '/app/admin/calendario',         element:  <CalendarioGeneralAdminPage /> },
              { path: '/app/admin/reportes',           element: <Reportes /> },
            ],
          },

          // ---------- ODONTÓLOGO ----------
          {
            element: <RoleGuard allow={['ODONTOLOGO']} />,
            children: [
              { path: '/app/agenda',      element: <AgendaOdontologoPage /> },
              { path: '/app/pacientes',   element: <MisPacientesPage /> },
              { path: '/app/historias',   element: <div>Historia clínica</div> },
              { path: '/app/odontograma', element: <div>Odontograma</div> },
              { path: '/app/tratamientos', element: <div>Tratamientos y Diagnósticos</div> },
            ],
          },

          // ---------- ASISTENTE ----------
          {
            element: <RoleGuard allow={['ASISTENTE']} />,
            children: [
              { path: '/app/asisitente/citas',      element: <div><CitasAsistentePage/></div> },
              { path: '/app/asistente/calendario', element: <div><CalendarioAsistentePage/></div> },
              { path: '/app/asistente/citas/crear', element: <div><CalendarioAsistenteCrear/></div> },
              { path: '/app/asistente/pacientes',  element: <div><PacientesAsistentePage/></div> },
            ],
          },

          // ---------- PACIENTE ----------
          {
            element: <RoleGuard allow={['PACIENTE']} />,
            children: [
              { path: '/app/mi-perfil',     element: <div>Mi perfil</div> },
              { path: '/app/mi-historial',  element: <div>Mi historial</div> },
              { path: '/app/agendar-cita',  element: <div>Agendar cita</div> },
            ],
          },

          // --------- 403 explícito ---------
          { path: '/app/unauthorized', element: <Unauthorized /> },

          { path: '/app/ai', element: <AsistenteIA /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);

