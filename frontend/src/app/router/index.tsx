// src/app/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '@/app/layout/PublicLayout';
import AppLayout from '@/app/layout/AppLayout';
import AuthGuard from '@/app/router/guards/AuthGuard';
import RoleGuard from '@/app/router/guards/RoleGuard';

import ErrorBoundary from '@/app/router/ErrorBoundary';
import RootGate from '@/app/router/RootGate';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';

import Dashboard from '@/pages/Dashboard';
import NotFound from '@/shared/ui/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// 👉 NUEVAS PÁGINAS (ADMIN)
import PersonalListPage from '@/features/personal/pages/PersonalListPage';
import PacientesAdminListPage from '@/features/pacientes/pages/PacientesAdminListPage';
import RolesListPage from '@/features/roles/pages/RolesListPage';

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
              { path: '/app/admin/calendario',         element: <div>Calendario (Admin)</div> },
              { path: '/app/admin/reportes',           element: <div>Reportes</div> },
            ],
          },

          // ---------- ODONTÓLOGO ----------
          {
            element: <RoleGuard allow={['ODONTOLOGO']} />,
            children: [
              { path: '/app/agenda',      element: <div>Mi agenda</div> },
              { path: '/app/pacientes',   element: <div>Pacientes (Odontólogo)</div> },
              { path: '/app/historias',   element: <div>Historia clínica</div> },
              { path: '/app/odontograma', element: <div>Odontograma</div> },
            ],
          },

          // ---------- ASISTENTE ----------
          {
            element: <RoleGuard allow={['ASISTENTE']} />,
            children: [
              { path: '/app/citas',      element: <div>Gestión de Citas</div> },
              { path: '/app/calendario', element: <div>Calendario General</div> },
              { path: '/app/pacientes',  element: <div>Pacientes (Asistente)</div> },
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

          { path: '/app/ai', element: <div>Asistente IA</div> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);

