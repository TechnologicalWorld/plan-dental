// src/app/router/guards/GuestGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

export default function GuestGuard() {
  const { token, rolesUpper } = useAuthStore();

  // Si no hay token, permitir acceso (login/register)
  if (!token) {
    return <Outlet />;
  }

  // Si hay token, redirigir según rol
  const firstRole = rolesUpper?.[0];
  console.log('GuestGuard - firstRole:', firstRole);
  switch (firstRole) {
    case 'ADMIN':
      return <Navigate to="/app/dashboard" replace />;
    
    case 'ODONTOLOGO':
      return <Navigate to="/app/dashboardOdonto" replace />;
    
    case 'ASISTENTE':
      return <Navigate to="/app/asisitente/citas" replace />;
    
    case 'PACIENTE':
      return <Navigate to="/app/dashboardPaciente" replace />;
    
    default:
      return <Navigate to="/app/dashboard" replace />;
  }
}