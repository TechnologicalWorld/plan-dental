// Reportes.tsx
"use client";

import React, { useState, useEffect } from "react";
import { dashboardService, type MesParam } from "../entities/usuarios/dashboardservice";
import DashboardReportDownload from "./DashboardReportDownload";
// Tipos para los datos
interface GananciaTratamiento {
  nombre: string;
  total_ganancia_tratamiento: number;
}

interface GananciaOdontologo {
  idUsuario: number;
  nombre_completo: string;
  total_ganancia_tratamiento?: number;
  Total_Ganancia_Citas?: number;
}

interface ResumenCita {
  idUsuario: number;
  nombre_completo: string;
  estado: string;
  Nro: number;
  anio: number;
  mes: number;
}

interface CitaDiaSemana {
  dia_semana: string;
  total_citas: number;
}

interface Odontologo {
  idUsuario: number;
  nombre: string;
  paterno: string;
  materno: string;
}

interface ReportData {
  gananciaTratamientos: GananciaTratamiento[];
  gananciaTratamientosOdonto: GananciaOdontologo[];
  gananciaCitasOdonto: GananciaOdontologo[];
  resumenCitasEstado: ResumenCita[];
  citasPorDia: CitaDiaSemana[];
  odontologos: Odontologo[];
  ingresosPorOdonto: any[];
}

export default function Reportes() {
  const [anio, setAnio] = useState(2024);
  const [mes, setMes] = useState<MesParam>("octubre");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resumen' | 'odontologos' | 'tratamientos' | 'citas'>('resumen');

  const aniosOptions = Array.from({ length: 9 }, (_, i) => 2022 + i);

  const mesesOptions: { value: MesParam; label: string }[] = [
    { value: "enero", label: "Enero" },
    { value: "febrero", label: "Febrero" },
    { value: "marzo", label: "Marzo" },
    { value: "abril", label: "Abril" },
    { value: "mayo", label: "Mayo" },
    { value: "junio", label: "Junio" },
    { value: "julio", label: "Julio" },
    { value: "agosto", label: "Agosto" },
    { value: "septiembre", label: "Septiembre" },
    { value: "octubre", label: "Octubre" },
    { value: "noviembre", label: "Noviembre" },
    { value: "diciembre", label: "Diciembre" },
  ];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        gananciaTratamientos,
        gananciaTratamientosOdonto,
        gananciaCitasOdonto,
        resumenCitasEstado,
        citasPorDia,
        odontologos,
        ingresosPorOdonto,
      ] = await Promise.all([
        dashboardService.gananciaPorTratamiento({ anio, mes }),
        dashboardService.gananciaTratamientosPorOdontologo({ anio, mes }),
        dashboardService.gananciaCitasPorOdontologo({ anio, mes }),
        dashboardService.reporteCitasEstadoOdontologo({ anio, mes }),
        dashboardService.citasPorDiaSemanaMes({ anio, mes }),
        dashboardService.getodontologos(),
        dashboardService.ingresosPorOdontoMes({ anio, mes }),
      ]);

      setData({
        gananciaTratamientos,
        gananciaTratamientosOdonto,
        gananciaCitasOdonto,
        resumenCitasEstado,
        citasPorDia,
        odontologos,
        ingresosPorOdonto,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cálculos para el resumen ejecutivo
  const calcularResumen = () => {
    if (!data) return null;

    const totalTratamientos = data.gananciaTratamientos.reduce(
      (sum, t) => sum + (t.total_ganancia_tratamiento || 0),
      0
    );

    const totalCitas = data.resumenCitasEstado.reduce(
      (sum, c) => sum + (c.Nro || 0),
      0
    );

    const citasPorEstado = data.resumenCitasEstado.reduce((acc, c) => {
      acc[c.estado] = (acc[c.estado] || 0) + c.Nro;
      return acc;
    }, {} as Record<string, number>);

    const totalGananciaCitas = data.gananciaCitasOdonto.reduce(
      (sum, o) => sum + (o.Total_Ganancia_Citas || 0),
      0
    );

    const totalIngresos = totalTratamientos + totalGananciaCitas;

    const diaMasCitas = data.citasPorDia.reduce((max, dia) => 
      dia.total_citas > (max?.total_citas || 0) ? dia : max,
      data.citasPorDia[0]
    );

    return {
      totalTratamientos,
      totalCitas,
      citasPorEstado,
      totalGananciaCitas,
      totalIngresos,
      diaMasCitas,
      numeroOdontologos: data.odontologos.length,
      tratamientoMasRentable: data.gananciaTratamientos[0],
    };
  };

  const resumen = calcularResumen();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(value);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-[#0A0E27] min-h-screen">
      {/* Header */}
      <div className="bg-[#1A1F3A] rounded-lg shadow-lg border border-[#2A2F4A] p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard de Reportes
        </h1>
        <p className="text-gray-400">
          Análisis completo de la gestión clínica
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-[#1A1F3A] rounded-lg shadow-lg border border-[#2A2F4A] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Año
            </label>
            <select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#0A0E27] border border-[#2A2F4A] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {aniosOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mes
            </label>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value as MesParam)}
              className="w-full px-3 py-2 bg-[#0A0E27] border border-[#2A2F4A] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mesesOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      <DashboardReportDownload
        anio={anio}
        mes={mes}
      />
      {/* Tabs */}
      <div className="bg-[#1A1F3A] rounded-lg shadow-lg border border-[#2A2F4A]">
        <div className="border-b border-[#2A2F4A]">
          <nav className="flex -mb-px">
            {[
              { id: 'resumen', label: 'Resumen Ejecutivo' },
              { id: 'odontologos', label: 'Por Odontólogo' },
              { id: 'tratamientos', label: 'Tratamientos' },
              { id: 'citas', label: 'Citas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Resumen Ejecutivo */}
          {activeTab === 'resumen' && resumen && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-lg p-6 border border-blue-500/30">
                  <div className="text-sm font-medium text-blue-300 mb-1">
                    Total Ingresos
                  </div>
                  <div className="text-2xl font-bold text-blue-100">
                    {formatCurrency(resumen.totalIngresos)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-lg p-6 border border-green-500/30">
                  <div className="text-sm font-medium text-green-300 mb-1">
                    Total Citas
                  </div>
                  <div className="text-2xl font-bold text-green-100">
                    {resumen.totalCitas}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-lg p-6 border border-purple-500/30">
                  <div className="text-sm font-medium text-purple-300 mb-1">
                    Odontólogos Activos
                  </div>
                  <div className="text-2xl font-bold text-purple-100">
                    {resumen.numeroOdontologos}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-lg p-6 border border-orange-500/30">
                  <div className="text-sm font-medium text-orange-300 mb-1">
                    Día con más citas
                  </div>
                  <div className="text-lg font-bold text-orange-100 capitalize">
                    {resumen.diaMasCitas?.dia_semana}
                  </div>
                  <div className="text-sm text-orange-300">
                    {resumen.diaMasCitas?.total_citas} citas
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A0E27] rounded-lg p-6 border border-[#2A2F4A]">
                  <h3 className="text-lg font-semibold text-white mb-4">Citas por Estado</h3>
                  <div className="space-y-3">
                    {Object.entries(resumen.citasPorEstado).map(([estado, cantidad]) => (
                      <div key={estado} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">{estado}</span>
                        <span className="font-semibold text-white">{cantidad}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0A0E27] rounded-lg p-6 border border-[#2A2F4A]">
                  <h3 className="text-lg font-semibold text-white mb-4">Desglose de Ingresos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tratamientos</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(resumen.totalTratamientos)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Citas</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(resumen.totalGananciaCitas)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#2A2F4A]">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Total</span>
                        <span className="font-bold text-blue-400 text-lg">
                          {formatCurrency(resumen.totalIngresos)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {resumen.tratamientoMasRentable && (
                <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded-lg p-6 border border-yellow-500/30">
                  <h3 className="text-lg font-semibold text-yellow-200 mb-2">
                    🏆 Tratamiento Más Rentable
                  </h3>
                  <p className="text-2xl font-bold text-yellow-100">
                    {resumen.tratamientoMasRentable.nombre}
                  </p>
                  <p className="text-yellow-300">
                    {formatCurrency(resumen.tratamientoMasRentable.total_ganancia_tratamiento)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Por Odontólogo */}
          {activeTab === 'odontologos' && data && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Ganancia por Tratamientos</h3>
                <table className="min-w-full divide-y divide-[#2A2F4A]">
                  <thead className="bg-[#0A0E27]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Odontólogo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                        Total Ganancia
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1A1F3A] divide-y divide-[#2A2F4A]">
                    {data.gananciaTratamientosOdonto.map((odonto, idx) => (
                      <tr key={idx} className="hover:bg-[#0A0E27] transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {odonto.nombre_completo}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-white">
                          {formatCurrency(odonto.total_ganancia_tratamiento || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Ganancia por Citas</h3>
                <table className="min-w-full divide-y divide-[#2A2F4A]">
                  <thead className="bg-[#0A0E27]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Odontólogo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                        Total Ganancia
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1A1F3A] divide-y divide-[#2A2F4A]">
                    {data.gananciaCitasOdonto.map((odonto, idx) => (
                      <tr key={idx} className="hover:bg-[#0A0E27] transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {odonto.nombre_completo}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-white">
                          {formatCurrency(odonto.Total_Ganancia_Citas || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tratamientos */}
          {activeTab === 'tratamientos' && data && (
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Ganancia por Tratamiento</h3>
              <table className="min-w-full divide-y divide-[#2A2F4A]">
                <thead className="bg-[#0A0E27]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Tratamiento
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                      Ganancia Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1A1F3A] divide-y divide-[#2A2F4A]">
                  {data.gananciaTratamientos.map((trat, idx) => (
                    <tr key={idx} className="hover:bg-[#0A0E27] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {trat.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-white">
                        {formatCurrency(trat.total_ganancia_tratamiento)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Citas */}
          {activeTab === 'citas' && data && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Citas por Día de Semana</h3>
                  <div className="space-y-2">
                    {data.citasPorDia.map((dia, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-[#0A0E27] rounded-lg border border-[#2A2F4A]"
                      >
                        <span className="text-gray-300 capitalize font-medium">
                          {dia.dia_semana}
                        </span>
                        <span className="text-white font-bold">{dia.total_citas}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Resumen por Estado</h3>
                  <div className="space-y-2">
                    {data.resumenCitasEstado.slice(0, 10).map((cita, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#0A0E27] rounded-lg border border-[#2A2F4A]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {cita.nombre_completo}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                              Estado: {cita.estado}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-white">
                            {cita.Nro}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}