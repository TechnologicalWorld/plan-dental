import api from "@/shared/api/apiClient";
import { addMinutes, combineDateAndTime, extractHHmm } from "@/shared/utils/dateHelper";

export type CitaAPI = {
  idCita: number;
  hora: string;   
  fecha: string;  
  estado: string;
  tipoCita: string;
  costo?: string | number;
  pagado?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CalendarioEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  estado: string;
  tipoCita: string;
  raw: CitaAPI;
};

export async function fetchCitasComoEventos(): Promise<CalendarioEvent[]> {
  const { data } = await api.get("/citas");
  const arr: CitaAPI[] = Array.isArray(data?.data) ? data.data : data;

  return (arr ?? []).map((c) => {
    const hhmm = extractHHmm(String(c.hora));                  
    const start = combineDateAndTime(String(c.fecha), hhmm);   
    const end = addMinutes(start, 60);                         
    return {
      id: Number(c.idCita),
      title: String(c.tipoCita ?? "Cita"),
      start,
      end,
      estado: String(c.estado ?? "pendiente"),
      tipoCita: String(c.tipoCita ?? ""),
      raw: c,
    };
  });
}

export async function fetchCitaDetalle(id: number) {
  const { data } = await api.get(`/citas/${id}`);
  return data?.data ?? data;
}
