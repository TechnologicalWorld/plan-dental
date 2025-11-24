"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { dashboardService } from "../../dashboard/dashboardService";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

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

  useEffect(() => {
    if (!idUsuario) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          rowsPiezas,
          rowsPlan,
          rowsHistoria,
          rowsCita,
          rowsDoctores,
        ] = await Promise.all([
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

        setPiezasEstado(rowsPiezas);
        setUltimoPlan(rowsPlan[0] ?? null);
        setHistoriaClinica(rowsHistoria[0] ?? null);
        setUltimaCita(rowsCita[0] ?? null);
        setDoctores(rowsDoctores);
      } catch (e: any) {
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
    <div className="w-full max-w-full min-w-0 p-4 md:p-6 overflow-x-hidden text-slate-100">
      {/* Título */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Dashboard Paciente</h1>
        <p className="text-slate-300">
          Resumen de tu información clínica y de tus atenciones.
        </p>
        <p className="text-sm text-slate-500 mt-1">
          ID de usuario: <span className="font-mono">{idUsuario}</span>
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
<div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col">
  <h2 className="text-lg font-semibold mb-2">Estado de tus piezas dentales</h2>
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
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Tu último plan de tratamiento</h2>
          <p className="text-sm text-slate-400 mb-4">
            Resumen del plan más reciente registrado por tu odontólogo.
          </p>

          {ultimoPlan ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400">Observación:</span>
                <p className="text-slate-100 mt-1 whitespace-pre-line">
                  {ultimoPlan.observacion || "Sin observaciones registradas."}
                </p>
              </div>

              <div>
                <span className="text-slate-400">Medicamentos indicados:</span>
                <p className="text-slate-100 mt-1 whitespace-pre-line">
                  {ultimoPlan.medicamentos || "No se registraron medicamentos."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Duración del tratamiento:</span>
                <span className="text-slate-100 font-medium">
                  {ultimoPlan.duracionTotal || "No especificada"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Aún no tienes un plan de tratamiento registrado.
            </p>
          )}
        </div>
      </div>

      {/* Segunda fila: historia clínica + última cita + doctores */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Historia clínica */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 xl:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Historia clínica básica</h2>
          <p className="text-sm text-slate-400 mb-4">
            Información clave registrada en tu historia clínica.
          </p>

          {historiaClinica ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400">Antecedentes patológicos:</span>
                <p className="text-slate-100 mt-1 whitespace-pre-line">
                  {historiaClinica.antecedentesPatologicos ||
                    "Sin antecedentes registrados."}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Signos vitales:</span>
                <p className="text-slate-100 mt-1 whitespace-pre-line">
                  {historiaClinica.signosVitales || "No se registraron signos vitales."}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Enfermedad actual:</span>
                <p className="text-slate-100 mt-1 whitespace-pre-line">
                  {historiaClinica.enfermedadActual || "No se registró enfermedad actual."}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Aún no se ha registrado tu historia clínica.
            </p>
          )}
        </div>

        {/* Última cita */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">Tu última cita</h2>
          <p className="text-sm text-slate-400 mb-4">
            Detalles de la última cita registrada en el sistema.
          </p>

          {ultimaCita ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Estado:</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-xs">
                  {ultimaCita.estado}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Tipo de cita:</span>
                <span className="text-slate-100">{ultimaCita.tipoCita}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">Fecha y hora:</span>
                <span className="text-slate-100">
                  {new Date(ultimaCita.fecha).toLocaleDateString("es-BO")}{" "}
                  {ultimaCita.hora?.slice(0, 5)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Todavía no tienes citas registradas.
            </p>
          )}
        </div>

        {/* Doctores que te atienden */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">Tus doctores</h2>
          <p className="text-sm text-slate-400 mb-4">
            Odontólogos que te han atendido al menos una vez.
          </p>

          <div className="overflow-x-auto max-h-64">
            <table className="min-w-full text-sm text-left">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-3">Nombre</th>
                  <th className="py-2 px-3">Teléfono</th>
                  <th className="py-2 px-3">Correo</th>
                </tr>
              </thead>
              <tbody>
                {doctores.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 text-center text-slate-500"
                    >
                      Aún no se registraron doctores para tus citas.
                    </td>
                  </tr>
                )}
                {doctores.map((row, idx) => (
                  <tr
                    key={`${row.NombreDoctor}-${idx}`}
                    className="border-b border-slate-800/80"
                  >
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {row.NombreDoctor}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {row.telefono || "-"}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
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
        <div className="mt-4 text-sm text-slate-400">
          Cargando datos del dashboard...
        </div>
      )}
    </div>
  );
}
