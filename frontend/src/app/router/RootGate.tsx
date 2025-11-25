// src/app/router/RootGate.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

export default function RootGate() {
  console.log("ENTRO")

  const { token, rolesUpper } = useAuthStore();

  // Si no está autenticado, ir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // Redirigir según el rol
  const firstRole = rolesUpper?.[0];
  console.log('RootGate - firstRole:', firstRole);
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
      // Si tiene token pero no tiene rol válido
      return <Navigate to="/app/unauthorized" replace />;
  }
}