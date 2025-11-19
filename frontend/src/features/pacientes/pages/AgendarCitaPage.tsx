// features/pacientes/pages/AgendarCitaPage.tsx
import { useEffect, useState } from "react";
import {
  obtenerEspecialidades,
  obtenerOdontologosPorEspecialidad,
  obtenerTodosOdontologos,
  obtenerHorariosDisponibles,
  obtenerMisCitas,
  agendarCita,
  cancelarCita,
  type Especialidad,
  type Odontologo,
  type HorarioDisponible,
  type CitaFormData,
  type Cita,
} from "@/features/pacientes/pacientes.service";

export default function AgendarCitaPage() {
  // Estados para el formulario de agendar cita
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<
    HorarioDisponible[]
  >([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  // Estados para el formulario
  const [formData, setFormData] = useState<CitaFormData>({
    fecha: "",
    hora: "",
    tipoCita: "",
    idEspecialidad: 0,
    idUsuario_Odontologo: undefined,
    observaciones: "",
  });

  // Estados para las citas existentes
  const [misCitas, setMisCitas] = useState<Cita[]>([]);
  const [cargandoCitas, setCargandoCitas] = useState(false);
  const [enviandoCita, setEnviandoCita] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

  // ===== CARGAR DATOS INICIALES =====
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  async function cargarDatosIniciales() {
    try {
      setCargandoCitas(true);
      const [especialidadesData, citasData] = await Promise.all([
        obtenerEspecialidades(),
        obtenerMisCitas(),
      ]);

      setEspecialidades(especialidadesData);
      setMisCitas(citasData);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al cargar los datos iniciales",
      });
    } finally {
      setCargandoCitas(false);
    }
  }

  // ===== CUANDO CAMBIA LA ESPECIALIDAD =====
  useEffect(() => {
    if (formData.idEspecialidad > 0) {
      cargarOdontologosPorEspecialidad(formData.idEspecialidad);
    } else {
      cargarTodosOdontologos();
    }
  }, [formData.idEspecialidad]);

  async function cargarOdontologosPorEspecialidad(idEspecialidad: number) {
    try {
      const odontologosData = await obtenerOdontologosPorEspecialidad(
        idEspecialidad
      );
      setOdontologos(odontologosData);
    } catch (error) {
      console.error("Error cargando odontólogos:", error);
      setMensaje({ tipo: "error", texto: "Error al cargar los odontólogos" });
    }
  }

  async function cargarTodosOdontologos() {
    try {
      const odontologosData = await obtenerTodosOdontologos();
      setOdontologos(odontologosData);
    } catch (error) {
      console.error("Error cargando odontólogos:", error);
    }
  }

  // ===== CUANDO CAMBIA LA FECHA U ODONTÓLOGO =====
  useEffect(() => {
    if (formData.fecha) {
      cargarHorariosDisponibles();
    }
  }, [formData.fecha, formData.idUsuario_Odontologo]);

  async function cargarHorariosDisponibles() {
    if (!formData.fecha) return;

    setCargandoHorarios(true);
    try {
      const horarios = await obtenerHorariosDisponibles(
        formData.fecha,
        formData.idUsuario_Odontologo
      );
      setHorariosDisponibles(horarios);
    } catch (error) {
      console.error("Error cargando horarios:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al cargar los horarios disponibles",
      });
    } finally {
      setCargandoHorarios(false);
    }
  }

  // ===== MANEJAR CAMBIOS EN EL FORMULARIO =====
  const handleInputChange = (field: keyof CitaFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar mensajes cuando el usuario interactúa
    if (mensaje) {
      setMensaje(null);
    }
  };

  // ===== ENVIAR FORMULARIO DE CITA =====
  const handleAgendarCita = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (
      !formData.fecha ||
      !formData.hora ||
      !formData.tipoCita ||
      !formData.idEspecialidad
    ) {
      setMensaje({
        tipo: "error",
        texto: "Por favor complete todos los campos obligatorios",
      });
      return;
    }

    setEnviandoCita(true);
    try {
      await agendarCita(formData);

      setMensaje({ tipo: "exito", texto: "¡Cita agendada exitosamente!" });

      // Limpiar formulario
      setFormData({
        fecha: "",
        hora: "",
        tipoCita: "",
        idEspecialidad: 0,
        idUsuario_Odontologo: undefined,
        observaciones: "",
      });

      setHorariosDisponibles([]);

      // Recargar lista de citas
      const citasActualizadas = await obtenerMisCitas();
      setMisCitas(citasActualizadas);
    } catch (error: any) {
      console.error("Error agendando cita:", error);
      const errorMsg =
        error?.response?.data?.message || "Error al agendar la cita";
      setMensaje({ tipo: "error", texto: errorMsg });
    } finally {
      setEnviandoCita(false);
    }
  };

  // ===== CANCELAR CITA =====
  const handleCancelarCita = async (idCita: number) => {
    if (!confirm("¿Está seguro de que desea cancelar esta cita?")) {
      return;
    }

    try {
      await cancelarCita(idCita);
      setMensaje({ tipo: "exito", texto: "Cita cancelada exitosamente" });

      // Recargar lista de citas
      const citasActualizadas = await obtenerMisCitas();
      setMisCitas(citasActualizadas);
    } catch (error: any) {
      console.error("Error cancelando cita:", error);
      const errorMsg =
        error?.response?.data?.message || "Error al cancelar la cita";
      setMensaje({ tipo: "error", texto: errorMsg });
    }
  };

  // ===== OBTENER COLOR DEL ESTADO =====
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-400";
      case "confirmada":
        return "bg-blue-500/20 text-blue-400";
      case "completada":
        return "bg-green-500/20 text-green-400";
      case "cancelada":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Agendar Cita</h1>
        <p className="text-sm opacity-70">
          Programa tu cita dental seleccionando especialidad, odontólogo y
          horario disponible.
        </p>
      </header>

      {mensaje && (
        <div
          className={`p-4 rounded-lg ${
            mensaje.tipo === "exito"
              ? "bg-green-500/10 border border-green-500/50 text-green-400"
              : "bg-red-500/10 border border-red-500/50 text-red-400"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* FORMULARIO PARA AGENDAR CITA */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Nueva Cita</h2>

            <form onSubmit={handleAgendarCita} className="space-y-4">
              {/* ESPECIALIDAD */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Especialidad <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.idEspecialidad}
                  onChange={(e) =>
                    handleInputChange(
                      "idEspecialidad",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                  required
                >
                  <option value={0}>Seleccione una especialidad</option>
                  {especialidades.map((especialidad) => (
                    <option
                      key={especialidad.idEspecialidad}
                      value={especialidad.idEspecialidad}
                    >
                      {especialidad.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* ODONTÓLOGO (OPCIONAL) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Odontólogo (opcional)
                </label>
                <select
                  value={formData.idUsuario_Odontologo || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "idUsuario_Odontologo",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Seleccione un odontólogo (opcional)</option>
                  {odontologos.map((odontologo) => (
                    <option
                      key={odontologo.idUsuario_Odontologo}
                      value={odontologo.idUsuario_Odontologo}
                    >
                      Dr. {odontologo.usuario.nombre}{" "}
                      {odontologo.usuario.paterno || ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIPO DE CITA */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Cita <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.tipoCita}
                  onChange={(e) =>
                    handleInputChange("tipoCita", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                  required
                >
                  <option value="">Seleccione el tipo de cita</option>
                  <option value="consulta">Consulta General</option>
                  <option value="limpieza">Limpieza Dental</option>
                  <option value="ortodoncia">Ortodoncia</option>
                  <option value="endodoncia">Endodoncia</option>
                  <option value="periodoncia">Periodoncia</option>
                  <option value="cirugia">Cirugía Dental</option>
                  <option value="emergencia">Emergencia</option>
                </select>
              </div>

              {/* FECHA */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* HORA */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Hora <span className="text-red-400">*</span>
                </label>
                {cargandoHorarios ? (
                  <div className="text-center py-4 text-gray-400">
                    Cargando horarios disponibles...
                  </div>
                ) : formData.fecha && horariosDisponibles.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {horariosDisponibles.map((horario) => (
                      <button
                        key={horario.hora}
                        type="button"
                        onClick={() => handleInputChange("hora", horario.hora)}
                        disabled={!horario.disponible}
                        className={`p-2 rounded text-sm font-medium ${
                          formData.hora === horario.hora
                            ? "bg-teal-600 text-white"
                            : horario.disponible
                            ? "bg-slate-700/50 text-white hover:bg-slate-600/50"
                            : "bg-red-500/20 text-red-400 cursor-not-allowed"
                        }`}
                      >
                        {horario.hora}
                      </button>
                    ))}
                  </div>
                ) : formData.fecha ? (
                  <div className="text-center py-4 text-gray-400">
                    No hay horarios disponibles para esta fecha
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    Seleccione una fecha para ver los horarios disponibles
                  </div>
                )}
              </div>

              {/* OBSERVACIONES */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) =>
                    handleInputChange("observaciones", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Describa el motivo de su consulta o alguna observación importante..."
                />
              </div>

              {/* BOTÓN ENVIAR */}
              <button
                type="submit"
                disabled={enviandoCita}
                className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviandoCita ? "Agendando cita..." : "Agendar Cita"}
              </button>
            </form>
          </div>
        </div>

        {/* HISTORIAL DE CITAS */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Mis Citas</h2>

            {cargandoCitas ? (
              <div className="text-center py-8">Cargando citas...</div>
            ) : misCitas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No tienes citas agendadas
              </div>
            ) : (
              <div className="space-y-4">
                {misCitas.map((cita) => (
                  <div
                    key={cita.idCita}
                    className="bg-slate-800/50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">
                            {new Date(cita.fecha).toLocaleDateString()} -{" "}
                            {cita.hora?.slice(0, 5)}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                              cita.estado
                            )}`}
                          >
                            {cita.estado}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300">
                          <strong>Tipo:</strong> {cita.tipoCita}
                        </p>

                        {cita.odontologos && cita.odontologos.length > 0 && (
                          <p className="text-sm text-gray-300">
                            <strong>Odontólogo:</strong> Dr.{" "}
                            {cita.odontologos[0].usuario?.nombre}{" "}
                            {cita.odontologos[0].usuario?.paterno}
                          </p>
                        )}

                        {cita.costo && (
                          <p className="text-sm text-gray-300">
                            <strong>Costo:</strong> Bs.{" "}
                            {typeof cita.costo === "string"
                              ? parseFloat(cita.costo).toFixed(2)
                              : cita.costo.toFixed(2)}
                          </p>
                        )}

                        {cita.tratamientos && cita.tratamientos.length > 0 && (
                          <p className="text-sm text-gray-300">
                            <strong>Tratamientos:</strong>{" "}
                            {cita.tratamientos.map((t) => t.nombre).join(", ")}
                          </p>
                        )}
                      </div>

                      {cita.estado.toLowerCase() === "pendiente" && (
                        <button
                          onClick={() => handleCancelarCita(cita.idCita)}
                          className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
