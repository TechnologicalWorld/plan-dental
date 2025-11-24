// src/components/resumen_citas_por_odonto.tsx
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

import { dashboardService, type MesParam } from "../dashboardservice";

const theme = {
  grid: "rgba(226,232,240,0.16)",
  axis: "rgba(226,232,240,0.28)",
  tick: "#E2E8F0",
  tickSubtle: "#94A3B8",
  tooltipBg: "#0B1220",
  tooltipBorder: "#1F2937",
  tooltipText: "#E2E8F0",
};


const ESTADO_COLORS: Record<string, string> = {
  Confirmada: "#60A5FA",   
  Completada: "#34D399",   
  Pendiente:  "#F59E0B",   
  Cancelada:  "#F87171",   
  Reprogramada: "#A78BFA", 
  "No asistió": "#93C5FD", 
};
const FALLBACK_COLORS = ["#22D3EE", "#38BDF8", "#7DD3FC", "#67E8F9", "#93C5FD", "#5EEAD4"];

type ServerRow = {
  idUsuario: number;
  nombre_completo: string;
  estado: string;      
  anio: number;
  mes: number;         
  Nro: number | string;
};

type ChartRow = {
  idUsuario: number;
  odontologo: string;
  total: number;
  [estado: string]: number | string;
};

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

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function normalizeEstado(estadoRaw: string): string {
  const k = stripAccents(estadoRaw.trim().toLowerCase());
  const map: Record<string, string> = {
    confirmada: "Confirmada",
    completada: "Completada",
    pendiente: "Pendiente",
    cancelada: "Cancelada",
    reprogramada: "Reprogramada",
    "no asistio": "No asistió",
    atendida: "Completada", 
  };
  return map[k] ?? estadoRaw.charAt(0).toUpperCase() + estadoRaw.slice(1);
}

function getEstadoColor(estado: string, idx: number) {
  return ESTADO_COLORS[estado] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

function yAxisWidthForLabels(labels: string[], base = 200, pxPerChar = 7) {
  const maxLen = labels.reduce((m, s) => Math.max(m, s.length), 0);
  return Math.max(base, Math.min(360, Math.round(maxLen * pxPerChar)));
}

function prepararChart(rows: ServerRow[]) {
  const map = new Map<number, ChartRow>(); 
  const estadosSet = new Set<string>();

  for (const r of rows) {
    const estado = normalizeEstado(String(r.estado));
    estadosSet.add(estado);

    if (!map.has(r.idUsuario)) {
      map.set(r.idUsuario, {
        idUsuario: r.idUsuario,
        odontologo: r.nombre_completo,
        total: 0,
      });
    }

    const row = map.get(r.idUsuario)!;
    row[estado] = (Number(row[estado]) || 0) + (Number(r.Nro) || 0);
    row.total = (row.total as number) + (Number(r.Nro) || 0);
  }

  const data = Array.from(map.values()).sort(
    (a, b) => (b.total as number) - (a.total as number)
  );

  const preferredOrder = ["Confirmada", "Completada", "Pendiente", "Cancelada", "Reprogramada", "No asistió"];
  const estados = [
    ...preferredOrder.filter((e) => estadosSet.has(e)),
    ...Array.from(estadosSet).filter((e) => !preferredOrder.includes(e)),
  ];

  return { data, estados };
}

// ---------- Componente ----------
export default function ResumenCitasPorOdonto() {
  const [anio, setAnio] = useState<number | null>(2024);
  const [mes, setMes] = useState<number | null>(10);

  const anios = useMemo(() => {
    const ys: number[] = [];
    for (let y = 2024; y <= 2026; y++) ys.push(y);
    return ys;
  }, []);

  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
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

        const rows = await dashboardService.resumenCitasPorOdonto<ServerRow>(params);

        const { data, estados } = prepararChart(rows);
        setChartData(data);
        setEstados(estados);
      } catch (e: any) {
        setErr(e?.message ?? "Error al obtener datos");
        setChartData([]);
        setEstados([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [anio, mes]);

  const titulo = `Resumen de citas por odontólogo${
    anio ? ` — ${anio}` : ""
  }${mes ? ` / ${MESES_ES.find((m) => m.value === mes)?.label}` : ""}`;

  const chartHeight = Math.max(360, Math.ceil(chartData.length * 56));
  const yWidth = yAxisWidthForLabels(chartData.map((d) => d.odontologo));

  return (
    <div className="w-full min-w-0 p-4 space-y-6">
      <h2 className="text-2xl font-semibold">{titulo}</h2>

      {/* Filtros */}
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

      {/* ===== Barras apiladas horizontales ===== */}
      <div
        className="w-full min-w-0 rounded-md p-2"
        style={{ border: `1px solid ${theme.axis}`, height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barCategoryGap={10}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="4 6" />

            <XAxis
              type="number"
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
              allowDecimals={false}
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
              formatter={(v: number, name) => [String(v), name]}
            />

            <Legend wrapperStyle={{ color: theme.tick }} />

            {estados.map((estado, i) => (
              <Bar
                key={estado}
                dataKey={estado}
                name={estado}
                stackId="total"
                fill={getEstadoColor(estado, i)}
                radius={[0, 12, 12, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla resumen */}
      <div className="overflow-x-auto">
        <table className="min-w-[480px] border border-gray-200/30 text-sm">
          <thead className="bg-gray-50/5">
            <tr>
              <th className="px-3 py-2 text-left border-b border-gray-200/20">Odontólogo</th>
              {estados.map((e) => (
                <th key={e} className="px-3 py-2 text-right border-b border-gray-200/20">{e}</th>
              ))}
              <th className="px-3 py-2 text-right border-b border-gray-200/20">Total</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((r) => (
              <tr key={r.idUsuario}>
                <td className="px-3 py-2 border-b border-gray-200/10">{r.odontologo}</td>
                {estados.map((e) => (
                  <td key={e} className="px-3 py-2 text-right border-b border-gray-200/10">
                    {Number(r[e]) || 0}
                  </td>
                ))}
                <td className="px-3 py-2 text-right border-b border-gray-200/10">
                  {r.total as number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
