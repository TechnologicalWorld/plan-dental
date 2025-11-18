// features/pacientes/pages/MiHistorialPage.tsx
import { useEffect, useState } from "react";
import {
  obtenerMisHistoriasClinicas,
  obtenerMisDiagnosticos,
  obtenerMisPlanesTratamiento,
  obtenerMiHistorialMedico,
  obtenerDetalleHistoriaClinica,
  obtenerDetalleTratamiento,
  obtenerDetallePlanTratamiento,
} from "@/features/pacientes/pacientes.service";

// Tipos locales si no están exportados desde el service
type HistoriaClinica = {
  idHistoriaClinica: number;
  antecedentesPatologicos?: string;
  motivoConsulta?: string;
  signosVitales?: string;
  descripcionSignosSintomasDentales?: string;
  examenClinicoBucoDental?: string;
  observaciones?: string;
  enfermedadActual?: string;
  idUsuario_Paciente: number;
  idUsuario_Odontologo: number;
  createdAt?: string;
  updatedAt?: string;

  odontologo?: {
    usuario: {
      nombre: string;
      paterno?: string;
      materno?: string;
    };
  };
};

type Diagnostico = {
  idTratamiento: number;
  nombre: string;
  precio: number;
  idCita: number;
  fecha?: string;
  diagnosticoCIE?: string;
  procedimientoIndicacion?: string;
  cita?: {
    fecha: string;
    estado: string;
    odontologo?: {
      usuario: {
        nombre: string;
        paterno?: string;
        materno?: string;
      };
    };
  };
};

type PlanTratamiento = {
  idPlan: number;
  observacion?: string;
  medicamentos?: string;
  duracionTotal?: number;
  duracionEstimada?: number;
  idUsuario_Paciente: number;
  idOdontograma: number;
  estado: "activo" | "completado" | "cancelado";
  progreso?: number;
  fechaInicio?: string;
  fechaFinEstimada?: string;

  odontograma?: {
    nombre?: string;
    descripcion?: string;
    fecha: string;
  };

  tratamientos?: Array<{
    idTratamiento: number;
    nombre: string;
    estado: "pendiente" | "en_progreso" | "completado";
    fechaProgramada?: string;
    fechaRealizada?: string;
  }>;
};

export default function MiHistorialPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [historiasClinicas, setHistoriasClinicas] = useState<HistoriaClinica[]>(
    []
  );
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [planesTratamiento, setPlanesTratamiento] = useState<PlanTratamiento[]>(
    []
  );

  const [activeTab, setActiveTab] = useState<
    "historias" | "diagnosticos" | "planes"
  >("historias");
  const [selectedHistoria, setSelectedHistoria] =
    useState<HistoriaClinica | null>(null);
  const [selectedDiagnostico, setSelectedDiagnostico] =
    useState<Diagnostico | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanTratamiento | null>(
    null
  );
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // ===== CARGAR HISTORIAL =====
  async function cargarHistorial() {
    setLoading(true);
    setError(null);

    try {
      const [historiasData, diagnosticosData, planesData] = await Promise.all([
        obtenerMisHistoriasClinicas(),
        obtenerMisDiagnosticos(),
        obtenerMisPlanesTratamiento(),
      ]);

      setHistoriasClinicas(historiasData);
      setDiagnosticos(diagnosticosData);
      setPlanesTratamiento(planesData);
    } catch (e: any) {
      console.error("Error cargando historial:", e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo cargar tu historial médico.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarHistorial();
  }, []);

  // ===== FUNCIONES PARA VER DETALLES =====
  const verDetalleHistoria = async (historia: HistoriaClinica) => {
    setLoadingDetalle(true);
    try {
      const detalle = await obtenerDetalleHistoriaClinica(
        historia.idHistoriaClinica
      );
      setSelectedHistoria(detalle);
    } catch (e: any) {
      console.error("Error cargando detalle de historia:", e);
      setError("No se pudo cargar el detalle de la historia clínica.");
    } finally {
      setLoadingDetalle(false);
    }
  };

  const verDetalleDiagnostico = async (diagnostico: Diagnostico) => {
    setLoadingDetalle(true);
    try {
      const detalle = await obtenerDetalleTratamiento(
        diagnostico.idTratamiento
      );
      setSelectedDiagnostico({
        ...diagnostico,
        ...detalle,
      });
    } catch (e: any) {
      console.error("Error cargando detalle de diagnóstico:", e);
      setError("No se pudo cargar el detalle del tratamiento.");
    } finally {
      setLoadingDetalle(false);
    }
  };

  const verDetallePlan = async (plan: PlanTratamiento) => {
    setLoadingDetalle(true);
    try {
      const detalle = await obtenerDetallePlanTratamiento(plan.idPlan);
      setSelectedPlan(detalle);
    } catch (e: any) {
      console.error("Error cargando detalle de plan:", e);
      setError("No se pudo cargar el detalle del plan de tratamiento.");
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarDetalles = () => {
    setSelectedHistoria(null);
    setSelectedDiagnostico(null);
    setSelectedPlan(null);
  };

  // ===== RENDERIZADO DE DETALLES =====
  const renderDetalleHistoria = () => {
    if (!selectedHistoria) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Detalle de Historia Clínica
              </h3>
              <button
                onClick={cerrarDetalles}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {loadingDetalle ? (
              <div className="text-center py-8">Cargando detalles...</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Fecha de creación
                    </label>
                    <p className="text-white">
                      {selectedHistoria.createdAt
                        ? new Date(
                            selectedHistoria.createdAt
                          ).toLocaleDateString()
                        : "No disponible"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Odontólogo
                    </label>
                    <p className="text-white">
                      {selectedHistoria.odontologo?.usuario?.nombre ||
                        "No especificado"}
                    </p>
                  </div>
                </div>

                {selectedHistoria.motivoConsulta && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Motivo de Consulta
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedHistoria.motivoConsulta}
                    </p>
                  </div>
                )}

                {selectedHistoria.enfermedadActual && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Enfermedad Actual
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedHistoria.enfermedadActual}
                    </p>
                  </div>
                )}

                {selectedHistoria.antecedentesPatologicos && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Antecedentes Patológicos
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedHistoria.antecedentesPatologicos}
                    </p>
                  </div>
                )}

                {selectedHistoria.signosVitales && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Signos Vitales
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedHistoria.signosVitales}
                    </p>
                  </div>
                )}

                {selectedHistoria.descripcionSignosSintomasDentales && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Signos y Síntomas Dentales
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedHistoria.descripcionSignosSintomasDentales}
                    </p>
                  </div>
                )}

                {selectedHistoria.examenClinicoBucoDental && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Examen Clínico Buco-Dental
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedHistoria.examenClinicoBucoDental}
                    </p>
                  </div>
                )}

                {selectedHistoria.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Observaciones
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedHistoria.observaciones}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDetalleDiagnostico = () => {
    if (!selectedDiagnostico) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Detalle de Tratamiento</h3>
              <button
                onClick={cerrarDetalles}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {loadingDetalle ? (
              <div className="text-center py-8">Cargando detalles...</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Tratamiento
                    </label>
                    <p className="text-white font-medium">
                      {selectedDiagnostico.nombre}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Precio
                    </label>
                    <p className="text-white">
                      Bs. {selectedDiagnostico.precio}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Fecha
                    </label>
                    <p className="text-white">
                      {selectedDiagnostico.fecha
                        ? new Date(
                            selectedDiagnostico.fecha
                          ).toLocaleDateString()
                        : "No disponible"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Estado
                    </label>
                    <p className="text-white capitalize">
                      {selectedDiagnostico.cita?.estado || "No especificado"}
                    </p>
                  </div>
                </div>

                {selectedDiagnostico.diagnosticoCIE && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Diagnóstico CIE
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedDiagnostico.diagnosticoCIE}
                    </p>
                  </div>
                )}

                {selectedDiagnostico.procedimientoIndicacion && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Procedimiento/Indicación
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedDiagnostico.procedimientoIndicacion}
                    </p>
                  </div>
                )}

                {selectedDiagnostico.cita?.odontologo && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Odontólogo Responsable
                    </label>
                    <p className="text-white mt-1">
                      Dr. {selectedDiagnostico.cita.odontologo.usuario.nombre}
                      {selectedDiagnostico.cita.odontologo.usuario.paterno
                        ? ` ${selectedDiagnostico.cita.odontologo.usuario.paterno}`
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDetallePlan = () => {
    if (!selectedPlan) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Detalle del Plan de Tratamiento
              </h3>
              <button
                onClick={cerrarDetalles}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {loadingDetalle ? (
              <div className="text-center py-8">Cargando detalles...</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Estado
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedPlan.estado === "activo"
                          ? "bg-green-500/20 text-green-400"
                          : selectedPlan.estado === "completado"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {selectedPlan.estado}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Progreso
                    </label>
                    <p className="text-white">{selectedPlan.progreso || 0}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Duración Total
                    </label>
                    <p className="text-white">
                      {selectedPlan.duracionTotal || "No especificado"} días
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Duración Estimada
                    </label>
                    <p className="text-white">
                      {selectedPlan.duracionEstimada || "No especificado"} días
                    </p>
                  </div>
                </div>

                {selectedPlan.observacion && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Observaciones
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedPlan.observacion}
                    </p>
                  </div>
                )}

                {selectedPlan.medicamentos && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Medicamentos
                    </label>
                    <p className="text-white mt-1 bg-slate-700/50 p-3 rounded">
                      {selectedPlan.medicamentos}
                    </p>
                  </div>
                )}

                {selectedPlan.fechaInicio && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Fecha de Inicio
                    </label>
                    <p className="text-white">
                      {new Date(selectedPlan.fechaInicio).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedPlan.fechaFinEstimada && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Fecha Estimada de Finalización
                    </label>
                    <p className="text-white">
                      {new Date(
                        selectedPlan.fechaFinEstimada
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedPlan.tratamientos &&
                  selectedPlan.tratamientos.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Tratamientos del Plan
                      </label>
                      <div className="space-y-2">
                        {selectedPlan.tratamientos.map((tratamiento) => (
                          <div
                            key={tratamiento.idTratamiento}
                            className="bg-slate-700/50 p-3 rounded"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white">
                                {tratamiento.nombre}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  tratamiento.estado === "completado"
                                    ? "bg-green-500/20 text-green-400"
                                    : tratamiento.estado === "en_progreso"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {tratamiento.estado}
                              </span>
                            </div>
                            {tratamiento.fechaProgramada && (
                              <p className="text-sm text-gray-300 mt-1">
                                Programado:{" "}
                                {new Date(
                                  tratamiento.fechaProgramada
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {tratamiento.fechaRealizada && (
                              <p className="text-sm text-gray-300 mt-1">
                                Realizado:{" "}
                                {new Date(
                                  tratamiento.fechaRealizada
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Mi Historial Médico Dental</h1>
        <p className="text-sm opacity-70">
          Consulta tu historial clínico, diagnósticos y planes de tratamiento.
        </p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {/* PESTAÑAS */}
      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("historias")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "historias"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Historias Clínicas
            <span className="ml-2 bg-slate-700/50 text-gray-300 py-0.5 px-2 rounded-full text-xs">
              {historiasClinicas.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("diagnosticos")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "diagnosticos"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Diagnósticos y Tratamientos
            <span className="ml-2 bg-slate-700/50 text-gray-300 py-0.5 px-2 rounded-full text-xs">
              {diagnosticos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("planes")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "planes"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Planes de Tratamiento
            <span className="ml-2 bg-slate-700/50 text-gray-300 py-0.5 px-2 rounded-full text-xs">
              {planesTratamiento.length}
            </span>
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-lg">Cargando tu historial…</div>
        </div>
      ) : (
        <>
          {/* HISTORIAS CLÍNICAS */}
          {activeTab === "historias" && (
            <div className="space-y-4">
              {historiasClinicas.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No tienes historias clínicas registradas.
                </div>
              ) : (
                historiasClinicas.map((historia) => (
                  <div
                    key={historia.idHistoriaClinica}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          Historia Clínica #{historia.idHistoriaClinica}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {historia.motivoConsulta && (
                            <span className="block">
                              Motivo: {historia.motivoConsulta}
                            </span>
                          )}
                          {historia.enfermedadActual && (
                            <span className="block mt-1">
                              Enfermedad: {historia.enfermedadActual}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Creado:{" "}
                          {historia.createdAt
                            ? new Date(historia.createdAt).toLocaleDateString()
                            : "Fecha no disponible"}
                          {historia.odontologo && (
                            <span className="ml-3">
                              Por: Dr. {historia.odontologo.usuario.nombre}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => verDetalleHistoria(historia)}
                        className="ml-4 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* DIAGNÓSTICOS Y TRATAMIENTOS */}
          {activeTab === "diagnosticos" && (
            <div className="space-y-4">
              {diagnosticos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No tienes diagnósticos ni tratamientos registrados.
                </div>
              ) : (
                diagnosticos.map((diagnostico) => (
                  <div
                    key={diagnostico.idTratamiento}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {diagnostico.nombre}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          Precio: Bs. {diagnostico.precio}
                          {diagnostico.diagnosticoCIE && (
                            <span className="block mt-1">
                              CIE: {diagnostico.diagnosticoCIE}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {diagnostico.fecha && (
                            <span>
                              Fecha:{" "}
                              {new Date(diagnostico.fecha).toLocaleDateString()}
                            </span>
                          )}
                          {diagnostico.cita?.estado && (
                            <span className="ml-2 capitalize">
                              Estado: {diagnostico.cita.estado}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => verDetalleDiagnostico(diagnostico)}
                        className="ml-4 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PLANES DE TRATAMIENTO */}
          {activeTab === "planes" && (
            <div className="space-y-4">
              {planesTratamiento.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No tienes planes de tratamiento activos.
                </div>
              ) : (
                planesTratamiento.map((plan) => (
                  <div
                    key={plan.idPlan}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">
                            Plan #{plan.idPlan}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              plan.estado === "activo"
                                ? "bg-green-500/20 text-green-400"
                                : plan.estado === "completado"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {plan.estado}
                          </span>
                        </div>

                        {plan.progreso !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                              <span>Progreso</span>
                              <span>{plan.progreso}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${plan.progreso}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-gray-300 mt-2">
                          {plan.observacion && (
                            <span className="block">
                              Observación: {plan.observacion}
                            </span>
                          )}
                          {plan.duracionTotal && (
                            <span className="block mt-1">
                              Duración total: {plan.duracionTotal} días
                            </span>
                          )}
                        </p>

                        {plan.tratamientos && plan.tratamientos.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400">
                              {
                                plan.tratamientos.filter(
                                  (t) => t.estado === "completado"
                                ).length
                              }{" "}
                              de {plan.tratamientos.length} tratamientos
                              completados
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => verDetallePlan(plan)}
                        className="ml-4 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* MODALES DE DETALLE */}
      {renderDetalleHistoria()}
      {renderDetalleDiagnostico()}
      {renderDetallePlan()}
    </div>
  );
}
