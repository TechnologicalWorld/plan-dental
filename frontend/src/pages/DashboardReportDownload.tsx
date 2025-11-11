"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DashboardReportPDF, type ReportData, type ReportFilters } from "./DashboardReportPDF";
import { dashboardService, type MesParam } from "../entities/usuarios/dashboardservice";

async function fetchReportData(filters: ReportFilters): Promise<ReportData> {
  const { anio, mes, idUsuario } = filters;

  const calls: Promise<any>[] = [
    // Elimina la llamada a 'citasPorMesAnio'
    anio && mes ? dashboardService.citasPorDiaSemanaMes({ anio, mes }) : Promise.resolve([]),
    dashboardService.ingresosPorOdontoMes({ anio, mes }),
    dashboardService.resumenCitasPorOdonto({ anio, mes }),
    dashboardService.resumenCitasDias({ anio, mes, idUsuario: idUsuario ?? undefined }),
    dashboardService.reporteCitasEstadoOdontologo({ anio, mes }),
    dashboardService.gananciaCitasPorOdontologo({ anio, mes }),
    dashboardService.gananciaTratamientosPorOdontologo({ anio, mes }),
    dashboardService.gananciaPorTratamiento({ anio, mes }),
  ];

  const [
    citasPorDiaSemanaMes,
    ingresosPorOdontoMes,
    resumenCitasPorOdonto,
    resumenCitasDias,
    reporteCitasEstadoOdontologo,
    gananciaCitasPorOdontologo,
    gananciaTratamientosPorOdontologo,
    gananciaPorTratamiento,
  ] = await Promise.all(calls);

  return {
    filtros: filters,
    citasPorDiaSemanaMes, // Solo esta consulta quedará
    ingresosPorOdontoMes,
    resumenCitasPorOdonto,
    resumenCitasDias,
    reporteCitasEstadoOdontologo,
    gananciaCitasPorOdontologo,
    gananciaTratamientosPorOdontologo,
    gananciaPorTratamiento,
  };
}

export default function DashboardReportDownload(props: {
  anio?: number;
  mes?: MesParam;
  idUsuario?: number;
  fileName?: string;
  titulo?: string;
  generateLabel?: string; // <- texto del botón
}) {
  const [data, setData] = React.useState<ReportData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function build() {
    setLoading(true);
    setError(null);
    try {
      const filtros: ReportFilters = {
        anio: props.anio,
        mes: props.mes,
        idUsuario: props.idUsuario ?? null,
      };
      const d = await fetchReportData(filtros);
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generando el reporte");
    } finally {
      setLoading(false);
    }
  }

  // Si aún no se generó, mostramos el botón
  if (!data) {
    return (
      <div className="flex items-center gap-3">
        <button className="px-3 py-2 border rounded" onClick={build} disabled={loading}>
          {loading ? "Preparando..." : (props.generateLabel ?? "Generar reporte")}
        </button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
    );
  }

  // Una vez generado, se muestra el enlace de descarga del PDF
  return (
    <PDFDownloadLink
      document={<DashboardReportPDF data={data} titulo={props.titulo ?? "Informe de Gestión"} />}
      fileName={props.fileName ?? "informe-dashboard.pdf"}
      className="px-3 py-2 border rounded"
    >
      {({ loading }) => (loading ? "Renderizando..." : "Descargar PDF")}
    </PDFDownloadLink>
  );
}
