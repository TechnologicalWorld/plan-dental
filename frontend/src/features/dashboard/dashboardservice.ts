// dashboardService.ts

import api from "@/shared/api/apiClient";
import type { AxiosInstance, AxiosError } from "axios";

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

// Normaliza y arma querystring ignorando undefined/null
function qs(params: Record<string, unknown>) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    p.append(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

// Manejo de error uniforme
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

/** Si usas token Bearer, expón un setter opcional */
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ======================= SERVICE =======================
export const dashboardService = {
  /**
   * GET /dashboard/citas-por-mes-anio?anio=&mes=
   */
  citasPorMesAnio<T = any>(params: { anio?: number; mes?: MesParam }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/citas-por-mes-anio${qs(params)}`)
    );
  },

  /**
   * GET /dashboard/citas-por-dia-semana-mes?mes=&anio=
   * (anio y mes son requeridos por el backend)
   */
  citasPorDiaSemanaMes<T = any>(params: { anio: number; mes: MesParam }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/citas-por-dia-semana-mes${qs(params)}`)
    );
  },

  /**
   * GET /dashboard/ingresos-odonto?anio=&mes=
   */
  ingresosPorOdontoMes<T = any>(params: { anio?: number; mes?: MesParam }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/ingresos-odonto${qs(params)}`)
    );
  },

  /**
   * GET /dashboard/resumen-citas-odonto?anio=&mes=
   */
  resumenCitasPorOdonto<T = any>(params: { anio?: number; mes?: MesParam }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/resumen-citas-odonto${qs(params)}`)
    );
  },

  /**
   * GET /dashboard/citas-dias?anio=&mes=&idUsuario=
   */
  resumenCitasDias<T = any>(params: {
    anio?: number;
    mes?: MesParam;
    idUsuario?: number;
  }) {
    return unwrap<Rows<T>>(api.get(`/dashboard/citas-dias${qs(params)}`));
  },

  /**
   * GET /dashboard/citas-estado-odontologo?anio=&mes=
   */
  reporteCitasEstadoOdontologo<T = any>(params: {
    anio?: number;
    mes?: MesParam;
  }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/citas-estado-odontologo${qs(params)}`)
    );
  },

  /**
   * GET /dashboard/ganancia-citas-odontologo?anio=&mes=
   */
  gananciaCitasPorOdontologo<T = any>(params: {
    anio?: number;
    mes?: MesParam;
  }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/ganancia-citas-odontologo${qs(params)}`)
    );
  },

  /**
   * GET /dashboard/ganancia-tratamientos-odontologo?anio=&mes=
   */
  gananciaTratamientosPorOdontologo<T = any>(params: {
    anio?: number;
    mes?: MesParam;
  }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/ganancia-tratamientos-odontologo${qs(params)}`)
    );
  },

  /**
   * GET /dashboard/ganancia-por-tratamiento?anio=&mes=
   */
  gananciaPorTratamiento<T = any>(params: {
    anio?: number;
    mes?: MesParam;
  }) {
    return unwrap<Rows<T>>(
      api.get(`/dashboard/ganancia-por-tratamiento${qs(params)}`)
    );
  },

    // ======================================================
    // =============== NUEVOS MÉTODOS DASHBOARD =============
    // ======================================================

    /**
     * GET /dashboard/graf-citas-por-paciente?anio=&mes=&idUsuario=
     */
    grafCitasPorPaciente<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/graf-citas-por-paciente${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/graf-tratamientos-realizados?anio=&mes=&idUsuario=
     */
    grafTratamientosRealizados<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/graf-tratamientos-realizados${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/graf-ingresos-mensuales-odontologo?anio=&mes=&idUsuario=
     */
    grafIngresosMensualesPorOdontologo<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/graf-ingresos-mensuales-odontologo${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/nro-odontogramas-paciente?anio=&mes=&idUsuario=
     */
    nroOdontogramasPaciente<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/nro-odontogramas-paciente${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/total-citas-odontologo?anio=&mes=&idUsuario=
     */
    totalCitasOdontologo<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/total-citas-odontologo${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/total-ingresos-odontologo?anio=&mes=&idUsuario=
     */
    totalIngresosOdontologo<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/total-ingresos-odontologo${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/ultimo-plan-paciente?anio=&mes=&idUsuario=
     * (versión con filtros anio/mes/idUsuario)
     */
    ultimoPlanPaciente<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/ultimo-plan-paciente${qs(params)}`)
      );
    },

    // ---------- Endpoints por paciente (idUsuario obligatorio) ----------

    /**
     * GET /dashboard/paciente/piezas-por-estado?idUsuario=
     */
    pacientePiezasPorEstado<T = any>(params: { idUsuario: number }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/paciente/piezas-por-estado${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/paciente/ultimo-plan?idUsuario=
     */
    pacienteUltimoPlan<T = any>(params: { idUsuario: number }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/paciente/ultimo-plan${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/paciente/historia-clinica?idUsuario=
     */
    pacienteHistoriaClinica<T = any>(params: { idUsuario: number }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/paciente/historia-clinica${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/paciente/ultima-cita?idUsuario=
     */
    pacienteUltimaCita<T = any>(params: { idUsuario: number }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/paciente/ultima-cita${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/paciente/doctores?idUsuario=
     */
    pacienteDoctores<T = any>(params: { idUsuario: number }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/paciente/doctores${qs(params)}`)
      );
    },

        /**
     * GET /dashboard/cd-ingresos-odonto-mes?anio=&mes=
     */
    cdIngresosPorOdontoMes<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-ingresos-odonto-mes${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-resumen-citas-dias?anio=&mes=&idUsuario=
     */
    cdResumenCitasDias<T = any>(params: {
      anio?: number;
      mes?: MesParam;
      idUsuario?: number;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-resumen-citas-dias${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-resumen-citas-odonto?anio=&mes=
     */
    cdResumenCitasPorOdonto<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-resumen-citas-odonto${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-ganancia-citas-odontologo?anio=&mes=
     */
    cdGananciaCitasPorOdontologo<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-ganancia-citas-odontologo${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-ganancia-por-tratamiento?anio=&mes=
     */
    cdGananciaPorTratamiento<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-ganancia-por-tratamiento${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-ganancia-tratamientos-odontologo?anio=&mes=
     */
    cdGananciaTratamientosPorOdontologo<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-ganancia-tratamientos-odontologo${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-reporte-citas-estado-odontologo?anio=&mes=
     */
    cdReporteCitasEstadoOdontologo<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-reporte-citas-estado-odontologo${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-vaciar-bd?dbname=
     * (OJO: este devuelve { message: string }, no array)
     */
    cdVaciarBd(params: { dbname: string }) {
      return unwrap<{ message: string }>(
        api.get(`/dashboard/cd-vaciar-bd${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-ingresos-y-pendientes?anio=&mes=
     */
    cdIngresosYPendientes<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-ingresos-y-pendientes${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-total-citas?anio=&mes=
     */
    cdTotalCitas<T = any>(params: { anio?: number; mes?: MesParam }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-total-citas${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-odontologos-activos
     */
    cdOdontologosActivos<T = any>() {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-odontologos-activos`)
      );
    },

    /**
     * GET /dashboard/cd-citas-por-estado?anio=&mes=
     */
    cdCitasPorEstado<T = any>(params: { anio?: number; mes?: MesParam }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-citas-por-estado${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-suma-pagado?anio=&mes=
     */
    cdSumaPagado<T = any>(params: { anio?: number; mes?: MesParam }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-suma-pagado${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-odontologos-citas-proporcion?anio=&mes=
     */
    cdOdontologosCitasProporcion<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-odontologos-citas-proporcion${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-facturacion-diaria?anio=&mes=
     */
    cdFacturacionDiaria<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-facturacion-diaria${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-estados-cita-proporcion?anio=&mes=
     */
    cdEstadosCitaProporcion<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-estados-cita-proporcion${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-resumen-administrativo?anio=&mes=
     */
    cdResumenAdministrativo<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-resumen-administrativo${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-tratamientos-proporcion?anio=&mes=
     */
    cdTratamientosProporcion<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-tratamientos-proporcion${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-odontogramas-odontologos?anio=&mes=
     */
    cdOdontogramasOdontologos<T = any>(params: {
      anio?: number;
      mes?: MesParam;
    }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-odontogramas-odontologos${qs(params)}`)
      );
    },

    /**
     * GET /dashboard/cd-paciente-doctores?idUsuario=
     */
    cdPacienteDoctores<T = any>(params: { idUsuario: number }) {
      return unwrap<Rows<T>>(
        api.get(`/dashboard/cd-paciente-doctores${qs(params)}`)
      );
    },
    // ======================================================
    // ================== OTROS SERVICIOS ===================
    // ======================================================

    async getodontologos() {
      const { data } = await api.get("/odontologos");
      console.log(data);
      return data;
    },
  };
