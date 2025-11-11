"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Ajusta esta ruta según tu estructura de carpetas
import { dashboardService, type MesParam } from "../../entities/usuarios/dashboardservice";

// -------------------- Tema (oscuro) --------------------
const theme = {
  grid: "rgba(226,232,240,0.16)",
  axis: "rgba(226,232,240,0.28)",
  tick: "#E2E8F0",
  tickSubtle: "#94A3B8",
  barFrom: "#38BDF8",
  barTo: "#22D3EE",
  barHover: "#0EA5E9",
  tooltipBg: "#0B1220",
  tooltipBorder: "#1F2937",
  tooltipText: "#E2E8F0",
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
];

type ServerRow = {
  dia_semana: string | number; // Ejemplo: "martes", "miércoles", 1..7
  total_citas?: number;
  NroCitas?: number; // Soporte retroactivo para la API anterior
};

type ChartRow = { dia: string; NroCitas: number };

// -------------------------------------
// Helpers para la API
// -------------------------------------
const DAY_NUM_TO_NAME: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

const normalizeDiaSemana = (d: string | number): string | null => {
  if (typeof d === "number") return DAY_NUM_TO_NAME[d] ?? null;
  const key = String(d).trim().toLowerCase();
  if (["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"].includes(key)) {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  return null;
};

const fillAndSortByWeekday = (rows: Array<{ dia: string; NroCitas: number }>): ChartRow[] => {
  const acc = new Map<string, number>();
  ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].forEach((d) => acc.set(d, 0));
  rows.forEach((r) => acc.set(r.dia, (acc.get(r.dia) || 0) + r.NroCitas));
  return ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((d) => ({ dia: d, NroCitas: acc.get(d) || 0 }));
};

// -------------------------------------
// UI
// -------------------------------------
export default function Dashboard() {
  const [anio, setAnio] = useState<number | null>(2024);
  const [mes, setMes] = useState<number | null>(10); // Octubre por defecto

  const [odontologos, setOdontologos] = useState<any[]>([]); // Asegúrate de que esto sea un array
  const [selectedOdontologo, setSelectedOdontologo] = useState<number | null>(null);

  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchOdontologos = async () => {
      try {
        const data = await dashboardService.getodontologos(); // Obtener odontólogos
        setOdontologos(data.data || []); // Aquí tomamos la propiedad "data" que tiene los odontólogos
        setSelectedOdontologo(data.data[0]?.idUsuario_Odontologo || null); // Establecer un odontólogo por defecto
      } catch (error) {
        console.error("Error al obtener odontólogos", error);
      }
    };

    fetchOdontologos();
  }, []);

  useEffect(() => {
    if (!selectedOdontologo || !anio || !mes) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const rows = await dashboardService.citasPorDiaSemanaMes<ServerRow>({
          anio,
          mes,
        });

        const mapped = rows
          .map((r) => {
            const dia = normalizeDiaSemana(r.dia_semana);
            if (!dia) return null;
            return { dia, NroCitas: r.total_citas ?? r.NroCitas ?? 0 };
          })
          .filter(Boolean) as ChartRow[];

        setChartData(fillAndSortByWeekday(mapped));
      } catch (e: any) {
        setErrorMsg(e?.message ?? "Error al obtener datos");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOdontologo, anio, mes]);

  const titulo = `Citas por día de la semana${
    anio ? ` — ${anio}` : ""
  }${mes ? ` / ${MESES_ES.find((m) => m.value === mes)?.label}` : ""}`;

  return (
    <div className="w-full min-w-0 p-4 space-y-6">
      <h2 className="text-2xl font-semibold">{titulo}</h2>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Selector de Odontólogos */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Odontólogo:</label>
          <select
            className="border rounded px-2 py-1 bg-gray text-black dark:bg-white dark:text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={selectedOdontologo ?? ""}
            onChange={(e) => setSelectedOdontologo(Number(e.target.value))}
          >
            {odontologos.map((odontologo) => (
              <option key={odontologo.idUsuario_Odontologo} value={odontologo.idUsuario_Odontologo}>
                {odontologo.usuario.nombre} {odontologo.usuario.paterno} {odontologo.usuario.materno}
              </option>
            ))}
          </select>
        </div>

        {/* Año y Mes */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Año:</label>
          <select
            className="border rounded px-2 py-1 bg-gray"
            value={anio ?? ""}
            onChange={(e) => setAnio(e.target.value === "" ? null : Number(e.target.value))}
          >
            <option value="">Selecciona</option>
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Mes:</label>
          <select
            className="border rounded px-2 py-1"
            value={mes ?? ""}
            onChange={(e) => setMes(e.target.value === "" ? null : Number(e.target.value))}
          >
            <option value="">Selecciona</option>
            {MESES_ES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-400">Cargando…</div>}
      {errorMsg && <div className="text-sm text-red-400">Error: {errorMsg}</div>}

      {/* ====== Gráfico ====== */}
      <div className="w-full min-w-0 h-96 border rounded-md p-2" style={{ borderColor: theme.axis }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={18}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.barFrom} />
                <stop offset="100%" stopColor={theme.barTo} />
              </linearGradient>
              <filter id="barShadow" x="-20%" y="-20%" width="140%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.35" />
              </filter>
            </defs>

            <CartesianGrid stroke={theme.grid} strokeDasharray="4 6" />
            <XAxis dataKey="dia" tick={{ fill: theme.tick }} axisLine={{ stroke: theme.axis }} tickLine={{ stroke: theme.axis }} tickMargin={8} />
            <YAxis allowDecimals={false} tick={{ fill: theme.tick }} axisLine={{ stroke: theme.axis }} tickLine={{ stroke: theme.axis }} />
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
              formatter={(v: number) => [`${v}`, "Citas"]}
            />
            <Bar
              dataKey="NroCitas"
              name="Citas"
              fill="url(#barGradient)"
              radius={[12, 12, 0, 0]}
              filter="url(#barShadow)"
              activeBar={{ fill: theme.barHover, radius: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-[360px] border text-sm">
          <thead className="bg-gray-50/10">
            <tr>
              <th className="px-3 py-2 text-left border-b">Día</th>
              <th className="px-3 py-2 text-right border-b">NroCitas</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((r) => (
              <tr key={r.dia}>
                <td className="px-3 py-2 border-b">{r.dia}</td>
                <td className="px-3 py-2 text-right border-b">{r.NroCitas}</td>
              </tr>
            ))}
            {!loading && chartData.length === 0 && anio && mes && !errorMsg && (
              <tr>
                <td colSpan={2} className="px-3 py-4 text-center text-gray-400">
                  Sin datos para el filtro seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
