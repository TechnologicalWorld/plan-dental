// src/app/router/guards/AuthGuard.tsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

export default function AuthGuard() {
  const { token, user, hydrate, rolesUpper } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (token && !user) {
        try { 
          await hydrate(); 
        } finally { 
          if (mounted) setChecking(false); 
        }
      } else {
        setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, [token, user, hydrate]);

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Cargando sesión…
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si no tiene roles válidos después de hidratar
  if (!rolesUpper || rolesUpper.length === 0) {
    return <Navigate to="/app/unauthorized" replace />;
  }

  return <Outlet />;
}