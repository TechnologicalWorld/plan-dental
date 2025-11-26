"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { dashboardService } from "../dashboardservice";

type RowPiezaEstado = {
  idUsuario: number;
  estado: string;
  Nro: number;
};

type RowUltimoPlan = {
  medicamentos: string;
  observacion: string;
  duracionTotal: string;
};

type RowHistoriaClinica = {
  idUsuario: number;
  antecedentesPatologicos: string;
  signosVitales: string;
  enfermedadActual: string;
};

type RowUltimaCita = {
  estado: string;
  tipoCita: string;
  fecha: string;
  hora: string;
};

type RowDoctor = {
  NombreDoctor: string;
  telefono: string;
  correo: string;
};

const piezaColors = [
  "#38BDF8",
  "#22D3EE",
  "#A78BFA",
  "#4ADE80",
  "#F97316",
  "#F472B6",
];

const tooltipStyle = {
  backgroundColor: "#020617",
  borderColor: "#1E293B",
  borderRadius: 8,
};

// Estilos de animación
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;

export default function DashboardPaciente() {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario ?? null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [piezasEstado, setPiezasEstado] = useState<RowPiezaEstado[]>([]);
  const [ultimoPlan, setUltimoPlan] = useState<RowUltimoPlan | null>(null);
  const [historiaClinica, setHistoriaClinica] =
    useState<RowHistoriaClinica | null>(null);
  const [ultimaCita, setUltimaCita] = useState<RowUltimaCita | null>(null);
  const [doctores, setDoctores] = useState<RowDoctor[]>([]);

  // Agregar estilos al documento
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (!idUsuario) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled([
          dashboardService.pacientePiezasPorEstado<RowPiezaEstado>({
            idUsuario,
          }),
          dashboardService.pacienteUltimoPlan<RowUltimoPlan>({ idUsuario }),
          dashboardService.pacienteHistoriaClinica<RowHistoriaClinica>({
            idUsuario,
          }),
          dashboardService.pacienteUltimaCita<RowUltimaCita>({ idUsuario }),
          dashboardService.pacienteDoctores<RowDoctor>({ idUsuario }),
        ]);

        // Procesar cada resultado individualmente
        if (results[0].status === 'fulfilled') {
          setPiezasEstado(results[0].value);
        } else {
          console.error('Error en piezas por estado:', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          setUltimoPlan(results[1].value[0] ?? null);
        } else {
          console.error('Error en último plan:', results[1].reason);
        }

        if (results[2].status === 'fulfilled') {
          setHistoriaClinica(results[2].value[0] ?? null);
        } else {
          console.error('Error en historia clínica:', results[2].reason);
        }

        if (results[3].status === 'fulfilled') {
          setUltimaCita(results[3].value[0] ?? null);
        } else {
          console.error('Error en última cita:', results[3].reason);
        }

        if (results[4].status === 'fulfilled') {
          setDoctores(results[4].value);
        } else {
          console.error('Error en doctores:', results[4].reason);
        }

        // Si todos fallaron, mostrar mensaje de error
        const allFailed = results.every(r => r.status === 'rejected');
        if (allFailed) {
          setError("No se pudo cargar ningún dato del dashboard. Por favor, intenta de nuevo.");
        }
      } catch (e: any) {
        console.error('Error general:', e);
        setError(e.message ?? "Error al cargar el dashboard del paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idUsuario]);

  if (!idUsuario) {
    return (
      <div className="w-full max-w-full min-w-0 p-4 overflow-x-hidden">
        <h1 className="text-2xl font-semibold mb-3">Dashboard Paciente</h1>
        <p className="text-slate-300">
          No se encontró el ID de usuario en la sesión.
        </p>
      </div>
    );
  }

  const dataPiezasPie = piezasEstado.map((row) => ({
    name: row.estado,
    value: row.Nro,
  }));

  return (
    <div className="w-full max-w-full min-w-0 p-4 md:p-6 overflow-x-hidden text-slate-100 animate-fadeIn">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Dashboard Paciente
        </h1>
        <p className="text-slate-300 text-lg">
          Resumen de tu información clínica y de tus atenciones.
        </p>
        <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          ID de usuario: <span className="font-mono font-semibold text-cyan-400">{idUsuario}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Primera fila: gráfico + último plan */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Piezas por estado */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Estado de tus piezas dentales</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Distribución de tus piezas según su estado actual en el odontograma.
          </p>

          <div className="flex-1 h-80">
            {dataPiezasPie.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                No hay datos de piezas dentales registrados.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, bottom: 10 }}>
                  <Pie
                    data={dataPiezasPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="55%"
                    innerRadius="45%"
                    outerRadius="75%"
                    paddingAngle={2}
                  >
                    {dataPiezasPie.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={piezaColors[index % piezaColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "#E5E7EB" }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ color: "#E5E7EB", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Último plan */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Tu último plan de tratamiento</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Resumen del plan más reciente registrado por tu odontólogo.
          </p>

          {ultimoPlan ? (
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span className="text-slate-400 font-medium flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Observación
                </span>
                <p className="text-slate-100 ml-3.5 whitespace-pre-line">
                  {ultimoPlan.observacion || "Sin observaciones registradas."}
                </p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span className="text-slate-400 font-medium flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Medicamentos indicados
                </span>
                <p className="text-slate-100 ml-3.5 whitespace-pre-line">
                  {ultimoPlan.medicamentos || "No se registraron medicamentos."}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Duración del tratamiento</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {ultimoPlan.duracionTotal || "No especificada"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-sm text-slate-500 text-center">
                Aún no tienes un plan de tratamiento registrado.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Segunda fila: historia clínica + última cita + doctores */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Historia clínica */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 xl:col-span-1 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Historia clínica básica</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Información clave registrada en tu historia clínica.
          </p>

          {historiaClinica ? (
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span className="text-slate-400 font-medium flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Antecedentes patológicos
                </span>
                <p className="text-slate-100 ml-3.5 whitespace-pre-line text-sm">
                  {historiaClinica.antecedentesPatologicos ||
                    "Sin antecedentes registrados."}
                </p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span className="text-slate-400 font-medium flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                  Signos vitales
                </span>
                <p className="text-slate-100 ml-3.5 whitespace-pre-line text-sm">
                  {historiaClinica.signosVitales || "No se registraron signos vitales."}
                </p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span className="text-slate-400 font-medium flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                  Enfermedad actual
                </span>
                <p className="text-slate-100 ml-3.5 whitespace-pre-line text-sm">
                  {historiaClinica.enfermedadActual || "No se registró enfermedad actual."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-sm text-slate-500 text-center">
                Aún no se ha registrado tu historia clínica.
              </p>
            </div>
          )}
        </div>

        {/* Última cita */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Tu última cita</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Detalles de la última cita registrada en el sistema.
          </p>

          {ultimaCita ? (
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 font-medium block mb-2">Estado</span>
                <span className="inline-flex px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 font-semibold text-sm">
                  {ultimaCita.estado}
                </span>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span className="text-slate-400 font-medium flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  Tipo de cita
                </span>
                <span className="text-slate-100 ml-3.5 font-medium">{ultimaCita.tipoCita}</span>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
                <span className="text-slate-400 font-medium block mb-2">Fecha y hora</span>
                <span className="text-lg font-bold text-cyan-400">
                  {new Date(ultimaCita.fecha).toLocaleDateString("es-BO")}{" "}
                  <span className="text-blue-400">{ultimaCita.hora?.slice(0, 5)}</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-sm text-slate-500 text-center">
                Todavía no tienes citas registradas.
              </p>
            </div>
          )}
        </div>

        {/* Doctores que te atienden */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
              <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Tus doctores</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Odontólogos que te han atendido al menos una vez.
          </p>

          <div className="overflow-x-auto max-h-64 rounded-lg border border-slate-700/50">
            <table className="min-w-full text-sm text-left">
              <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-sm">
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-4 font-semibold text-cyan-400">Nombre</th>
                  <th className="py-3 px-4 font-semibold text-cyan-400">Teléfono</th>
                  <th className="py-3 px-4 font-semibold text-cyan-400">Correo</th>
                </tr>
              </thead>
              <tbody>
                {doctores.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-slate-500"
                    >
                      Aún no se registraron doctores para tus citas.
                    </td>
                  </tr>
                )}
                {doctores.map((row, idx) => (
                  <tr
                    key={`${row.NombreDoctor}-${idx}`}
                    className="border-b border-slate-800/80 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-100">
                      {row.NombreDoctor}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {row.telefono || "-"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {row.correo || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-6 flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <span className="text-slate-300 font-medium">
            Cargando datos del dashboard...
          </span>
        </div>
      )}
    </div>
  );
}