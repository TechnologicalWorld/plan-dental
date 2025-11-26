import api from "@/shared/api/apiClient";
import type { AxiosError } from "axios";

// —— Tipos comunes ——
export type MesParam =
  | number // 1..12
  | "ene" | "enero"
  | "feb" | "febrero"
  | "mar" | "marzo"
  | "abr" | "abril"
  | "may" | "mayo"
  | "jun" | "junio"
  | "jul" | "julio"
  | "ago" | "agosto"
  | "sep" | "sept" | "set" | "septiembre" | "setiembre"
  | "oct" | "octubre"
  | "nov" | "noviembre"
  | "dic" | "diciembre";

export type Rows<T = any> = T[];

function qs(params: Record<string, unknown>) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    p.append(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

function unwrap<T>(promise: Promise<{ data: T }>): Promise<T> {
  return promise
    .then((r) => r.data)
    .catch((err: AxiosError<any>) => {
      const msg =
        err.response?.data?.error ?? 
        err.response?.data?.message ?? 
        err.message ?? 
        "Error de red";
      throw new Error(msg);
    });
}

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ======================= SERVICE =======================

export const reportesService = {
  obtenerIngresosYPendientes(params: { anio?: number; mes?: MesParam } = {}) {
    return unwrap<Rows<{ ingresos: string; pendiente: string }>>(
      api.get(`/reportes/ingresos-y-pendientes${qs(params)}`)
    );
  },

  obtenerTotalCitas(params: { anio?: number; mes?: MesParam } = {}) {
    return unwrap<Rows<{ total_citas: number }>>(
      api.get(`/reportes/total-citas${qs(params)}`)
    );
  },

  obtenerOdontologosActivos() {
    return unwrap<Rows<{ odontologos_activos: number }>>(
      api.get(`/reportes/odontologos-activos`)
    );
  },

  obtenerCitasPorEstado(params: { anio?: number; mes?: MesParam } = {}) {
    return unwrap<Rows<{ estado: string; total: number }>>(
      api.get(`/reportes/citas-por-estado${qs(params)}`)
    );
  },

  obtenerSumaPagado(params: { anio?: number; mes?: MesParam } = {}) {
    return unwrap<Rows<{ total_pagado: string }>>(
      api.get(`/reportes/suma-pagado${qs(params)}`)
    );
  },
};
