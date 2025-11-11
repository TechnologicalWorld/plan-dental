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

// ---------- Tema dark (combina con tu dashboard) ----------
const theme = {
  grid: "rgba(226,232,240,0.16)",
  axis: "rgba(226,232,240,0.28)",
  tick: "#E2E8F0",
  tickSubtle: "#94A3B8",
  tooltipBg: "#0B1220",
  tooltipBorder: "#1F2937",
  tooltipText: "#E2E8F0",
};

// Colores por estado
const estadoColor: Record<string, string> = {
  Atendida: "#34D399",   // verde
  Pendiente: "#F59E0B",  // ámbar
  Cancelada: "#F87171",  // rojo
  Reprogramada: "#A78BFA",
  "No Asistió": "#60A5FA",
};
const fallbackColors = ["#22D3EE", "#38BDF8", "#7DD3FC", "#67E8F9", "#93C5FD"];

// ---------- Días (orden L->D) ----------
const DIAS_TITULO = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;
const DIA_MAP: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miércoles: "Miércoles",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sábado: "Sábado",
  sabado: "Sábado",
  domingo: "Domingo",
};
const normalizeDia = (raw: string) => DIA_MAP[raw.trim().toLowerCase()] || raw;

// ---------- Tipos del SP ----------
type RowSP = {
  idUsuario: number | null; // SP puede traer NULL si agregas "Todos" desde backend; aquí no lo usamos
  estado: string;
  anio: number;
  mes: number; // 1..12
  dia: string; // 'lunes'...'domingo'
  Nro: number;
};

// Fila para el chart: 'dia' string + claves dinámicas por estado (number) + 'total'
type ChartRow = {
  dia: string;
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

/* =======================
   MOCK: emula el SP
   ======================= */
const ODONTO_IDS = [101, 102, 103, 104, 105, 106];
function generarMockResumenDias(fromYear = 2024, toYear = 2026): RowSP[] {
  const rows: RowSP[] = [];
  const diasLower = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  for (let y = fromYear; y <= toYear; y++) {
    for (let m = 1; m <= 12; m++) {
      const estacional = m === 4 || m === 11 ? 1.1 : m === 1 ? 0.9 : 1;
      for (const uid of ODONTO_IDS) {
        diasLower.forEach((dl, wd) => {
          // pesos por día (más citas de mié-jue)
          const pesoDia = [0.8, 0.9, 1.2, 1.25, 1.0, 0.85, 0.7][wd];
          const base = 20 * estacional * pesoDia * (0.9 + Math.random() * 0.4);
          const atendida = Math.max(0, Math.round(base + Math.random() * 15));
          const pendiente = Math.max(0, Math.round(base * 0.25 + Math.random() * 6));
          const cancelada = Math.max(0, Math.round(base * 0.18 + Math.random() * 5));
          rows.push(
            { idUsuario: uid, estado: "Atendida", anio: y, mes: m, dia: dl, Nro: atendida },
            { idUsuario: uid, estado: "Pendiente", anio: y, mes: m, dia: dl, Nro: pendiente },
            { idUsuario: uid, estado: "Cancelada", anio: y, mes: m, dia: dl, Nro: cancelada },
          );
        });
      }
    }
  }
  return rows;
}

/* =======================
   Pivot + filtros
   ======================= */
function prepararChartDias(
  spRows: RowSP[],
  p_anio: number | null,
  p_mes: number | null,
  p_idUsuario: number | null
): { data: ChartRow[]; estados: string[]; odontologos: number[] } {
  // filtrar
  const filtrado = spRows.filter((r) => {
    const okY = p_anio == null || r.anio === p_anio;
    const okM = p_mes == null || r.mes === p_mes;
    const okU = p_idUsuario == null || r.idUsuario === p_idUsuario;
    return okY && okM && okU;
  });

  // set de odontólogos para llenar el select
  const odontologos = Array.from(new Set(filtrado.map((r) => r.idUsuario || 0))).sort(
    (a, b) => a - b
  );

  // set de estados
  const estadosSet = new Set<string>();
  filtrado.forEach((r) => estadosSet.add(r.estado));
  const estados = Array.from(estadosSet.values());

  // mapa por día (construimos todos para que no falte ninguno)
  const map = new Map<string, ChartRow>();
  DIAS_TITULO.forEach((d) => map.set(d, { dia: d, total: 0 }));

  for (const r of filtrado) {
    const diaTit = normalizeDia(r.dia);
    if (!map.has(diaTit)) map.set(diaTit, { dia: diaTit, total: 0 });
    const row = map.get(diaTit)!;
    row[r.estado] = (Number(row[r.estado]) || 0) + r.Nro;
    row.total = (row.total as number) + r.Nro;
  }

  // salida ordenada L->D
  const data = DIAS_TITULO.map((d) => map.get(d)!).filter(Boolean);

  return { data, estados, odontologos };
}

/* =======================
   Componente
   ======================= */
export default function ResumenCitasDias() {
  const anios = useMemo(() => {
    const ys: number[] = [];
    for (let y = 2024; y <= 2026; y++) ys.push(y);
    return ys;
  }, []);

  const mockRows = useMemo(() => generarMockResumenDias(2024, 2026), []);
  const [anio, setAnio] = useState<number | null>(2024);
  const [mes, setMes] = useState<number | null>(11);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [odontologos, setOdontologos] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setErr(null);
    setLoading(true);

    // ---- MOCK local ----
    const { data, estados, odontologos } = prepararChartDias(mockRows, anio, mes, idUsuario);
    setChartData(data);
    setEstados(estados);
    setOdontologos(odontologos);
    setLoading(false);

    // ---- Fetch real (descomenta y ajusta ruta si tu endpoint es otro) ----
    /*
    (async () => {
      try {
        const params = new URLSearchParams();
        if (anio != null) params.set("anio", String(anio));
        if (mes != null) params.set("mes", String(mes));
        if (idUsuario != null) params.set("idUsuario", String(idUsuario));
        const res = await fetch(`/dashboard/resumen-citas-dias?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows: RowSP[] = await res.json();
        const { data, estados, odontologos } = prepararChartDias(rows, anio, mes, idUsuario);
        setChartData(data);
        setEstados(estados);
        setOdontologos(odontologos);
      } catch (e: any) {
        setErr(e.message || "Error de red");
      } finally {
        setLoading(false);
      }
    })();
    */
  }, [anio, mes, idUsuario, mockRows]);

  const titulo = `Citas por día de la semana${
    anio ? ` — ${anio}` : ""
  }${mes ? ` / ${MESES_ES.find((m) => m.value === mes)?.label}` : ""}${
    idUsuario != null ? ` — Odontólogo #${idUsuario}` : " — Todos"
  }`;

  return (
    <div className="w-full min-w-0 p-4 space-y-6">
      <h2 className="text-2xl font-semibold">{titulo}</h2>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Año:</label>
          <select
            className="border rounded px-2 py-1"
            value={anio ?? ""}
            onChange={(e) => setAnio(e.target.value === "" ? null : Number(e.target.value))}
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
            className="border rounded px-2 py-1"
            value={mes ?? ""}
            onChange={(e) => setMes(e.target.value === "" ? null : Number(e.target.value))}
          >
            <option value="">Todos</option>
            {MESES_ES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Odontólogo (ID):</label>
          <select
            className="border rounded px-2 py-1"
            value={idUsuario ?? ""}
            onChange={(e) =>
              setIdUsuario(e.target.value === "" ? null : Number(e.target.value))
            }
          >
            <option value="">Todos</option>
            {odontologos.map((id) => (
              <option key={id} value={id}>
                {`#${id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-400">Cargando…</div>}
      {err && <div className="text-sm text-red-400">Error: {err}</div>}

      {/* ===== Gráfico ===== */}
      <div
        className="w-full min-w-0 rounded-md p-2"
        style={{ border: `1px solid ${theme.axis}`, height: 420 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={16}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="4 6" />

            <XAxis
              dataKey="dia"
              tick={{ fill: theme.tick }}
              axisLine={{ stroke: theme.axis }}
              tickLine={{ stroke: theme.axis }}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
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
              formatter={(v: number, name) => [v.toString(), name]}
            />

            <Legend wrapperStyle={{ color: theme.tick }} />

            {estados.map((estado, i) => (
              <Bar
                key={estado}
                dataKey={estado}
                name={estado}
                stackId="total"
                fill={estadoColor[estado] || fallbackColors[i % fallbackColors.length]}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla detalle */}
      <div className="overflow-x-auto">
        <table className="min-w-[480px] border border-gray-200/30 text-sm">
          <thead className="bg-gray-50/5">
            <tr>
              <th className="px-3 py-2 text-left border-b border-gray-200/20">Día</th>
              {estados.map((e) => (
                <th key={e} className="px-3 py-2 text-right border-b border-gray-200/20">{e}</th>
              ))}
              <th className="px-3 py-2 text-right border-b border-gray-200/20">Total</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((r) => (
              <tr key={String(r.dia)}>
                <td className="px-3 py-2 border-b border-gray-200/10">{r.dia}</td>
                {estados.map((e) => (
                  <td key={e} className="px-3 py-2 text-right border-b border-gray-200/10">
                    {Number(r[e]) || 0}
                  </td>
                ))}
                <td className="px-3 py-2 text-right border-b border-gray-200/10">{r.total as number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
