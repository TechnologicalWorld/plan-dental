"use client";

import React, { useEffect, useState } from "react";

// ====== IMPORTA TUS GRÁFICOS (sin tildes/espacios en los nombres de archivo) ======
import IngresosPorOdontoMes from "../components/ingresos_por_odonto_mes";
import ResumenCitasPorOdonto from "../components/resumen_citas_por_odonto";
import ResumenCitasPorDias from "../components/resumen_citas_dias";
import GananciaPorTratamiento from "../components/ganancia_por_tratamiento";
import IngresosYCitasPorOdonto from "../components/ingresos_y_citas_por_odonto";
import CitasPorDiaSemana from "../components/Citas_por_día_de_la_semana"; // renombra si tu archivo tenía tilde

// ====== mapa de vistas ======
const VIEWS: Record<string, { title: string; Component: React.ComponentType }> = {
  "ingresos-citas": { title: "Citas (barras) vs Ganancia (línea)", Component: IngresosYCitasPorOdonto },
  "ingresos-mes":   { title: "Ingresos por odontólogo (mes)",       Component: IngresosPorOdontoMes },
  "resumen-odonto": { title: "Resumen de citas por odontólogo",      Component: ResumenCitasPorOdonto },
  "resumen-dias":   { title: "Citas por día de la semana",           Component: ResumenCitasPorDias },
  "ganancia-trat":  { title: "Ganancia por tratamiento (serie)",     Component: GananciaPorTratamiento },
  "citas-dia-mes":  { title: "Citas por día y mes",                   Component: CitasPorDiaSemana },
};

const DEFAULT_KEY = "ingresos-citas";

// Lee la clave desde la URL: /dashboard/<clave>
function getKeyFromPath(): string {
  if (typeof window === "undefined") return DEFAULT_KEY;
  const m = window.location.pathname.match(/\/dashboard\/([^\/]+)\/?$/i);
  const key = m?.[1] ?? "";
  return VIEWS[key] ? key : DEFAULT_KEY;
}

export default function DashboardView() {
  const [key, setKey] = useState<string>(() => getKeyFromPath());
  const Active = (VIEWS[key]?.Component ?? VIEWS[DEFAULT_KEY].Component) as React.ComponentType;

  // Sin recargar: navega y actualiza la URL
  const navigate = (k: string) => {
    if (typeof window === "undefined") return;
    const url = `/dashboard/${k}`;
    if (window.location.pathname !== url) {
      window.history.pushState({}, "", url);
    }
    setKey(k);
  };

  // Soporta Back/Forward del navegador
  useEffect(() => {
    const onPop = () => setKey(getKeyFromPath());
    window.addEventListener("popstate", onPop);
    // Si entras a /dashboard sin vista, reescribe a la default
    if (!window.location.pathname.match(/\/dashboard\/[^/]+/)) {
      window.history.replaceState({}, "", `/dashboard/${DEFAULT_KEY}`);
    }
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="w-full max-w-full min-w-0 p-4 overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-3">Dashboard</h1>

      {/* Navbar (anchors con pushState) */}
      <nav className="flex flex-wrap gap-2 mb-4">
        {Object.entries(VIEWS).map(([k, v]) => {
          const active = k === key;
          return (
            <a
              key={k}
              href={`/dashboard/${k}`}
              onClick={(e) => { e.preventDefault(); navigate(k); }}
              className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                active
                  ? "border-cyan-500/60 bg-cyan-900/30 text-cyan-200"
                  : "border-gray-700/60 text-gray-300 hover:bg-gray-800/40"
              }`}
            >
              {v.title}
            </a>
          );
        })}
      </nav>

      {/* Contenido */}
      <div className="w-full max-w-full min-w-0">
        <Active />
      </div>
    </div>
  );
}
