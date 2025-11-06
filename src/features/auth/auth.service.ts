import api from '@/shared/api/apiClient';
import type { LoginPayload, LoginResponse, MeResponse } from '@/types/auth';
import type { RegisterPayload } from '@/types/auth';
import { getDeviceName } from '@/shared/utils/device';

// src/features/auth/auth.service.ts  ← REEMPLAZA SOLO ESTAS CONSTANTES
const LOGIN_URL  = '/login';
const ME_URL     = '/user';   // <- en tu back no hay /me, sí /user
const LOGOUT_URL = '/logout';

export async function apiLogin(payload: Omit<LoginPayload, 'device_name'>) {
  const body: LoginPayload = { ...payload, device_name: getDeviceName() };
  const { data } = await api.post<LoginResponse>(LOGIN_URL, body);
  return data; // { token, usuario, roles }
}

export async function apiMe() {
  const { data } = await api.get<MeResponse>(ME_URL);
  return data;
}

export async function apiLogout() {
  await api.post(LOGOUT_URL, {});
}

// Registra un usuario (tu back devuelve el mismo shape que login)
export async function apiRegister(payload: RegisterPayload) {
  const { data } = await api.post<LoginResponse>('/register', payload);
  return data; // { token, usuario, roles }
}
