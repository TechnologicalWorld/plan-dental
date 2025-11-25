// src/app/router/guards/RoleGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

type RoleUpper = 'ADMIN' | 'ODONTOLOGO' | 'ASISTENTE' | 'PACIENTE';

export default function RoleGuard({ allow }: { allow: RoleUpper[] }) {
  const { token, user, rolesUpper } = useAuthStore();

  // Si no hay sesión, a login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  console.log('RoleGuard - user roles:', rolesUpper);
  console.log(allow)
  // Verifica intersección entre roles del usuario y lista permitida
  const canPass = (rolesUpper ?? []).some((r) => allow.includes(r));

  if (!canPass) {
    
    console.error(`✅ Acceso permitido. Roles del usuario: ${rolesUpper?.join(', ')}`);
  }
  
  return canPass ? <Outlet /> : <Navigate to="/app/unauthorized/" replace />;
}