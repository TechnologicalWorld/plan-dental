// src/app/router/guards/RoleGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

// Los roles que usas en el router/Sidebar (mayúsculas)
type RoleUpper = 'ADMIN' | 'ODONTOLOGO' | 'ASISTENTE' | 'PACIENTE';

export default function RoleGuard({ allow }: { allow: RoleUpper[] }) {
  const { token, user, rolesUpper } = useAuthStore();

  // Si no hay sesión, a login
  if (!token || !user) return <Navigate to="/login" replace />;

  // Verifica intersección entre roles del usuario y lista permitida
  const canPass = (rolesUpper ?? []).some((r) => allow.includes(r));
  return canPass ? <Outlet /> : <Navigate to="/app/unauthorized" replace />;
}
