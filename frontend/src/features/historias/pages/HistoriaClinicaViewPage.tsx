import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchHistoriaPorPaciente,
  fetchOdontogramasPacienteClientSide,
} from "../historias.service";

type Historia = {
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
};

export default function HistoriaClinicaViewPage() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const [historia, setHistoria] = useState<Historia | null>(null);
  const [paciente, setPaciente] = useState<any>(null);
  const [odontogramas, setOdontogramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const [{ paciente, historia }, odons] = await Promise.all([
          fetchHistoriaPorPaciente(pacienteId!),
          fetchOdontogramasPacienteClientSide(pacienteId!),
        ]);
        if (!live) return;
        setPaciente(paciente);
        setHistoria(historia ?? null);
        setOdontogramas(odons ?? []);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [pacienteId]);

  if (loading) return <div>Cargando…</div>;

  if (!paciente) {
    return (
      <div className="space-y-3">
        <div className="text-sm opacity-80">Paciente no encontrado.</div>
        <Link
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
          to="/app/historias"
        >
          Volver
        </Link>
      </div>
    );
  }

  const u = paciente.usuario ?? {};
  const nombre = [u.nombre, u.paterno, u.materno].filter(Boolean).join(" ");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-3 sm:px-0">
      {/* Información principal del paciente + header */}
      <section className="space-y-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">{nombre}</h2>
            <div className="text-xs sm:text-sm opacity-70">
              CI: {u.ci ?? "-"} · Tel: {u.telefono ?? "-"}
            </div>
          </div>
          <Link
            to="/app/historias"
            className="self-start sm:self-auto inline-flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
          >
            Volver a pacientes
          </Link>
        </header>

        {/* Datos personales + signos vitales */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold mb-2 text-emerald-300/80 text-sm sm:text-base">
              Datos personales del paciente
            </h3>
            <div className="text-sm space-y-1 opacity-90">
              <div>
                <span className="opacity-70">Correo:</span> {u.correo ?? "-"}
              </div>
              <div>
                <span className="opacity-70">Dirección:</span>{" "}
                {u.direccion ?? "-"}
              </div>
              <div>
                <span className="opacity-70">Fecha de Ingreso:</span>{" "}
                {paciente.fechaIngreso?.slice(0, 10) ?? "-"}
              </div>
              <div>
                <span className="opacity-70">Código Seguro:</span>{" "}
                {paciente.codigoSeguro ?? "-"}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold mb-2 text-emerald-300/80 text-sm sm:text-base">
              Signos vitales
            </h3>
            <div className="text-sm whitespace-pre-wrap">
              {historia?.signosVitales ?? "-"}
            </div>
          </div>
        </div>

        {/* Historia clínica */}
        <div className="bg-white/5 rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-emerald-300/80 text-sm sm:text-base">
            Historia clínica
          </h3>

          <Item label="Motivo de consulta" value={historia?.motivoConsulta} />
          <Item label="Enfermedad actual" value={historia?.enfermedadActual} />
          <Item
            label="Antecedentes patológicos"
            value={historia?.antecedentesPatologicos}
          />
          <Item
            label="Descripción signos/síntomas dentales"
            value={historia?.descripcionSignosSintomasDentales}
          />
          <Item
            label="Examen clínico bucodental"
            value={historia?.examenClinicoBucoDental}
          />
          <Item label="Observaciones" value={historia?.observaciones} />
        </div>

        {/* Botón editar */}
        <div className="flex justify-end">
          <Link
            to={`/app/historias/${pacienteId}/editar`}
            className="px-4 py-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-sm font-medium"
          >
            Editar historial
          </Link>
        </div>
      </section>

    </div>
  );
}

function Item({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs opacity-60">{label}</div>
      <div className="text-sm whitespace-pre-wrap">{value ?? "-"}</div>
    </div>
  );
}
