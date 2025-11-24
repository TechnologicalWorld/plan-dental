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

import type { Odontologo } from "@/types/odontologo";

export default function AgendarCitaPage() {
  const user = useAuthStore((state) => state.user);

  const [pacienteId, setPacienteId] = useState<string>("");
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);

  const [odontologoId, setOdontologoId] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [tipoCita, setTipoCita] = useState<string>("Control");
  const [costo, setCosto] = useState<number>(0);

  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loadingCita, setLoadingCita] = useState(false);

  // ==========================
  // 1. OBTENER PACIENTE LOGUEADO
  // ==========================
  useEffect(() => {
    if (!user) return;

    // Ajusta esto según cómo venga tu user:
    // Ejemplos posibles:
    // - user.paciente.idUsuario_Paciente
    // - user.idUsuario_Paciente
    // - user.idUsuario
    if (user.paciente?.idUsuario_Paciente) {
      setPacienteId(String(user.paciente.idUsuario_Paciente));
    } else if (user.idUsuario_Paciente) {
      setPacienteId(String(user.idUsuario_Paciente));
    } else if (user.idUsuario) {
      // fallback si el backend usa el idUsuario directamente
      setPacienteId(String(user.idUsuario));
    } else {
      alert("No se pudo identificar al paciente. Revisa la estructura del usuario.");
    }
  }, [user]);

  // ==========================
  // 2. CARGAR ODONTÓLOGOS
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

  // ==========================
  // 3. UTILIDADES DE HORARIO
  // ==========================
  function parseHorario(horario: string) {
    // Ejemplo esperado: "Lunes a Viernes 8:00-16:00"
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
    const dia = fecha.getDay(); // 0 = domingo, 1 = lunes...
    return dia === 0 ? 7 : dia; // domingo -> 7
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
      // 1. Obtener odontólogo seleccionado
      const odontologo = await obtenerOdontologoPorId(Number(odontologoId));
      if (!odontologo || !odontologo.horario) {
        setHorariosDisponibles([]);
        setHorariosOcupados([]);
        return;
      }

      // 2. Parsear horario del odontólogo: "Lunes a Viernes 8:00-16:00"
      const horarioParseado = parseHorario(odontologo.horario);
      const diaSemana = obtenerNumeroDia(fecha); // 1=Lunes ... 7=Domingo

      // Validar si el odontólogo trabaja ese día
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

      // 3. Generar horarios posibles según rango
      const horaInicioNum = parseInt(horarioParseado.horaInicio.split(":")[0]);
      const horaFinNum = parseInt(horarioParseado.horaFin.split(":")[0]);

      const horariosPosibles: string[] = [];
      for (let h = horaInicioNum; h < horaFinNum; h++) {
        horariosPosibles.push(`${h.toString().padStart(2, "0")}:00`);
      }

      // 4. Obtener citas ocupadas del odontólogo en esa fecha
      const haceList = await obtenerHacePorOdontologoYFecha(
        fecha,
        Number(odontologoId),
      );

      // Obtener solo las horas de citas activas
      const horasOcupadasPromises = haceList
        .map((h: any) => h.idCita)
        .filter((idCitaId: any) => !!idCitaId)
        .map(async (idCita: number) => {
          const cita = await obtenerCita(idCita);
          return cita?.hora.substring(0, 5); // "14:30" -> "14:30"
        });

      const horasOcupadasResueltas = (
        await Promise.all(horasOcupadasPromises)
      ).filter(Boolean) as string[];

      // 5. Calcular horarios disponibles
      const disponibles = horariosPosibles.filter(
        (h) => !horasOcupadasResueltas.includes(h),
      );

      setHorariosDisponibles(disponibles);
      setHorariosOcupados(horasOcupadasResueltas);

      // Si la hora actualmente seleccionada ya no está disponible, limpiarla
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
    calcularHorarios();
  }, [calcularHorarios]);

  // ==========================
  // 5. CREAR CITA (PACIENTE)
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

      // Si tu backend requiere también registrar en 'hace', puedes hacerlo así:
      // (Asumiendo que idUsuario_Asistente puede ser opcional o null en el backend)
      await crearHace({
        idUsuario_Paciente: Number(pacienteId),
        idCita: cita.idCita,
        idUsuario_Asistente: 16, 
        idUsuario_Odontologo: Number(odontologoId),
        fecha,
      } as any);

      alert("Cita creada correctamente");
      setHora("");
      setTipoCita("Control");
      setCosto(0);
      calcularHorarios();
    } catch (error: any) {
      console.error(error);
      alert("Error al crear cita: " + (error?.message || error));
    } finally {
      setLoadingCita(false);
    }
  };

  // ==========================
  // 6. RENDER
  // ==========================
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-600">Cargando usuario...</p>
      </div>
    );
  }

  if (!pacienteId) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-red-600">
          No se pudo determinar el paciente. Revisa el objeto de usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-teal-700">
        Agendar nueva cita
      </h1>

      {/* Info básica paciente (opcional) */}
      <div className="p-4 rounded-md bg-teal-50 text-sm text-gray-700">
        <div>
          <span className="font-semibold">Paciente:</span>{" "}
          {user?.nombre} {user?.paterno}
        </div>
        <div>
          <span className="font-semibold">ID Paciente:</span> {pacienteId}
        </div>
      </div>

      {/* ODONTÓLOGO */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Odontólogo</label>
        <select
          value={odontologoId}
          onChange={(e) => {
            setOdontologoId(e.target.value);
            setFecha("");
            setHora("");
            setHorariosDisponibles([]);
            setHorariosOcupados([]);
          }}
          className="w-full px-3 py-2 border rounded-md bg-white text-gray-800"
        >
          <option value="">Seleccione odontólogo</option>
          {odontologos.map((o) => (
            <option
              key={o.idUsuario_Odontologo}
              value={o.idUsuario_Odontologo}
            >
              {o.usuario.nombre} {o.usuario.paterno}
            </option>
          ))}
        </select>
      </div>

      {/* FECHA */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Fecha</label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setHora("");
          }}
          className="w-full px-3 py-2 border rounded-md text-gray-800"
        />
      </div>

      {/* HORARIOS */}
      {loadingHorarios ? (
        <p className="text-sm text-gray-800">Cargando horarios...</p>
      ) : horariosDisponibles.length > 0 ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Horarios disponibles
          </label>

          <div className="grid grid-cols-4 gap-2 text-black">
            {horariosDisponibles.map((h) => {
              const ocupado = horariosOcupados.includes(h);

              return (
                <button
                  key={h}
                  disabled={ocupado}
                  onClick={() => !ocupado && setHora(h)}
                  className={`px-3 py-1 rounded text-sm border transition
                    ${
                      ocupado
                        ? "bg-red-300 border-red-500 text-red-900 cursor-not-allowed"
                        : hora === h
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white border-gray-300 hover:bg-gray-100"
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
        <p className="text-sm text-red-600">
          No hay horarios disponibles para esta fecha.
        </p>
      ) : null}

      {/* DETALLES CITA */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Tipo de cita</label>
          <input
            type="text"
            value={tipoCita}
            onChange={(e) => setTipoCita(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Costo (Bs)</label>
          <input
            type="number"
            min="0"
            value={costo}
            onChange={(e) => setCosto(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-gray-800"
          />
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex gap-2">
        <button
          onClick={handleCrearCita}
          disabled={loadingCita || !hora || !pacienteId || !fecha || !odontologoId}
          className="flex-1 py-2 px-3 rounded-md text-white text-sm font-medium disabled:opacity-50 bg-teal-600 hover:bg-teal-700 transition"
        >
          {loadingCita ? "Guardando..." : "Confirmar cita"}
        </button>

        <button
          onClick={() => window.history.back()}
          className="flex-1 py-2 px-3 rounded-md text-white text-sm font-medium bg-gray-600 hover:bg-gray-700 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
