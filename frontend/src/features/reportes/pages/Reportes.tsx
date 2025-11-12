// Reportes.tsx
"use client";

import React, { useState, useEffect } from "react";
import { dashboardService, type MesParam } from "../../dashboard/dashboardservice";
import DashboardReportDownload from "../components/DashboardReportDownload";
import { reportesService } from "../reportesservices";

const obteneringresos = reportesService.obtenerIngresosYPendientes;
const obtenertotalcitas = reportesService.obtenerTotalCitas;
const obtenerodontologos = reportesService.obtenerOdontologosActivos;
const obtenercitasestado = reportesService.obtenerCitasPorEstado;
const obtenersumapagado = reportesService.obtenerSumaPagado;
const citaspordiasemana = dashboardService.citasPorDiaSemanaMes;
const ingresosporodontomes = dashboardService.ingresosPorOdontoMes;
const resumencitasodontologo = dashboardService.resumenCitasPorOdonto;
const resumencitasdias = dashboardService.resumenCitasDias;
const reportecitasestadoodontologo = dashboardService.reporteCitasEstadoOdontologo;
const gananciacitasporodonto = dashboardService.gananciaCitasPorOdontologo;
const gananciaPorTratamiento = dashboardService.gananciaPorTratamiento;
const gananciaCitasPorOdontologo = dashboardService.gananciaTratamientosPorOdontologo;

interface ReporteData {
  [key: string]: any;
}

export default function Reportes() {
  const [datos, setDatos] = useState<{ [key: string]: ReporteData[] }>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtrosTemp, setFiltrosTemp] = useState({
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
  });

  const [datosListos, setDatosListos] = useState(false);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      setDatosListos(false);

      const resultados: { [key: string]: ReporteData[] } = {};

      resultados.ingresosYPendientes = await obteneringresos(filtrosAplicados);
      resultados.totalCitas = await obtenertotalcitas(filtrosAplicados);
      resultados.odontologosActivos = await obtenerodontologos();
      resultados.citasPorEstado = await obtenercitasestado(filtrosAplicados);
      resultados.sumaPagado = await obtenersumapagado(filtrosAplicados);

      resultados.citasPorDiaSemana = await citaspordiasemana(
        filtrosAplicados as { anio: number; mes: MesParam }
      );
      resultados.ingresosPorOdontologo = await ingresosporodontomes(filtrosAplicados);
      resultados.resumenCitasOdontologo = await resumencitasodontologo(filtrosAplicados);
      resultados.resumenCitasDias = await resumencitasdias(filtrosAplicados);
      resultados.citasEstadoOdontologo = await reportecitasestadoodontologo(filtrosAplicados);
      resultados.gananciaCitasOdontologo = await gananciacitasporodonto(filtrosAplicados);
      resultados.gananciaPorTratamiento = await gananciaPorTratamiento(filtrosAplicados);
      resultados.gananciaTratamientosOdontologo = await gananciaCitasPorOdontologo(
        filtrosAplicados
      );

      setDatos(resultados);
      setDatosListos(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos");
      setDatosListos(false);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosAplicados]);

  const aplicarFiltros = () => {
    setFiltrosAplicados({ ...filtrosTemp });
  };

  const renderizarDatos = (datosArray: ReporteData[], titulo: string) => {
    if (!datosArray || datosArray.length === 0) {
      return <p className="text-slate-400">No hay datos disponibles</p>;
    }

    if (typeof datosArray[0] === "object" && datosArray[0] !== null) {
      const claves = Object.keys(datosArray[0]);

      return (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-slate-800 border border-slate-700">
            <thead className="bg-slate-700">
              <tr>
                {claves.map((clave) => (
                  <th
                    key={clave}
                    className="px-4 py-3 border-b border-slate-600 font-semibold text-left text-slate-200 text-sm"
                  >
                    {clave.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosArray.map((fila, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-slate-800"
                      : "bg-slate-750 hover:bg-slate-700 transition-colors"
                  }
                >
                  {claves.map((clave) => (
                    <td
                      key={clave}
                      className="px-4 py-3 border-b border-slate-700 text-slate-300 text-sm"
                    >
                      {String(fila[clave])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {datosArray.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-slate-300"
          >
            {String(item)}
          </div>
        ))}
      </div>
    );
  };

  const hayCambiosPendientes =
    filtrosTemp.anio !== filtrosAplicados.anio ||
    filtrosTemp.mes !== filtrosAplicados.mes;

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-slate-300 flex items-center gap-3">
          <svg
            className="animate-spin h-6 w-6 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Cargando reportes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
        <strong>Error: </strong> {error}
        <button
          onClick={cargarDatos}
          className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Reportes del Sistema</h1>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-xl mb-6 border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Filtros</h2>
        <div className="flex gap-4 flex-wrap items-end">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Año
            </label>
            <input
              type="number"
              value={filtrosTemp.anio}
              onChange={(e) =>
                setFiltrosTemp({
                  ...filtrosTemp,
                  anio: parseInt(e.target.value) || new Date().getFullYear(),
                })
              }
              className="border border-slate-600 bg-slate-700 text-white rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Mes
            </label>
            <select
              value={filtrosTemp.mes}
              onChange={(e) =>
                setFiltrosTemp({ ...filtrosTemp, mes: parseInt(e.target.value) })
              }
              className="border border-slate-600 bg-slate-700 text-white rounded-lg px-4 py-2 w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                <option key={mes} value={mes}>
                  {new Date(2000, mes - 1).toLocaleString("es", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={aplicarFiltros}
              className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg transform hover:scale-105 active:scale-95 ${
                hayCambiosPendientes
                  ? "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/50"
                  : "bg-slate-600 text-slate-300 cursor-default"
              }`}
            >
              {hayCambiosPendientes ? "Aplicar Filtros" : "Filtros Aplicados"}
            </button>
            {hayCambiosPendientes && (
              <span className="text-amber-400 text-sm animate-pulse">
                Cambios pendientes
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            Mostrando datos de:{" "}
            <span className="text-white font-semibold">
              {new Date(2000, filtrosAplicados.mes - 1).toLocaleString("es", {
                month: "long",
              })}{" "}
              {filtrosAplicados.anio}
            </span>
          </p>
        </div>
      </div>

      {datosListos && Object.keys(datos).length > 0 && (
        <div className="mb-6">
          <DashboardReportDownload
            datos={datos}
            filtros={filtrosAplicados}
            titulo="Informe de Gestión Odontológica"
            fileName={`reporte-${filtrosAplicados.anio}-${filtrosAplicados.mes
              .toString()
              .padStart(2, "0")}.pdf`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(datos).map(([clave, valor]) => (
          <div
            key={clave}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-slate-700 hover:shadow-2xl hover:border-slate-600 transition-all duration-200"
          >
            <h2 className="text-xl font-semibold mb-4 text-white border-b border-slate-700 pb-3">
              {clave
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </h2>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {renderizarDatos(valor, clave)}
            </div>
            <div className="mt-4 text-sm text-slate-400 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
              Total de registros:{" "}
              <span className="font-semibold text-slate-200">
                {Array.isArray(valor) ? valor.length : 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold mb-6 text-white">Resumen General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-5 rounded-xl border border-blue-700/50 backdrop-blur-sm hover:scale-105 transition-transform">
            <h3 className="font-semibold text-blue-300 text-sm mb-1">
              Total de Reportes
            </h3>
            <p className="text-4xl font-bold text-blue-400">
              {Object.keys(datos).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 p-5 rounded-xl border border-emerald-700/50 backdrop-blur-sm hover:scale-105 transition-transform">
            <h3 className="font-semibold text-emerald-300 text-sm mb-1">
              Total de Registros
            </h3>
            <p className="text-4xl font-bold text-emerald-400">
              {Object.values(datos).reduce(
                (total, arr) => total + (Array.isArray(arr) ? arr.length : 0),
                0
              )}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-5 rounded-xl border border-purple-700/50 backdrop-blur-sm hover:scale-105 transition-transform">
            <h3 className="font-semibold text-purple-300 text-sm mb-1">Año</h3>
            <p className="text-4xl font-bold text-purple-400">
              {filtrosAplicados.anio}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 p-5 rounded-xl border border-amber-700/50 backdrop-blur-sm hover:scale-105 transition-transform">
            <h3 className="font-semibold text-amber-300 text-sm mb-1">Mes</h3>
            <p className="text-4xl font-bold text-amber-400">
              {new Date(2000, filtrosAplicados.mes - 1).toLocaleString("es", {
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
