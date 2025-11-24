"use client";

import React, { useEffect, useState, useMemo } from "react";
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

import { dashboardService, type MesParam } from "../dashboardservice";

const theme = {
  grid: "rgba(226,232,240,0.16)",
  axis: "rgba(226,232,240,0.28)",
  tick: "#E2E8F0",
  tickSubtle: "#94A3B8",
  barFrom: "#38BDF8",
  barTo: "#22D3EE",
  barHover: "#0EA5E9",
  line: "#A78BFA", 
  tooltipBg: "#0B1220",
  tooltipBorder: "#1F2937",
  tooltipText: "#E2E8F0",
};

const money = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  maximumFractionDigits: 2,
});

type RowCitas = {
  nombre_completo: string;
  estado: string;
  anio: number;
  mes: number;
  Nro: number;
};

type RowGanancia = {
  nombre_completo: string;
  Total_Ganancia_Citas: string;
};

type ChartRow = {
  odontologo: string;
  citas: number;
  ingresos: number;
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

const DAY_NUM_TO_NAME: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export default function IngresosYCitasPorOdonto() {
  const [anio, setAnio] = useState<number | null>(2024);
  const [mes, setMes] = useState<number | null>(10); 
  const [odontologos, setOdontologos] = useState<any[]>([]); 
  const [selectedOdontologo, setSelectedOdontologo] = useState<number | null>(null);

  const [chartDataCitas, setChartDataCitas] = useState<ChartRow[]>([]); 
  const [chartDataIngresos, setChartDataIngresos] = useState<ChartRow[]>([]); 

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchOdontologos = async () => {
      try {
        const data = await dashboardService.getodontologos(); 
        setOdontologos(data.data || []); 
        setSelectedOdontologo(data.data[0]?.idUsuario_Odontologo || null); 
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

        const [citas, ganancia] = await Promise.all([
          dashboardService.resumenCitasPorOdonto({ anio, mes }),
          dashboardService.gananciaCitasPorOdontologo({ anio, mes }),
        ]);

        const mergedDataCitas = citas.map((c: RowCitas) => ({
          odontologo: c.nombre_completo,
          citas: c.Nro,
        }));

        const mergedDataIngresos = ganancia.map((g: RowGanancia) => ({
          odontologo: g.nombre_completo,
          ingresos: Number(g.Total_Ganancia_Citas),
        }));

        setChartDataCitas(mergedDataCitas);
        setChartDataIngresos(mergedDataIngresos);
      } catch (e: any) {
        setErrorMsg(e?.message ?? "Error al obtener datos");
        setChartDataCitas([]);
        setChartDataIngresos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOdontologo, anio, mes]);

  const tituloCitas = `Citas por Odontólogo${
    anio ? ` — ${anio}` : ""
  }${mes ? ` / ${MESES_ES.find((m) => m.value === mes)?.label}` : ""}`;

  const tituloIngresos = `Ingresos por Odontólogo${
    anio ? ` — ${anio}` : ""
  }${mes ? ` / ${MESES_ES.find((m) => m.value === mes)?.label}` : ""}`;

  return (
    <div className="w-full min-w-0 p-4 space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Selector de Odontólogos */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Odontólogo:</label>
          <select
            className="border rounded px-2 py-1 bg-white text-black dark:bg-white dark:text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
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
            className="border rounded px-2 py-1"
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

      {/* ====== Gráfico de Citas ====== */}
      <div className="w-full min-w-0 h-96 border rounded-md p-2" style={{ borderColor: theme.axis }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartDataCitas} barCategoryGap={18}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.barFrom} />
                <stop offset="100%" stopColor={theme.barTo} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke={theme.grid} strokeDasharray="4 6" />
            <XAxis
              dataKey="odontologo"
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
              label={{ value: "Citas", angle: -90, position: "insideLeft", fill: theme.tick }}
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
              formatter={(v: number) => [`${v}`, "Citas"]}
            />
            <Legend wrapperStyle={{ color: theme.tick }} />

            <Bar
              dataKey="citas"
              name="Citas"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ====== Tabla de Citas ====== */}
      <div className="overflow-x-auto">
        <table className="min-w-[360px] border text-sm">
          <thead className="bg-gray-50/10">
            <tr>
              <th className="px-3 py-2 text-left border-b">Odontólogo</th>
              <th className="px-3 py-2 text-right border-b">Citas</th>
            </tr>
          </thead>
          <tbody>
            {chartDataCitas.map((r) => (
              <tr key={r.odontologo}>
                <td className="px-3 py-2 border-b">{r.odontologo}</td>
                <td className="px-3 py-2 text-right border-b">{r.citas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====== Gráfico de Ingresos ====== */}
      <div className="w-full min-w-0 h-96 border rounded-md p-2" style={{ borderColor: theme.axis }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartDataIngresos} margin={{ top: 16, right: 32, bottom: 24, left: 8 }}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="4 6" />
            <XAxis
              dataKey="odontologo"
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
              tickFormatter={(v) => money.format(Number(v))}
              label={{ value: "Ganancia (BOB)", angle: 90, position: "insideRight", fill: theme.tick }}
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
              formatter={(v: number) => [money.format(v), "Ingresos"]}
            />
            <Legend wrapperStyle={{ color: theme.tick }} />

            <Line
              type="monotone"
              dataKey="ingresos"
              name="Ingresos"
              stroke={theme.line}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ====== Tabla de Ingresos ====== */}
      <div className="overflow-x-auto">
        <table className="min-w-[360px] border text-sm">
          <thead className="bg-gray-50/10">
            <tr>
              <th className="px-3 py-2 text-left border-b">Odontólogo</th>
              <th className="px-3 py-2 text-right border-b">Ingresos (BOB)</th>
            </tr>
          </thead>
          <tbody>
            {chartDataIngresos.map((r) => (
              <tr key={r.odontologo}>
                <td className="px-3 py-2 border-b">{r.odontologo}</td>
                <td className="px-3 py-2 text-right border-b">{money.format(r.ingresos)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
