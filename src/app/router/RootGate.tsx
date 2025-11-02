// src/app/router/RootGate.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

export default function RootGate() {
  const { token } = useAuthStore();
  return <Navigate to={token ? '/app/dashboard' : '/login'} replace />;
}
