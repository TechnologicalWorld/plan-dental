import apiClient from '@/shared/api/apiClient';
import type { Tratamiento, TratamientoCreate, TratamientoUpdate } from '@/types/tratamiento';

type ListResp<T> = { success: boolean; data: T };
type ShowResp<T> = { success: boolean; data: T };

export async function getTratamientos(): Promise<Tratamiento[]> {
  const { data } = await apiClient.get<ListResp<Tratamiento[]>>('/tratamientos');
  return data.data;
}

export async function getTratamientoById(id: number): Promise<Tratamiento> {
  const { data } = await apiClient.get<ShowResp<Tratamiento>>(`/tratamientos/${id}`);
  return data.data;
}

export async function createTratamiento(payload: TratamientoCreate): Promise<Tratamiento> {
  
  const { data } = await apiClient.post<Tratamiento>('/tratamientos', payload);
  return data;
}

export async function updateTratamiento(id: number, payload: TratamientoUpdate): Promise<Tratamiento> {
  const { data } = await apiClient.put(`/tratamientos/${id}`, payload);
  
  return (data as any).data;
}

export async function deleteTratamiento(id: number): Promise<void> {
  await apiClient.delete(`/tratamientos/${id}`);
}
