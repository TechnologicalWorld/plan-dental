import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

const SIDEBAR_KEY = 'pd_sidebar_collapsed';

export default function AppLayout() {
  const { token, user, hydrate, logout } = useAuthStore();
  const [booting, setBooting] = useState(true);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(SIDEBAR_KEY) === '1';
  });

  useEffect(() => {
    (async () => {
      await hydrate();
      setBooting(false);
    })();
  }, [hydrate]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  if (booting || (token && !user)) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-900 text-slate-100">
        <div className="animate-pulse">Cargando…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Topbar fijo */}
      <div className="sticky top-0 z-40">
        <Topbar onToggleSidebar={() => setCollapsed((v) => !v)} />
      </div>

      <div
        className="grid overflow-hidden"
        style={{ gridTemplateColumns: `${collapsed ? '72px' : '240px'} 1fr` }}
      >
        <Sidebar collapsed={collapsed} onLogout={logout} />

        <main className="h-[calc(100vh-56px)] overflow-y-auto p-6 bg-slate-950/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
