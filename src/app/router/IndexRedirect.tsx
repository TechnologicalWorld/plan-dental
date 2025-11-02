// src/app/router/IndexRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

export default function IndexRedirect() {
  const { token } = useAuthStore();
  return <Navigate to={token ? '/app/dashboard' : '/login'} replace />;
}
