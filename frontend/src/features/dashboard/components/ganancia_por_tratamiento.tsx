"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ⬅️ Ajusta esta ruta
import { dashboardService, type MesParam } from "../dashboardservice";
// -------------------- Tema (oscuro) --------------------
const theme = {
  grid: "rgba(226,232,240,0.16)",
  axis: "rgba(226,232,240,0.28)",
  tick: "#E2E8F0",
  tickSubtle: "#94A3B8",
  tooltipBg: "#0B1220",
  tooltipBorder: "#1F2937",
  tooltipText: "#E2E8F0",
};

const money = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  maximumFractionDigits: 2,
});

// -------------------- Tipos --------------------
type ServerRow = {
  idUsuario: number;
  nombre_completo: string;
  total_ganancia_tratamiento: number | string;
};

type ChartRow = {
  idUsuario: number;
  odontologo: string;
  total: number;
};

// Util
const MESES_ES = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
] as const;

function mapRows(rows: ServerRow[]): ChartRow[] {
  const data = rows.map((r) => ({
    idUsuario: r.idUsuario,
    odontologo: r.nombre_completo,
    total: Number(r.total_ganancia_tratamiento) || 0,
  }));
  data.sort((a, b) => b.total - a.total); // ranking DESC
  return data;
}

function yAxisWidthForLabels(labels: string[], base = 180, pxPerChar = 7) {
  const maxLen = labels.reduce((m, s) => Math.max(m, s.length), 0);
  return Math.max(base, Math.min(360, Math.round(maxLen * pxPerChar)));
}

// -------------------- Componente --------------------
export default function GananciaTratamientosPorOdontologo() {
  // Por tu ejemplo: Octubre 2024
  const [anio, setAnio] = useState<number | null>(2024);
  const [mes, setMes] = useState<number | null>(10);

  const anios = useMemo(() => {
    const ys: number[] = [];
    for (let y = 2024; y <= 2026; y++) ys.push(y);
    return ys;
  }, []);

  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const params: { anio?: number; mes?: MesParam } = {};
        if (anio != null) params.anio = anio;
        if (mes != null) params.mes = mes as MesParam;

        const rows = await dashboardService.gananciaTratamientosPorOdontologo<ServerRow>(params);
        setChartData(mapRows(rows));
      } catch (e: any) {
        setErr(e?.message ?? "Error al obtener datos");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [anio, mes]);

  const titulo = `Ganancia por tratamientos — por odontólogo${
    anio ? ` — ${anio}` : ""
  }${mes ? ` / ${MESES_ES.find((m) => m.value === mes)?.label}` : ""}`;

  const chartHeight = Math.max(320, chartData.length * 56);
  const yWidth = yAxisWidthForLabels(chartData.map((d) => d.odontologo));

  return (
    <div className="w-full min-w-0 p-4 space-y-6">
      <h2 className="text-2xl font-semibold">{titulo}</h2>

      {/* Filtros (texto negro + fondo que encaja) */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Año:</label>
          <select
            className="border rounded px-2 py-1 bg-white text-black dark:bg-white dark:text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={anio ?? ""}
            onChange={(e) => setAnio(e.target.value === "" ? null : Number(e.target.value))}
            style={{ WebkitTextFillColor: "#000" }}
          >
            <option value="">Todos</option>
            {anios.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Mes:</label>
          <select
            className="border rounded px-2 py-1 bg-white text-black dark:bg-white dark:text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={mes ?? ""}
            onChange={(e) => setMes(e.target.value === "" ? null : Number(e.target.value))}
            style={{ WebkitTextFillColor: "#000" }}
          >
            <option value="">Todos</option>
            {MESES_ES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-400">Cargando…</div>}
      {err && <div className="text-sm text-red-400">Error: {err}</div>}
      {!loading && !err && chartData.length === 0 && (
        <div className="text-sm text-gray-400">Sin datos para el filtro seleccionado.</div>
      )}

      {/* ====== Gráfico (horizontal) ====== */}
      <div
        className="w-full min-w-0 rounded-md p-2"
        style={{ border: `1px solid ${theme.axis}`, height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barCategoryGap={14}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="4 6" />

            <XAxis
              type="number"
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
              tickFormatter={(v) => money.format(Number(v))}
            />
            <YAxis
              type="category"
              dataKey="odontologo"
              width={yWidth}
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
            />

            <Tooltip
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                background: theme.tooltipBg,
                border: `1px solid ${theme.tooltipBorder}`,
                color: theme.tooltipText,
                borderRadius: 12,
              }}
              itemStyle={{ color: theme.tooltipText }}
              labelStyle={{ color: theme.tickSubtle }}
              formatter={(v: number) => [money.format(v), "Total"]}
            />

            <Legend wrapperStyle={{ color: theme.tick }} />
            <Bar
              dataKey="total"
              name="Total"
              fill="#22D3EE"
              radius={[0, 12, 12, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-[420px] border border-gray-200/30 text-sm">
          <thead className="bg-gray-50/5">
            <tr>
              <th className="px-3 py-2 text-left border-b border-gray-200/20">Odontólogo</th>
              <th className="px-3 py-2 text-right border-b border-gray-200/20">Total (BOB)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((r) => (
              <tr key={r.idUsuario}>
                <td className="px-3 py-2 border-b border-gray-200/10">{r.odontologo}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200/10">
                  {money.format(r.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
