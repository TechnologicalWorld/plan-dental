import { NavLink } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import type { RoleUpper } from '@/shared/hooks/useAuthStore';
import { Stethoscope } from 'lucide-react'; // <-- icono para Especialidades

import {
  LayoutDashboard,
  Users,
  UserCog,
  UserRound,
  ListChecks,
  Calendar,
  ClipboardList,
  FileText,
  Bot,
  History,
  ChevronDown,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

type Item = { to: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> };
type Group = { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; children: Item[] };

type SidebarProps = {
  collapsed: boolean;
  onLogout: () => void;
};

function roleLabel(roles: RoleUpper[] = []) {
  if (roles.includes('ADMIN')) return 'Administrador';
  if (roles.includes('ODONTOLOGO')) return 'Odontólogo';
  if (roles.includes('ASISTENTE')) return 'Asistente';
  if (roles.includes('PACIENTE')) return 'Paciente';
  return 'Usuario';
}

export default function Sidebar({ collapsed, onLogout }: SidebarProps) {
  const { rolesUpper, user } = useAuthStore();

  const has = (r: RoleUpper) => (rolesUpper ?? []).includes(r);
  const idusuario = user?.idUsuario;
  const menu = useMemo(() => {
    // ADMIN
    if (has('ADMIN')) {
      const adminUserGroup: Group = {
        label: 'Gestión de Usuarios',
        icon: Users,
        children: [
          { to: '/app/admin/usuarios/personal', label: 'Gestión de Personal', icon: UserCog },
          { to: '/app/admin/usuarios/pacientes', label: 'Gestión de Pacientes', icon: UserRound },
          { to: '/app/admin/usuarios/roles', label: 'Gestión de Roles', icon: ListChecks },
        ],
      };
      const topItems: Item[] = [
        { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/app/admin/especialidades', label: 'Especialidades', icon: Stethoscope },
        { to: '/app/admin/calendario', label: 'Calendario', icon: Calendar },
        { to: '/app/admin/reportes', label: 'Reportes', icon: FileText },
        { to: '/app/ai', label: 'Asistente IA', icon: Bot },
      ];
      return { groups: [adminUserGroup], items: topItems };
    }

    // ODONTÓLOGO
    if (has('ODONTOLOGO')) {
      const items: Item[] = [
        { to: '/app/dashboardOdonto', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/app/agenda', label: 'Mi agenda', icon: Calendar },
        { to: '/app/pacientes', label: 'Pacientes', icon: UserRound },
        { to: '/app/historias', label: 'Historia clínica', icon: ClipboardList },
        { to: '/app/odontograma', label: 'Odontograma', icon: FileText },
        { to: '/app/tratamientos', label: 'Tratamientos', icon: ListChecks },
        { to: '/app/ai', label: 'Asistente IA', icon: Bot },
      ];
      return { groups: [], items };
    }

    // ASISTENTE
    if (has('ASISTENTE')) {
      const items: Item[] = [
        { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/app/asisitente/citas', label: 'Gestión de Citas', icon: Calendar },
        { to: '/app/asistente/pacientes', label: 'Pacientes', icon: UserRound },
        { to: '/app/asistente/calendario', label: 'Calendario General', icon: Calendar },
        { to: '/app/ai', label: 'Asistente IA', icon: Bot },
      ];
      return { groups: [], items };
    }

    // PACIENTE 
    const items: Item[] = [
      { to: '/app/dashboardPaciente', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/app/mi-perfil', label: 'Mi perfil', icon: UserRound },
      { to: '/app/mi-historial', label: 'Mi historial', icon: History },
      { to: '/app/agendar-cita', label: 'Agendar cita', icon: Calendar },
      { to: '/app/ai', label: 'Asistente IA', icon: Bot },
    ];
    return { groups: [], items };
  }, [rolesUpper]);

  // SOLO nombre + apellido paterno
  const name = [user?.nombre, user?.paterno].filter(Boolean).join(' ') || 'Usuario';
  const roleText = roleLabel(rolesUpper);

  return (
    <aside
      className={`sticky top-[56px] bg-slate-900 text-slate-100 flex flex-col
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        h-[calc(100vh-56px)]`}
    >
      

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
        {menu.items?.some((i) => i.to === '/app/dashboard') && (
          <NavItem collapsed={collapsed} to="/app/dashboard" label="Dashboard" icon={LayoutDashboard} />
        )}

        {/* Grupos (solo admin) */}
        {menu.groups?.map((g) => (
          <NavGroup key={g.label} collapsed={collapsed} {...g} />
        ))}

        {/* Resto de items */}
        {menu.items
          ?.filter((i) => i.to !== '/app/dashboard')
          .map((it) => (
            <NavItem key={it.to} collapsed={collapsed} to={it.to} label={it.label} icon={it.icon} />
          ))}
      </nav>

      {/* PERFIL + LOGOUT (dentro del sidebar) */}
      <div className="border-t border-white/10 p-3 space-y-3">
        {/* Tarjeta de perfil */}
        <div
          className={`rounded-xl bg-gradient-to-br from-teal-600/25 to-slate-800/50 ${
            collapsed ? 'p-2 grid place-items-center' : 'p-3 flex items-center gap-3'
          }`}
          title={`${name}${collapsed ? ` — ${roleText}` : ''}`}
        >
          <div className="size-10 rounded-full grid place-items-center bg-white/10">
            <UserIcon size={20} className="opacity-90" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-medium leading-5 truncate">{name}</div>
              <div className="text-xs opacity-80 -mt-0.5">{roleText}</div>
            </div>
          )}
        </div>

        {/* Botón cerrar sesión */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/15 px-3 py-2 rounded"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
          {!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
}

/* ---------- ÍTEMS ---------- */
function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
}: Item & { collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded transition ${
          isActive ? 'bg-white/15 text-white' : 'hover:bg-white/10'
        } ${collapsed ? 'justify-center' : ''}`
      }
    >
      <Icon size={18} />
      {!collapsed && <span className="text-sm">{label}</span>}
    </NavLink>
  );
}

/* ---------- GRUPOS (acordeón) ---------- */
function NavGroup({
  label,
  icon: Icon,
  children,
  collapsed,
}: Group & { collapsed: boolean }) {
  const [open, setOpen] = useState(true);

  if (collapsed) {
    return (
      <div className="flex flex-col items-center">
        <button
          title={label}
          onClick={() => setOpen((v) => !v)}
          className="w-10 h-10 grid place-items-center rounded hover:bg-white/10"
        >
          <Icon size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded bg-white/5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2"
      >
        <span className="flex items-center gap-3 text-sm font-medium">
          <Icon size={18} />
          {label}
        </span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <div className="px-2 pb-2 space-y-1">
          {children.map((c) => (
            <NavItem key={c.to} collapsed={false} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
