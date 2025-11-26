// src/pages/paciente/CitasPacienteCrear.tsx
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import {
  listarOdontologos,
  obtenerOdontologoPorId,
} from "@/features/personal/personal.service";
import {
  crearCita,
  obtenerCita,
} from "@/features/citas/citas.service";
import {
  obtenerHacePorOdontologoYFecha,
  crearHace,
} from "@/features/citas/hace.service";
import { fetchCitasPorPaciente } from "@/features/pacientes/pacientesCitas.service";

import type { Odontologo } from "@/types/odontologo";
import type { Cita } from "@/types/cita";

export default function AgendarCitaPage() {
  const user = useAuthStore((state) => state.user);

  const [pacienteId, setPacienteId] = useState<string>("");
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  // Estado del modal
  const [modalAbierto, setModalAbierto] = useState(false);

  // Campos del formulario
  const [odontologoId, setOdontologoId] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [tipoCita, setTipoCita] = useState<string>("Control");
  const [costo, setCosto] = useState<number>(100); // Precio por defecto 100 Bs

  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loadingCita, setLoadingCita] = useState(false);

  // ==========================
  // 1. OBTENER PACIENTE LOGUEADO
  // ==========================
  useEffect(() => {
    if (!user) return;

    if (user.paciente?.idUsuario_Paciente) {
      setPacienteId(String(user.paciente.idUsuario_Paciente));
    } else if (user.idUsuario_Paciente) {
      setPacienteId(String(user.idUsuario_Paciente));
    } else if (user.idUsuario) {
      setPacienteId(String(user.idUsuario));
    } else {
      alert("No se pudo identificar al paciente. Revisa la estructura del usuario.");
    }
  }, [user]);

  // ==========================
  // 2. CARGAR ODONTÓLOGOS Y CITAS
  // ==========================
  useEffect(() => {
    async function loadOdontologos() {
      try {
        const res = await listarOdontologos();
        setOdontologos(res ?? []);
      } catch (error) {
        console.error("Error cargando odontólogos:", error);
        setOdontologos([]);
      }
    }
    loadOdontologos();
  }, []);

  // Cargar historial de citas del paciente
  const cargarCitas = useCallback(async () => {
    if (!pacienteId) return;
    
    setLoadingCitas(true);
    try {
      const citasData = await fetchCitasPorPaciente(Number(pacienteId));
      console.log("Citas cargadas:", citasData);
      setCitas(citasData);
    } catch (error) {
      console.error("Error cargando citas:", error);
      setCitas([]);
    } finally {
      setLoadingCitas(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    if (pacienteId) {
      cargarCitas();
    }
  }, [pacienteId, cargarCitas]);

  // ==========================
  // 3. UTILIDADES DE HORARIO
  // ==========================
  function parseHorario(horario: string) {
    const regex = /^(\w+) a (\w+) (\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/;
    const match = horario.match(regex);

    if (!match) {
      throw new Error("Formato de horario no válido: " + horario);
    }

    const [, diaInicioStr, diaFinStr, horaInicio, horaFin] = match;

    const mapaDias: Record<string, number> = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Miercoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Sabado: 6,
      Domingo: 7,
    };

    return {
      diaInicio: mapaDias[diaInicioStr],
      diaFin: mapaDias[diaFinStr],
      horaInicio,
      horaFin,
    };
  }

  function obtenerNumeroDia(fechaString: string): number {
    const fecha = new Date(fechaString);
    const dia = fecha.getDay();
    return dia === 0 ? 7 : dia;
  }

  // ==========================
  // 4. CALCULAR HORARIOS DISPONIBLES
  // ==========================
  const calcularHorarios = useCallback(async () => {
    if (!fecha || !odontologoId) {
      setHorariosDisponibles([]);
      setHorariosOcupados([]);
      setHora("");
      return;
    }

    setLoadingHorarios(true);

    try {
      const odontologo = await obtenerOdontologoPorId(Number(odontologoId));
      if (!odontologo || !odontologo.horario) {
        setHorariosDisponibles([]);
        setHorariosOcupados([]);
        return;
      }

      const horarioParseado = parseHorario(odontologo.horario);
      const diaSemana = obtenerNumeroDia(fecha);

      if (
        diaSemana < horarioParseado.diaInicio ||
        diaSemana > horarioParseado.diaFin
      ) {
        setHorariosDisponibles([]);
        setHorariosOcupados([]);
        alert("El odontólogo no trabaja este día según su horario.");
        setHora("");
        setLoadingHorarios(false);
        return;
      }

      const horaInicioNum = parseInt(horarioParseado.horaInicio.split(":")[0]);
      const horaFinNum = parseInt(horarioParseado.horaFin.split(":")[0]);

      const horariosPosibles: string[] = [];
      for (let h = horaInicioNum; h < horaFinNum; h++) {
        horariosPosibles.push(`${h.toString().padStart(2, "0")}:00`);
      }

      const haceList = await obtenerHacePorOdontologoYFecha(
        fecha,
        Number(odontologoId),
      );

      const horasOcupadasPromises = haceList
        .map((h: any) => h.idCita)
        .filter((idCitaId: any) => !!idCitaId)
        .map(async (idCita: number) => {
          const cita = await obtenerCita(idCita);
          return cita?.hora.substring(0, 5);
        });

      const horasOcupadasResueltas = (
        await Promise.all(horasOcupadasPromises)
      ).filter(Boolean) as string[];

      const disponibles = horariosPosibles.filter(
        (h) => !horasOcupadasResueltas.includes(h),
      );

      setHorariosDisponibles(disponibles);
      setHorariosOcupados(horasOcupadasResueltas);

      if (hora && !disponibles.includes(hora)) {
        setHora("");
      }
    } catch (error) {
      console.error("Error al calcular horarios disponibles:", error);
      setHorariosDisponibles([]);
      setHorariosOcupados([]);
      alert("Error al cargar horarios del odontólogo");
    } finally {
      setLoadingHorarios(false);
    }
  }, [fecha, odontologoId, hora]);

  useEffect(() => {
    if (modalAbierto) {
      calcularHorarios();
    }
  }, [calcularHorarios, modalAbierto]);

  // ==========================
  // 5. CREAR CITA
  // ==========================
  const handleCrearCita = async () => {
    if (!pacienteId || !hora || !fecha || !odontologoId) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    setLoadingCita(true);
    try {
      const cita = await crearCita({
        fecha,
        hora,
        estado: "pendiente",
        tipoCita,
        costo,
        pagado: false,
        idUsuario_Paciente: Number(pacienteId),
        idUsuario_Odontologo: Number(odontologoId),
      });

      if (!cita?.idCita) throw new Error("No se creó la cita");

      await crearHace({
        idUsuario_Paciente: Number(pacienteId),
        idCita: cita.idCita,
        idUsuario_Asistente: 16,
        idUsuario_Odontologo: Number(odontologoId),
        fecha,
      } as any);

      alert("Cita creada correctamente");
      
      // Resetear formulario
      setOdontologoId("");
      setFecha("");
      setHora("");
      setTipoCita("Control");
      setCosto(100);
      setHorariosDisponibles([]);
      setHorariosOcupados([]);
      
      // Cerrar modal y recargar citas
      setModalAbierto(false);
      cargarCitas();
    } catch (error: any) {
      console.error(error);
      alert("Error al crear cita: " + (error?.message || error));
    } finally {
      setLoadingCita(false);
    }
  };

  // Función para cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setOdontologoId("");
    setFecha("");
    setHora("");
    setTipoCita("Control");
    setCosto(100);
    setHorariosDisponibles([]);
    setHorariosOcupados([]);
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener color según estado
  const getEstadoColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'pendiente':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'cancelada':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'completada':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  // ==========================
  // 6. RENDER
  // ==========================
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-gray-600">Cargando usuario...</p>
      </div>
    );
  }

  if (!pacienteId) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-red-600">
          No se pudo determinar el paciente. Revisa el objeto de usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Encabezado con diseño moderno */}
        <div className="flex justify-between items-start bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Mis Citas
            </h1>
            <p className="text-slate-300 text-lg">
              {user?.nombre} {user?.paterno}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span className="text-slate-400 text-sm">
                {citas.length} {citas.length === 1 ? 'cita registrada' : 'citas registradas'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agendar nueva cita
            </span>
          </button>
        </div>

        {/* Lista de citas con diseño mejorado */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 border-b border-slate-600/50">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Historial de Citas
            </h2>
          </div>

          <div className="p-6">
            {loadingCitas ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 mt-4">Cargando citas...</p>
              </div>
            ) : citas.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg">No tienes citas registradas</p>
                <p className="text-slate-500">¡Agenda tu primera cita para comenzar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {citas.map((cita, index) => (
                  <div
                    key={cita.idCita}
                    className="group relative bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${getEstadoColor(cita.estado)} shadow-sm`}>
                            {cita.estado}
                          </span>
                          <span className="px-4 py-1.5 bg-slate-600/50 text-cyan-300 rounded-lg text-xs font-medium">
                            {cita.tipoCita}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-slate-200">
                            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{formatearFecha(cita.fecha)}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-200">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{cita.hora}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-slate-200 font-medium">{cita.costo} Bs</span>
                          
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-1 h-20 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agendar cita */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl shadow-teal-500/10 animate-slideUp">
            <div className="p-8 space-y-6">
              {/* Header del modal */}
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Agendar nueva cita
                  </h2>
                  <p className="text-slate-400 mt-1">Complete los datos para su cita</p>
                </div>
                <button
                  onClick={cerrarModal}
                  className="text-slate-400 hover:text-white text-3xl transition-colors hover:rotate-90 transform duration-300"
                >
                  ×
                </button>
              </div>

              {/* Formulario */}
              <div className="space-y-5">
                {/* ODONTÓLOGO */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Odontólogo *
                  </label>
                  <select
                    value={odontologoId}
                    onChange={(e) => {
                      setOdontologoId(e.target.value);
                      setFecha("");
                      setHora("");
                      setHorariosDisponibles([]);
                      setHorariosOcupados([]);
                    }}
                    className="w-full px-4 py-3 border border-slate-600 rounded-xl bg-slate-700/50 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="" className="bg-slate-800">Seleccione odontólogo</option>
                    {odontologos.map((o) => (
                      <option
                        key={o.idUsuario_Odontologo}
                        value={o.idUsuario_Odontologo}
                        className="bg-slate-800"
                      >
                        {o.usuario.nombre} {o.usuario.paterno}
                      </option>
                    ))}
                  </select>
                </div>

                {/* FECHA */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={fecha}
                    onChange={(e) => {
                      setFecha(e.target.value);
                      setHora("");
                    }}
                    className="w-full px-4 py-3 border border-slate-600 rounded-xl bg-slate-700/50 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* HORARIOS */}
                {loadingHorarios ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-slate-400">Cargando horarios...</span>
                  </div>
                ) : horariosDisponibles.length > 0 ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Horarios disponibles *
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {horariosDisponibles.map((h) => {
                        const ocupado = horariosOcupados.includes(h);
                        return (
                          <button
                            key={h}
                            disabled={ocupado}
                            onClick={() => !ocupado && setHora(h)}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform
                              ${
                                ocupado
                                  ? "bg-red-500/10 border border-red-500/30 text-red-400 cursor-not-allowed"
                                  : hora === h
                                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 shadow-lg shadow-teal-500/30 scale-105"
                                    : "bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:border-teal-500/50 hover:scale-105"
                              }
                            `}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : fecha && odontologoId ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-red-400">No hay horarios disponibles para esta fecha.</p>
                  </div>
                ) : null}

                {/* DETALLES CITA */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Tipo de cita
                    </label>
                    <input
                      type="text"
                      value={tipoCita}
                      onChange={(e) => setTipoCita(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-xl bg-slate-700/50 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Costo (Bs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={costo}
                      onChange={(e) => setCosto(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-600 rounded-xl bg-slate-700/50 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6 border-t border-slate-700/50">
                <button
                  onClick={handleCrearCita}
                  disabled={loadingCita || !hora || !pacienteId || !fecha || !odontologoId}
                  className="flex-1 py-3.5 px-6 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105"
                >
                  {loadingCita ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </span>
                  ) : (
                    "Confirmar cita"
                  )}
                </button>

                <button
                  onClick={cerrarModal}
                  className="flex-1 py-3.5 px-6 rounded-xl text-slate-300 font-semibold bg-slate-700 hover:bg-slate-600 transition-all duration-300 hover:scale-105"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}