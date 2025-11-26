"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DashboardReportPDF, { type ReportData, type ReportFilters } from "./DashboardReportPDF";
import type { MesParam } from "../../dashboard/dashboardservice";

interface DashboardReportDownloadProps {
  datos?: { [key: string]: any[] };
  filtros: {
    anio: number;
    mes: number;
  };
  fileName?: string;
  titulo?: string;
}

function transformarDatosParaPDF(
  datos: { [key: string]: any[] },
  filtros: { anio: number; mes: number }
): ReportData {
  return {
    filtros: {
      anio: filtros.anio,
      mes: filtros.mes as MesParam,
      idUsuario: null,
    },
    citasPorDiaSemanaMes: datos.citasPorDiaSemana || [],
    ingresosPorOdontoMes: datos.ingresosPorOdontologo || [],
    resumenCitasPorOdonto: datos.resumenCitasOdontologo || [],
    resumenCitasDias: datos.resumenCitasDias || [],
    reporteCitasEstadoOdontologo: datos.citasEstadoOdontologo || [],
    gananciaCitasPorOdontologo: datos.gananciaCitasOdontologo || [],
    gananciaTratamientosPorOdontologo: datos.gananciaTratamientosOdontologo || [],
    gananciaPorTratamiento: datos.gananciaPorTratamiento || [],
  };
}

function PDFDownloader({ 
  pdfData, 
  titulo, 
  fileName, 
  onCancel 
}: { 
  pdfData: ReportData; 
  titulo: string; 
  fileName: string;
  onCancel: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-xl border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white mb-2 text-lg"> Reporte PDF Listo</h3>
          <p className="text-sm text-slate-300">
             Año {pdfData.filtros.anio} - {new Date(2000, (pdfData.filtros.mes as number) - 1).toLocaleString('es', { month: 'long' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-3 border-2 border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
          >
            Cancelar
          </button>
          <PDFDownloadLink
            document={<DashboardReportPDF data={pdfData} titulo={titulo} />}
            fileName={fileName}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 font-medium shadow-lg hover:shadow-emerald-500/50 inline-flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            {({ loading, error: pdfError }) => {
              if (pdfError) {
                console.error("Error en PDF:", pdfError);
                return (
                  <span className="text-red-300">
                    ❌ Error al generar
                  </span>
                );
              }
              
              return (
                <>
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar PDF
                    </>
                  )}
                </>
              );
            }}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}

export default function DashboardReportDownload({
  datos,
  filtros,
  fileName = "informe-dashboard.pdf",
  titulo = "Informe de Gestión Odontológica",
}: DashboardReportDownloadProps) {
  const [pdfData, setPdfData] = React.useState<ReportData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const filtroKey = `${filtros.anio}-${filtros.mes}`;
  const [currentKey, setCurrentKey] = React.useState(filtroKey);

  const prepararPDF = () => {
    try {
      setError(null);
      
      if (!datos || Object.keys(datos).length === 0) {
        setError("No hay datos disponibles para generar el reporte");
        return;
      }

      const dataTransformada = transformarDatosParaPDF(datos, filtros);
      setPdfData(dataTransformada);
      setCurrentKey(filtroKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al preparar el reporte");
      console.error("Error preparando PDF:", e);
    }
  };

  const cancelarPDF = () => {
    setPdfData(null);
  };

  React.useEffect(() => {
    if (filtroKey !== currentKey) {
      setPdfData(null);
      setError(null);
    }
  }, [filtroKey, currentKey]);

  if (!pdfData || filtroKey !== currentKey) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-xl border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white mb-2 text-lg"> Generar Reporte PDF</h3>
          </div>
          <button
            onClick={prepararPDF}
            disabled={!datos || Object.keys(datos).length === 0}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 active:scale-95"
          >
            Generar Reporte
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm backdrop-blur-sm">
            ⚠️ {error}
          </div>
        )}
        {(!datos || Object.keys(datos).length === 0) && (
          <div className="mt-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg text-amber-200 text-sm backdrop-blur-sm">
            ⏳ Por favor, espera a que se carguen los datos antes de generar el reporte
          </div>
        )}
      </div>
    );
  }

  return (
    <PDFDownloader
      key={currentKey}
      pdfData={pdfData}
      titulo={titulo}
      fileName={`${fileName.replace('.pdf', '')}-${filtroKey}.pdf`}
      onCancel={cancelarPDF}
    />
  );
}