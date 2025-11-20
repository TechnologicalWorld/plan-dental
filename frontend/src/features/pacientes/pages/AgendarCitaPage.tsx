// src/pages/paciente/AgendarCitaPage.tsx
import { useEffect, useState } from "react";
import {
  fetchCitasPorPaciente,
  fetchEspecialidades,
  fetchOdontologosPorEspecialidad,
  fetchAgendaOdontologo,
  agendarCita,
} from "@/features/pacientes/pacientesCitas.service";

import { obtenerUsuarioActual } from "@/features/pacientes/pacientes.service";
import type { Cita } from "@/types/cita";

export default function AgendarCitaPage() {
  const [user, setUser] = useState<any>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [odontologos, setOdontologos] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);

  // Mantener como string, NO number
  const [especialidadSel, setEspecialidadSel] = useState<string>("");
  const [odontologoSel, setOdontologoSel] = useState<string>("");

  const [fechaSel, setFechaSel] = useState("");
  const [horaSel, setHoraSel] = useState("");

  // Cargar usuario y su historial
  useEffect(() => {
    (async () => {
      const u = await obtenerUsuarioActual();
      setUser(u);

      const historialCitas = await fetchCitasPorPaciente(u.idUsuario);
      setCitas(historialCitas);

      const esp = await fetchEspecialidades();
      setEspecialidades(esp);
    })();
  }, []);

  // Al seleccionar especialidad

  useEffect(() => {
    if (!especialidadSel) return;

    (async () => {
      const id = Number(especialidadSel);
      const odons = await fetchOdontologosPorEspecialidad(id);
      setOdontologos(odons);
    })();
  }, [especialidadSel]);

  // Al seleccionar odontólogo

  useEffect(() => {
    if (!odontologoSel) return;

    (async () => {
      const id = Number(odontologoSel);
      const agendaData = await fetchAgendaOdontologo(id);
      setAgenda(agendaData);
    })();
  }, [odontologoSel]);

  const handleAgendar = async () => {
    await agendarCita({
      idUsuario_Paciente: user.idUsuario,
      idUsuario_Odontologo: Number(odontologoSel),
      fecha: fechaSel,
      hora: horaSel,
      tipoCita: especialidadSel,
    });

    alert("Cita agendada correctamente.");
    window.location.reload();
  };

  return (
    <div className="space-y-10">
      {/* HISTORIAL DE CITAS */}
      <section className="bg-white/5 p-5 rounded">
        <h2 className="text-lg font-semibold mb-3">Historial de Citas</h2>

        {citas.length === 0 && <div>No tienes citas registradas.</div>}

        {citas.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="opacity-70">
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Hora</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.idCita} className="border-b border-white/10">
                  <td className="p-2">{cita.fecha}</td>
                  <td className="p-2">{cita.hora}</td>
                  <td className="p-2">{cita.tipoCita}</td>
                  <td className="p-2">{cita.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* AGENDAR CITA */}
      <section className="bg-white/5 p-5 rounded space-y-5">
        <h2 className="text-lg font-semibold">Agendar Cita</h2>

        {/* Especialidad */}
        <div>
          <label className="text-sm opacity-70">Especialidad</label>
          <select
            className="w-full p-2 bg-white/10 rounded"
            value={especialidadSel}
            onChange={(e) => setEspecialidadSel(e.target.value)}
          >
            <option value="">Seleccione una especialidad</option>
            {especialidades.map((esp) => (
              <option
                key={esp.idEspecialidad}
                value={String(esp.idEspecialidad)}
              >
                {esp.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Odontólogo */}
        {especialidadSel && (
          <div>
            <label className="text-sm opacity-70">Odontólogo</label>
            <select
              className="w-full p-2 bg-white/10 rounded"
              value={odontologoSel}
              onChange={(e) => setOdontologoSel(e.target.value)}
            >
              <option value="">Seleccione un odontólogo</option>
              {odontologos.map((o) => (
                <option
                  key={o.idUsuario_Odontologo}
                  value={String(o.idUsuario_Odontologo)}
                >
                  {o.usuario.nombre} {o.usuario.paterno}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Agenda / Calendario */}
        {odontologoSel && (
          <div>
            <h3 className="font-semibold mb-2">Disponibilidad</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {agenda.map((dia: any) => (
                <button
                  key={dia.fecha}
                  className={`p-2 rounded ${
                    fechaSel === dia.fecha ? "bg-emerald-600" : "bg-white/10"
                  }`}
                  onClick={() => {
                    setFechaSel(dia.fecha);
                    setHoraSel("");
                  }}
                >
                  {dia.fecha}
                </button>
              ))}
            </div>

            {fechaSel && (
              <div className="mt-3">
                <div className="font-semibold opacity-80">
                  Horas disponibles
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {agenda
                    .find((d) => d.fecha === fechaSel)
                    ?.horas.map((h: string) => (
                      <button
                        key={h}
                        className={`px-3 py-1 rounded ${
                          h === horaSel ? "bg-emerald-500" : "bg-white/10"
                        }`}
                        onClick={() => setHoraSel(h)}
                      >
                        {h}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {horaSel && (
          <button
            onClick={handleAgendar}
            className="px-4 py-2 bg-emerald-600 rounded"
          >
            Confirmar Cita
          </button>
        )}
      </section>
    </div>
  );
}
