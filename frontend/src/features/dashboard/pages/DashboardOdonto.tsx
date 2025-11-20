"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { dashboardService, type MesParam } from "../dashboardservice"; // ajusta ruta si es necesario

// Paleta (coherente con tu tema oscuro)
const chartTheme = {
  grid: "rgba(148, 163, 184, 0.25)",
  axis: "#E2E8F0",
  tick: "#CBD5F5",
  tickSubtle: "#94A3B8",
  bar: "#38BDF8",
  barAlt: "#22D3EE",
  line: "#A78BFA",
  tooltipBg: "#020617",
  tooltipBorder: "#1E293B",
  tooltipText: "#E5E7EB",
};

// Tipos básicos (puedes afinarlos si quieres)
type RowCitasPorPaciente = {
  idUsuario: number;
  nombre_completo: string;
  NroCitas: number;
};

type RowTratamientos = {
  nombre: string;
  NroTratamientosRealizados: number;
};

type RowIngresosMensuales = {
  total: number;
  anio: number;
  mes: number;
  idUsuario: number;
};

type RowKpiCitas = { TotalCitas: number };
type RowKpiIngresos = { Total: number };
type RowKpiOdontogramas = { NroOdontogramas: number };

type RowUltimoPlan = {
  idUsuario: number;
  nombre_completo: string;
  tipoCita: string;
  observacion: string;
  medicamentos: string;
  duracionTotal: string;
  fecha: string;
};

const mesesLabels = [
  "",
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function DashboardOdonto() {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario ?? null;

  const hoy = new Date();
  const [anio, setAnio] = useState<number>(hoy.getFullYear());
  const [mes, setMes] = useState<number | "todos">(hoy.getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [citasPorPaciente, setCitasPorPaciente] = useState<RowCitasPorPaciente[]>([]);
  const [tratamientos, setTratamientos] = useState<RowTratamientos[]>([]);
  const [ingresosMensuales, setIngresosMensuales] = useState<RowIngresosMensuales[]>([]);
  const [kpiCitas, setKpiCitas] = useState<RowKpiCitas | null>(null);
  const [kpiIngresos, setKpiIngresos] = useState<RowKpiIngresos | null>(null);
  const [kpiOdontogramas, setKpiOdontogramas] = useState<RowKpiOdontogramas | null>(null);
  const [ultimosPlanes, setUltimosPlanes] = useState<RowUltimoPlan[]>([]);

  // Mes a enviar al backend (puede ser undefined si el usuario elige "todos")
  const mesParam: MesParam | undefined = useMemo(() => {
    if (mes === "todos") return undefined;
    return mes;
  }, [mes]);

  useEffect(() => {
    if (!idUsuario) return;

    const paramsBase = {
      anio,
      mes: mesParam,
      idUsuario,
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          rowsCitasPac,
          rowsTrat,
          rowsIngresosMens,
          rowsNroOdontos,
          rowsTotalCitas,
          rowsTotalIngresos,
          rowsUltimoPlan,
        ] = await Promise.all([
          dashboardService.grafCitasPorPaciente<RowCitasPorPaciente>(paramsBase),
          dashboardService.grafTratamientosRealizados<RowTratamientos>(paramsBase),
          dashboardService.grafIngresosMensualesPorOdontologo<RowIngresosMensuales>({
            anio,
            mes: mesParam,
            idUsuario,
          }),
          dashboardService.nroOdontogramasPaciente<RowKpiOdontogramas>({
            anio,
            mes: mesParam,
            idUsuario,
          }),
          dashboardService.totalCitasOdontologo<RowKpiCitas>({
            anio,
            mes: mesParam,
            idUsuario,
          }),
          dashboardService.totalIngresosOdontologo<RowKpiIngresos>({
            anio,
            mes: mesParam,
            idUsuario,
          }),
          dashboardService.ultimoPlanPaciente<RowUltimoPlan>({
            anio,
            mes: mesParam,
            idUsuario,
          }),
        ]);

        setCitasPorPaciente(rowsCitasPac);
        setTratamientos(rowsTrat);
        setIngresosMensuales(rowsIngresosMens);
        setKpiOdontogramas(rowsNroOdontos[0] ?? null);
        setKpiCitas(rowsTotalCitas[0] ?? null);
        setKpiIngresos(rowsTotalIngresos[0] ?? null);
        setUltimosPlanes(rowsUltimoPlan);
      } catch (e: any) {
        setError(e.message ?? "Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idUsuario, anio, mesParam, mes]);

  if (!idUsuario) {
    return (
      <div className="w-full max-w-full min-w-0 p-4 overflow-x-hidden">
        <h1 className="text-2xl font-semibold mb-3">Dashboard Odontológico</h1>
        <p className="text-slate-300">
          No se encontró el ID de usuario en la sesión.
        </p>
      </div>
    );
  }

  // Datos transformados para los gráficos
  const dataCitasBar = citasPorPaciente.map((row) => ({
    nombre: row.nombre_completo,
    citas: row.NroCitas,
  }));

  const dataTratamientosBar = tratamientos.map((row) => ({
    nombre: row.nombre,
    cantidad: row.NroTratamientosRealizados,
  }));

  const dataIngresosLine = ingresosMensuales.map((row) => ({
    mesLabel: `${mesesLabels[row.mes]} ${row.anio}`,
    total: row.total,
  }));

  const totalIngresosNumber = kpiIngresos?.Total ?? 0;
  const totalCitasNumber = kpiCitas?.TotalCitas ?? 0;
  const totalOdontogramasNumber = kpiOdontogramas?.NroOdontogramas ?? 0;

  return (
    <div className="w-full max-w-full min-w-0 p-4 md:p-6 overflow-x-hidden text-slate-100">
      {/* Título + filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dashboard Odontológico</h1>
          <p className="text-slate-300">
            Resumen de actividad del odontólogo.
          </p>
          <p className="text-sm text-slate-500 mt-1">
            ID de Usuario: <span className="font-mono">{idUsuario}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-sm">
            <span className="text-slate-400 mb-1">Año</span>
            <input
              type="number"
              className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm text-slate-100 w-24"
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value) || hoy.getFullYear())}
            />
          </div>

          <div className="flex flex-col text-sm">
            <span className="text-slate-400 mb-1">Mes</span>
            <select
              className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm text-slate-100"
              value={mes}
              onChange={(e) =>
                setMes(e.target.value === "todos" ? "todos" : Number(e.target.value))
              }
            >
              <option value="todos">Todos</option>
              {mesesLabels.map(
                (label, idx) =>
                  idx !== 0 && (
                    <option key={idx} value={idx}>
                      {label}
                    </option>
                  )
              )}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total citas</p>
          <p className="text-2xl font-semibold">{totalCitasNumber}</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Ingresos (Bs)</p>
          <p className="text-2xl font-semibold">
            {totalIngresosNumber.toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Odontogramas registrados</p>
          <p className="text-2xl font-semibold">{totalOdontogramasNumber}</p>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Citas por paciente */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Citas por paciente</h2>
          <p className="text-sm text-slate-400 mb-4">
            Pacientes atendidos en el periodo seleccionado.
          </p>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataCitasBar}
                margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
              >
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="nombre"
                  stroke={chartTheme.axis}
                  tick={{ fill: chartTheme.tickSubtle, fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke={chartTheme.axis}
                  tick={{ fill: chartTheme.tick, fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: chartTheme.tooltipText }}
                  itemStyle={{ color: chartTheme.tooltipText }}
                />
                <Bar
                  dataKey="citas"
                  fill={chartTheme.bar}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tratamientos realizados */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Tratamientos realizados</h2>
          <p className="text-sm text-slate-400 mb-4">
            Frecuencia de tratamientos en el periodo.
          </p>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataTratamientosBar}
                margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="nombre"
                  stroke={chartTheme.axis}
                  tick={{ fill: chartTheme.tickSubtle, fontSize: 11 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  stroke={chartTheme.axis}
                  tick={{ fill: chartTheme.tick, fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: chartTheme.tooltipText }}
                  itemStyle={{ color: chartTheme.tooltipText }}
                />
                <Bar
                  dataKey="cantidad"
                  fill={chartTheme.barAlt}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ingresos mensuales + Últimos planes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ingresos mensuales */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Ingresos mensuales</h2>
          <p className="text-sm text-slate-400 mb-4">
            Evolución de ingresos por mes (citas facturadas).
          </p>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dataIngresosLine}
                margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
              >
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="mesLabel"
                  stroke={chartTheme.axis}
                  tick={{ fill: chartTheme.tickSubtle, fontSize: 11 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke={chartTheme.axis}
                  tick={{ fill: chartTheme.tick, fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: chartTheme.tooltipText }}
                  itemStyle={{ color: chartTheme.tooltipText }}
                  formatter={(value: any) =>
                    `${Number(value).toLocaleString("es-BO", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} Bs`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={chartTheme.line}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimos planes por paciente */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">Últimos planes por paciente</h2>
          <p className="text-sm text-slate-400 mb-4">
            Resumen de planes de tratamiento más recientes de tus pacientes.
          </p>

          <div className="overflow-x-auto max-h-72">
            <table className="min-w-full text-sm text-left">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-3">Paciente</th>
                  <th className="py-2 px-3">Tipo cita</th>
                  <th className="py-2 px-3">Observación</th>
                  <th className="py-2 px-3">Medicamentos</th>
                  <th className="py-2 px-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ultimosPlanes.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-slate-500"
                    >
                      No hay datos para el periodo seleccionado.
                    </td>
                  </tr>
                )}
                {ultimosPlanes.map((row, idx) => (
                  <tr
                    key={`${row.idUsuario}-${idx}`}
                    className="border-b border-slate-800/80"
                  >
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {row.nombre_completo}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {row.tipoCita}
                    </td>
                    <td className="py-2 px-3 max-w-xs truncate">
                      {row.observacion}
                    </td>
                    <td className="py-2 px-3 max-w-xs truncate">
                      {row.medicamentos}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {new Date(row.fecha).toLocaleDateString("es-BO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-sm text-slate-400">
          Cargando datos del dashboard...
        </div>
      )}
    </div>
  );
}
