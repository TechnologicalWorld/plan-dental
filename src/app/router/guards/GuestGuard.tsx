// src/app/router/guards/GuestGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

export default function GuestGuard() {
  const { token } = useAuthStore();
  return token ? <Navigate to="/app/dashboard" replace /> : <Outlet />;
}
