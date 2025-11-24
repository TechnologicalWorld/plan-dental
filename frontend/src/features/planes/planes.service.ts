import apiClient from '@/shared/api/apiClient';
import type { Plan, PlanCreate, PlanUpdate } from '@/types/plan';

type ApiListResp<T> = { success: boolean; data: T };
type ApiShowResp<T> = { success: boolean; data: T };
type ApiStoreResp<T> = { message: string; data: T };
type ApiUpdateResp<T> = { success: boolean; message: string; data: T };

export async function getPlanes(): Promise<Plan[]> {
  const { data } = await apiClient.get<ApiListResp<Plan[]>>('/planes');
  return data.data;
}

export async function getPlanesByPaciente(pacienteId: number): Promise<Plan[]> {
  const all = await getPlanes();
  return all.filter(p => p.idUsuario_Paciente === pacienteId);
}

export async function getPlanById(idPlan: number): Promise<Plan> {
  const { data } = await apiClient.get<ApiShowResp<Plan>>(`/planes/${idPlan}`);
  return data.data;
}

export async function createPlan(payload: PlanCreate): Promise<Plan> {
  const { data } = await apiClient.post<ApiStoreResp<Plan>>('/planes', payload);
  return data.data;
}

export async function updatePlan(idPlan: number, payload: PlanUpdate): Promise<Plan> {
  const { data } = await apiClient.put<ApiUpdateResp<Plan>>(`/planes/${idPlan}`, payload);
  return data.data;
}

export async function deletePlan(idPlan: number): Promise<void> {
  await apiClient.delete(`/planes/${idPlan}`);
}
