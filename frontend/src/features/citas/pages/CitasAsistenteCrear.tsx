import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { listarOdontologos ,obtenerOdontologoPorId } from "@/features/personal/personal.service";
import { crearCita  ,obtenerCita} from "@/features/citas/citas.service";
import { crearHace,obtenerHacePorOdontologoYFecha } from "@/features/citas/hace.service";
import { listarPacientes, registrarPaciente } from "@/features/pacientes/pacientes.service";
//import type { Cita } from '@/types/cita';
import type { Odontologo } from '@/types/odontologo';
//import type {Asistente} from '@/types/asistente';
import { FaTimes } from "react-icons/fa";

type Paciente = {
  idUsuario_Paciente: number;
  usuario: {
    ci: string;
    nombre: string;
    paterno?: string;
    materno?: string | null;
  };
};
/*
type Odontologo = {
  idUsuario_Odontologo: number;
  fechaContratacion: string; // 'YYYY-MM-DD'
  horario: string;
  usuario: {
    nombre: string;
    paterno?: string;
    materno?: string | null;
  };
};*/

type FormPaciente = {
  nombre: string;
  paterno: string;
  materno?: string;
  fechaNacimiento?: string;
  genero?: "M" | "F";
  telefono?: string;
  contrasena: string;
  correo: string;
  ci: string;
  codigoSeguro?: string;
  lugarNacimiento?: string;
  domicilio?: string;
  fechaIngreso: string;
  device_name?: string;
};

// Modal 
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center text-gray-700 justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl text-gray-700 w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b text-teal-300">
          <h2 className="text-lg font-semibold text-teal-700">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <FaTimes className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function CitasAsistenteCrear() {
  const user = useAuthStore((state) => state.user);

  const [asistenteId, setAsistenteId] = useState<number | null>(null);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const [odontologoId, setOdontologoId] = useState<string>("");
  const [pacienteId, setPacienteId] = useState<string>("");
  
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [tipoCita, setTipoCita] = useState<string>("Control");
  const [costo, setCosto] = useState<number>(0);

  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  const [loadingCita, setLoadingCita] = useState(false);

  const [searchPaciente, setSearchPaciente] = useState("");
  const [showModalPaciente, setShowModalPaciente] = useState(false);
  const [savingPaciente, setSavingPaciente] = useState(false);

  const [formPaciente, setFormPaciente] = useState<FormPaciente>({
    ci: "",
    nombre: "",
    paterno: "",
    materno: "",
    correo: "",
    telefono: "",
    contrasena: "",
    fechaIngreso: new Date().toISOString().split("T")[0],
    genero: "M",
  });

  // Cargar asistente
  useEffect(() => {
    if (!user) return;

    if (user.asistente?.idUsuario_Asistente) {
      setAsistenteId(user.asistente.idUsuario_Asistente);
    } else {
      alert("Acceso denegado: solo asistentes pueden usar esta página.");
    }
  }, [user]);

  // Cargar odontólogos
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

  // Buscar pacientes
  useEffect(() => {
    if (searchPaciente.length < 2) {
      setPacientes([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await listarPacientes({ search: searchPaciente, per_page: 10 });
        setPacientes(res?.data ?? []);
      } catch (error) {
        console.error("Error buscando pacientes:", error);
        setPacientes([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchPaciente]);

  //SACANDO LOS HORARIOS
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
  return dia === 0 ? 7 : dia; // domingo = 7
}

const calcularHorarios = useCallback(async () => {
  if (!fecha || !odontologoId) {
    setHorariosDisponibles([]);
    setHorariosOcupados([]);
    setHora(""); 
    return;
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
    if (diaSemana < horarioParseado.diaInicio || diaSemana > horarioParseado.diaFin) {
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
    const haceList = await obtenerHacePorOdontologoYFecha(fecha, Number(odontologoId));

    // Obtener solo las horas de citas activas 
    const horasOcupadas = haceList
      .map(h => h.idCita)
      .filter(idCitaId => !!idCitaId) // solo si tiene cita asociada
      .map(async (idCita) => {
        const cita = await obtenerCita(idCita);
        return cita?.hora.substring(0, 5); // "14:30"
      });

    const horasOcupadasResueltas = (await Promise.all(horasOcupadas)).filter(Boolean) as string[];

    // 5. Calcular horarios disponibles
    const disponibles = horariosPosibles.filter(
      hora => !horasOcupadasResueltas.includes(hora)
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


  // Crear paciente
  const handleCrearPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPaciente.ci || !formPaciente.nombre || !formPaciente.correo || !formPaciente.contrasena) {
      alert("CI, nombre, correo y contraseña son obligatorios");
      return;
    }

    setSavingPaciente(true);
    try {
      await registrarPaciente(formPaciente);
      alert("Paciente registrado correctamente");

      // Cerrar modal y limpiar
      setShowModalPaciente(false);
      const ci = formPaciente.ci;
      setFormPaciente({
        ci: "",
        nombre: "",
        paterno: "",
        materno: "",
        correo: "",
        telefono: "",
        contrasena: "",
        fechaIngreso: new Date().toISOString().split("T")[0],
        genero: "M",
      });

      // Buscar el nuevo paciente
      setSearchPaciente(ci);
      const res = await listarPacientes({ search: ci });
      const nuevo = res?.data?.find((p) => p.usuario.ci === ci);
      if (nuevo) {
        setPacienteId(nuevo.idUsuario_Paciente.toString());
      }
    } catch (error: any) {
      alert("Error al crear paciente: " + (error?.response?.data?.message || error?.message || "Desconocido"));
    } finally {
      setSavingPaciente(false);
    }
  };

  // Crear cita 
  const handleCrearCita = async () => {
    if (!pacienteId || !hora || !fecha || !odontologoId || !asistenteId) {
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
        idUsuario_Asistente: asistenteId,
        idUsuario_Odontologo: Number(odontologoId),
        fecha,
      });

      alert("Cita creada correctamente");
      setHora("");
      setTipoCita("Control");
      setCosto(0);
      calcularHorarios();
    } catch (error: any) {
      alert("Error al crear cita: " + (error?.message || error));
    } finally {
      setLoadingCita(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-600">Cargando usuario...</p>
      </div>
    );
  }

  if (asistenteId === null) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-red-600">Acceso denegado: solo asistentes</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-teal-700">Registrar Nueva Cita</h1>

      {/* PACIENTE */}
      <div className="space-y-2 ">
        <label className="block text-sm font-medium">Paciente</label>
        <input
          type="text"
          placeholder="Buscar por CI o nombre"
          value={searchPaciente}
          onChange={(e) => setSearchPaciente(e.target.value)}
          className="w-full px-3 py-2 border rounded-md "
        />

        {pacientes.length > 0 && (
          <select
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-teal-700"
          >
            <option value="">Seleccione paciente</option>
            {pacientes.map((p) => (
              <option key={p.idUsuario_Paciente} value={p.idUsuario_Paciente}>
                {p.usuario.ci} — {p.usuario.nombre} {p.usuario.paterno}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => setShowModalPaciente(true)}
          className="text-teal-600 text-sm underline"
        >
          ¿Paciente nuevo? Registrar
        </button>
      </div>

      {/* ODONTÓLOGO */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Odontólogo</label>
        <select
          value={odontologoId}
          onChange={(e) => setOdontologoId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-teal-700"
        >
          <option value="">Seleccione odontólogo</option>
          {odontologos.map((o) => (
            <option key={o.idUsuario_Odontologo} value={o.idUsuario_Odontologo}>
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
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* HORARIOS */}
      {loadingHorarios ? (
        <p className="text-sm text-gray-800 ">Cargando horarios...</p>
      ) : horariosDisponibles.length > 0 ? (

        <div className="space-y-2">
          <label className="block text-sm  font-medium">Horario disponible</label>
          
          <div className="grid grid-cols-4 gap-2 text-black">
            {horariosDisponibles.map((h) => {
              const ocupado = horariosOcupados.includes(h);

              return (
                <button
                  key={h}
                  disabled={ocupado}
                  onClick={() => !ocupado && setHora(h)}
                  className={`px-3 py-1 rounded text-sm border transition
                    ${ocupado
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
        <p className="text-sm text-red-600">No hay horarios disponibles</p>
      ) : null}

      {/* DETALLES */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Tipo de cita</label>
          <input
            type="text"
            value={tipoCita}
            onChange={(e) => setTipoCita(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Costo (Bs)</label>
          <input
            type="number"
            min="0"
            value={costo}
            onChange={(e) => setCosto(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* GUARDAR  */}
        
      <div className="flex gap-2">
        <button
          onClick={handleCrearCita}
          disabled={loadingCita || !hora || !pacienteId || !fecha || !odontologoId}
          className="flex-1 py-2 px-3 rounded-md text-white text-sm font-medium disabled:opacity-50 bg-teal-600 hover:bg-teal-700 transition"
        >
          {loadingCita ? "Guardando..." : "Crear Cita"}
        </button>

        <button
          onClick={() => window.history.back()}
          className="flex-1 py-2 px-3 rounded-md text-white text-sm font-medium bg-gray-600 hover:bg-gray-700 transition"
        >
          SALIR
        </button>
      </div>

      {/* MODAL*/}
      <Modal
        open={showModalPaciente}
        onClose={() => setShowModalPaciente(false)}
        title="Registrar Nuevo Paciente"
      >
        <form onSubmit={handleCrearPaciente} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="px-3 py-2 rounded border"
              placeholder="CI *"
              value={formPaciente.ci}
              onChange={(e) => setFormPaciente({ ...formPaciente, ci: e.target.value })}
              required
            />
            <input
              className="px-3 py-2 rounded border"
              placeholder="Nombre *"
              value={formPaciente.nombre}
              onChange={(e) => setFormPaciente({ ...formPaciente, nombre: e.target.value })}
              required
            />
            <input
              className="px-3 py-2 rounded border"
              placeholder="Paterno"
              value={formPaciente.paterno}
              onChange={(e) => setFormPaciente({ ...formPaciente, paterno: e.target.value })}
            />
            <input
              className="px-3 py-2 rounded border"
              placeholder="Materno"
              value={formPaciente.materno}
              onChange={(e) => setFormPaciente({ ...formPaciente, materno: e.target.value })}
            />

            <div className="col-span-2">
              <label className="text-xs opacity-80">Fecha de nacimiento</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded border"
                value={formPaciente.fechaNacimiento || ""}
                onChange={(e) => setFormPaciente({ ...formPaciente, fechaNacimiento: e.target.value })}
              />
            </div>

            <select
              className="px-3 py-2 rounded border"
              value={formPaciente.genero}
              onChange={(e) => setFormPaciente({ ...formPaciente, genero: e.target.value as "M" | "F" })}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>

            <input
              className="px-3 py-2 rounded border"
              placeholder="Teléfono"
              value={formPaciente.telefono}
              onChange={(e) => setFormPaciente({ ...formPaciente, telefono: e.target.value })}
            />

            <input
              className="col-span-2 px-3 py-2 rounded border"
              placeholder="Correo *"
              type="email"
              value={formPaciente.correo}
              onChange={(e) => setFormPaciente({ ...formPaciente, correo: e.target.value })}
              required
            />

            <input
              type="password"
              className="col-span-2 px-3 py-2 rounded border"
              placeholder="Contraseña *"
              value={formPaciente.contrasena}
              onChange={(e) => setFormPaciente({ ...formPaciente, contrasena: e.target.value })}
              required
            />

            <input
              className="px-3 py-2 rounded border"
              placeholder="Código de seguro"
              value={formPaciente.codigoSeguro}
              onChange={(e) => setFormPaciente({ ...formPaciente, codigoSeguro: e.target.value })}
            />

            <input
              className="px-3 py-2 rounded border"
              placeholder="Lugar de nacimiento"
              value={formPaciente.lugarNacimiento}
              onChange={(e) => setFormPaciente({ ...formPaciente, lugarNacimiento: e.target.value })}
            />

            <input
              className="col-span-2 px-3 py-2 rounded border"
              placeholder="Domicilio"
              value={formPaciente.domicilio}
              onChange={(e) => setFormPaciente({ ...formPaciente, domicilio: e.target.value })}
            />

            <div className="col-span-2">
              <label className="text-xs opacity-80">Fecha de ingreso</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded border"
                value={formPaciente.fechaIngreso}
                onChange={(e) => setFormPaciente({ ...formPaciente, fechaIngreso: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowModalPaciente(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingPaciente}
              className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition"
            >
              {savingPaciente ? "Guardando..." : "Registrar Paciente"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}