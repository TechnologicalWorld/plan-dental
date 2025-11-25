// src/shared/hooks/useAuthStore.ts
import { create } from 'zustand';
import { setAuthToken, TOKEN_KEY } from '@/shared/api/apiClient';
import {
  apiLogin,
  apiMe,
  apiLogout,
  apiRegister, // <-- nuevo
} from '@/features/auth/auth.service';
import type { AuthUser, RegisterPayload } from '@/types/auth';

// Roles que llegan de tu backend (minúsculas)
export type RoleLower = 'administrador' | 'odontologo' | 'asistente' | 'paciente';

// Roles que quizá uses en UI/guards (mayúsculas)
export type RoleUpper = 'ADMIN' | 'ODONTOLOGO' | 'ASISTENTE' | 'PACIENTE';

const USER_KEY  = 'usuario';
const ROLES_KEY = 'roles';

// helper opcional: normaliza a mayúsculas para guards/menús
function toUpperRole(r: string): RoleUpper | null {
  const u = r.toUpperCase();
  if (u === 'ADMINISTRADOR') return 'ADMIN';
  if (u === 'ODONTOLOGO')    return 'ODONTOLOGO';
  if (u === 'ASISTENTE')     return 'ASISTENTE';
  if (u === 'PACIENTE')      return 'PACIENTE';
  return null;
}

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  roles: RoleLower[];
  rolesUpper: RoleUpper[];
  loading: boolean;
  error: string | null;

  login: (p: { correo: string; contrasena: string }) => Promise<{token:string, roleUpper:RoleUpper[]}>;
  register: (p: RegisterPayload) => Promise<void>;      // <-- nuevo]
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  roles: [],
  rolesUpper: [],
  loading: false,
  error: null,

  // === LOGIN ===
  login: async ({ correo, contrasena }) => {
    set({ loading: true, error: null });
    try {
      const { token, usuario, roles } = await apiLogin({ correo, contrasena });
      
      setAuthToken(token);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));

      const rolesLower = (roles as string[]).map(r => r.toLowerCase() as RoleLower);
      localStorage.setItem(ROLES_KEY, JSON.stringify(rolesLower));

      const rolesUpper = rolesLower
        .map(r => toUpperRole(r))
        .filter((r): r is RoleUpper => r !== null);

      set({ token, user: usuario, roles: rolesLower, rolesUpper, loading: false });

      return {token, roleUpper: rolesUpper}
    } catch (e: unknown) {
      const resp = (typeof e === 'object' && e !== null && 'response' in e)
        ? (e as Record<string, unknown>)['response']
        : undefined;
      const data = (typeof resp === 'object' && resp !== null && 'data' in resp)
        ? (resp as Record<string, unknown>)['data']
        : undefined;

      const serverMsg =
        (typeof data === 'object' && data !== null && 'message' in data && typeof (data as Record<string, unknown>)['message'] === 'string')
          ? ((data as Record<string, unknown>)['message'] as string)
          : (typeof data === 'object' && data !== null && 'errors' in data
            ? JSON.stringify((data as Record<string, unknown>)['errors'])
            : null);

      const message = serverMsg || (e instanceof Error ? e.message : 'Error al iniciar sesión');
      set({ error: message, loading: false });
      throw e instanceof Error ? e : new Error(message);
    }
  },

  // === REGISTER === (mismo flujo que login: registra y deja logeado)
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { token, usuario, roles } = await apiRegister(payload);

      setAuthToken(token);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));

      const rolesLower = (roles as string[]).map(r => r.toLowerCase() as RoleLower);
      localStorage.setItem(ROLES_KEY, JSON.stringify(rolesLower));

      const rolesUpper = rolesLower
        .map(r => toUpperRole(r))
        .filter((r): r is RoleUpper => r !== null);

      set({ token, user: usuario, roles: rolesLower, rolesUpper, loading: false });
    } catch (e: unknown) {
      const resp = (typeof e === 'object' && e !== null && 'response' in e)
        ? (e as Record<string, unknown>)['response']
        : undefined;
      const data = (typeof resp === 'object' && resp !== null && 'data' in resp)
        ? (resp as Record<string, unknown>)['data']
        : undefined;

      const serverMsg =
        (typeof data === 'object' && data !== null && 'message' in data && typeof (data as Record<string, unknown>)['message'] === 'string')
          ? ((data as Record<string, unknown>)['message'] as string)
          : (typeof data === 'object' && data !== null && 'errors' in data
            ? JSON.stringify((data as Record<string, unknown>)['errors'])
            : null);

      const message = serverMsg || (e instanceof Error ? e.message : 'Error al registrar');
      set({ error: message, loading: false });
      throw e instanceof Error ? e : new Error(message);
    }
  },

  // === ME ===
  fetchMe: async () => {
    const { user } = await apiMe();
    set({ user });
  },

  // === LOGOUT ===
  logout: async () => {
    try { await apiLogout(); } catch { /* noop */ }
    setAuthToken(undefined);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLES_KEY);
    set({ user: null, token: null, roles: [], rolesUpper: [] });
  },

  // === HIDRATAR EN RECARGA ===
  hydrate: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      // Si no hay token, limpiar todo
      set({ user: null, token: null, roles: [], rolesUpper: [] });
      return;
    }

    setAuthToken(token);

    try {
      const cachedUser  = localStorage.getItem(USER_KEY);
      const cachedRoles = localStorage.getItem(ROLES_KEY);

      let user: AuthUser | null = null;
      let roles: RoleLower[] = [];
      let rolesUpper: RoleUpper[] = [];

      if (cachedUser) {
        user = JSON.parse(cachedUser) as AuthUser;
      }

      if (cachedRoles) {
        roles = JSON.parse(cachedRoles) as RoleLower[];
        rolesUpper = roles
          .map((r) => toUpperRole(r))
          .filter((r): r is RoleUpper => r !== null);
      }

      // ✅ CRÍTICO: Actualizar el token en el estado
      set({ 
        token,      // ← ESTO FALTABA
        user, 
        roles, 
        rolesUpper 
      });

      console.log('✅ Sesión hidratada:', { user: user?.nombre, roles, rolesUpper });

    } catch (error) {
      console.error('❌ Error al hidratar sesión:', error);
      setAuthToken(undefined);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ROLES_KEY);
      set({ user: null, token: null, roles: [], rolesUpper: [] });
    }
  },
}));
