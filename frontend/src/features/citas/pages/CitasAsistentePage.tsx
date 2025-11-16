// src/features/citas/CitasAsistentePage.tsx
import { useEffect, useState } from "react";
//import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { listarCitas, eliminarCita } from "@/features/citas/citas.service";
import { listarOdontologos } from "@/features/personal/personal.service";
import { listarPacientes } from "@/features/pacientes/pacientes.service";
import { listarHace } from "@/features/citas/hace.service";
import ModalEditarCita from "../components/ModalEditarCita";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Paciente = {
  idUsuario_Paciente: number;
  usuario: { ci: string; nombre: string; paterno: string; materno?: string };
};

type Odontologo = {
  idUsuario_Odontologo: number;
  usuario: { nombre: string; paterno: string; materno?: string };
};

type Cita = {
  idCita: number;
  fecha: string;
  hora: string;
  tipoCita: string;
  costo: string;
  estado: string;
  pagado: boolean;
  pacienteNombre?: string;
  odontologoNombre?: string;
  idUsuario_Paciente?: number;
  idUsuario_Odontologo?: number;
};

export default function CitasAsistentePage() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filtroOdontologo, setFiltroOdontologo] = useState("");
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [citaEditar, setCitaEditar] = useState<Cita | null>(null);

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    return isNaN(date.getTime())
      ? "Sin fecha"
      : date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatearHora = (hora: string) => {
    if (!hora) return "Sin hora";
    const time = new Date(hora);
    return isNaN(time.getTime())
      ? "Sin hora"
      : time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const citasRes = await listarCitas();
      const relacionesRes = await listarHace();
      const pacRes = await listarPacientes({ per_page: 100 });
      const odontoRes = await listarOdontologos();

      const citasData = Array.isArray(citasRes) ? citasRes : citasRes?.data ?? [];
      const relacionesData = Array.isArray(relacionesRes) ? relacionesRes: relacionesRes?.data ?? [];
      const pacientesData = Array.isArray(pacRes?.data) ? pacRes.data : pacRes ?? [];
      const odontologosData = Array.isArray(odontoRes?.data) ? odontoRes.data : odontoRes ?? [];

      //console.log("CITAS:", citasData);
      //console.log("relaciones:", relacionesData);
      //console.log("odontologos:", odontologosData);
      //console.log("pacientes:", pacientesData);

      const mapaRelaciones: Record<number, { idUsuario_Paciente: number; idUsuario_Odontologo: number }> = {};
      relacionesData.forEach((rel: any) => {
        if (rel?.idCita) {
          mapaRelaciones[rel.idCita] = {
            idUsuario_Paciente: rel.idUsuario_Paciente,
            idUsuario_Odontologo: rel.idUsuario_Odontologo,
          };
        }
      });
      //console.log("relaciones12222:", relacionesData);

      const mapaPacientes: Record<number, Paciente> = {};
      pacientesData.forEach((p: Paciente) => {
        if (p?.idUsuario_Paciente) mapaPacientes[p.idUsuario_Paciente] = p;
      });

      const mapaOdontologos: Record<number, Odontologo> = {};
      odontologosData.forEach((o: Odontologo) => {
        if (o?.idUsuario_Odontologo) mapaOdontologos[o.idUsuario_Odontologo] = o;
      });

      const citasConDatos: Cita[] = citasData.map((cita: any) => {
      const rel = mapaRelaciones[cita.idCita];
      const paciente = rel ? mapaPacientes[rel.idUsuario_Paciente] : null;
      const odontologo = rel ? mapaOdontologos[rel.idUsuario_Odontologo] : null;

        return {
          ...cita,
          idUsuario_Paciente: rel?.idUsuario_Paciente ?? null,
          idUsuario_Odontologo: rel?.idUsuario_Odontologo ?? null,
          pacienteNombre: paciente
            ? `${paciente.usuario.nombre} ${paciente.usuario.paterno} ${paciente.usuario.materno || ""}`.trim()
            : "Sin paciente",
          odontologoNombre: odontologo
            ? `${odontologo.usuario.nombre} ${odontologo.usuario.paterno} ${odontologo.usuario.materno || ""}`.trim()
            : "Sin odontólogo",
        };
      });

      setCitas(citasConDatos);
      setPacientes(pacientesData);
      setOdontologos(odontologosData);
    } catch (e: any) {
      console.error("Error:", e);
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ELIMINAR :
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    try {
      await eliminarCita(id);
      setCitas((prev) => prev.filter((c) => c.idCita !== id));
      alert("Cita eliminada");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  // TOD_OS LOS FILTROS
  const citasFiltradas = citas.filter((c) => {
    const matchOdonto =
      !filtroOdontologo ||
      c.idUsuario_Odontologo === Number(filtroOdontologo) ||
      c.odontologoNombre?.toLowerCase().includes(filtroOdontologo.toLowerCase());

    const matchPaciente =
      !filtroPaciente ||
      c.idUsuario_Paciente === Number(filtroPaciente) ||
      c.pacienteNombre?.toLowerCase().includes(filtroPaciente.toLowerCase());

    const matchEstado = !filtroEstado || c.estado === filtroEstado;

    return matchOdonto && matchPaciente && matchEstado;
  });

  if (loading) return <p className="text-center p-6 text-lg">Cargando...</p>;



  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-teal-700">Gestión de Citas</h1>
        <button
          onClick={() => navigate("/app/asistente/citas/crear")}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-md"
        >
          <FaPlus /> Nueva Cita
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Odontólogo</label>
          <select
            value={filtroOdontologo}
            onChange={(e) => setFiltroOdontologo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Todos</option>
            {odontologos.map((o) => (
              <option key={o.idUsuario_Odontologo} value={o.idUsuario_Odontologo}>
                {o.usuario.nombre} {o.usuario.paterno}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
          <select
            value={filtroPaciente}
            onChange={(e) => setFiltroPaciente(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Todos</option>
            {pacientes.map((p) => (
              <option key={p.idUsuario_Paciente} value={p.idUsuario_Paciente}>
                {p.usuario.ci} — {p.usuario.nombre} {p.usuario.paterno}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-teal-700 text-white text-left text-sm">
                <th className="p-3 font-semibold">Paciente</th>
                <th className="p-3 font-semibold">Odontólogo</th>
                <th className="p-3 font-semibold">Fecha</th>
                <th className="p-3 font-semibold">Hora</th>
                <th className="p-3 font-semibold">Tipo</th>
                <th className="p-3 font-semibold">Costo</th>
                <th className="p-3 font-semibold">Estado</th>
                <th className="p-3 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No hay citas. Crea relaciones en "hace".
                  </td>
                </tr>
              ) : (
                citasFiltradas.map((cita) => (
                  <tr key={cita.idCita} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-800">{cita.pacienteNombre}</td>
                    <td className="p-3 text-gray-800">{cita.odontologoNombre}</td>
                    <td className="p-3 text-gray-700">{formatearFecha(cita.fecha)}</td>
                    <td className="p-3 text-gray-700">{formatearHora(cita.hora)}</td>
                    <td className="p-3 text-gray-700 capitalize">{cita.tipoCita.toLowerCase()}</td>
                    <td className="p-3 text-gray-800">Bs. {cita.costo}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          cita.estado === "completada"
                            ? "bg-green-100 text-green-800"
                            : cita.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : cita.estado === "confirmada"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setCitaEditar(cita)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleEliminar(cita.idCita)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal EDITAR*/}
      {citaEditar && (
        <ModalEditarCita
          cita={citaEditar}
          onClose={() => setCitaEditar(null)}
          onUpdate={(nueva) => {
            setCitas((prev) => prev.map((c) => (c.idCita === nueva.idCita ? nueva : c)));
            setCitaEditar(null);
            loadData();
          }}
        />
      )}
      
    </div>
  );
}