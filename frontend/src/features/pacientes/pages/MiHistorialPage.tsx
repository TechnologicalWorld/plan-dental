import { useEffect, useState } from "react";
import { fetchHistoriaPorPaciente } from "@/features/pacientes/pacientesHistorial.service";
import { obtenerUsuarioActual } from "@/features/pacientes/pacientes.service";

export default function MiHistoriaClinicaPage() {
  const [paciente, setPaciente] = useState<any>(null);
  const [historia, setHistoria] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;

    (async () => {
      try {
        setLoading(true);

        // Obtener al usuario logueado
        const user = await obtenerUsuarioActual();

        // Obtener su historial clínico
        const { paciente, historia } = await fetchHistoriaPorPaciente(
          user.idUsuario
        );

        if (!live) return;

        setPaciente(paciente);
        setHistoria(historia ?? null);
      } finally {
        if (live) setLoading(false);
      }
    })();

    return () => {
      live = false;
    };
  }, []);

  if (loading) return <div>Cargando…</div>;

  if (!paciente) {
    return (
      <div className="p-4 text-sm opacity-80">
        No se encontró información del paciente.
      </div>
    );
  }

  const u = paciente.usuario ?? {};
  const nombre = [u.nombre, u.paterno, u.materno].filter(Boolean).join(" ");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="bg-white/5 p-4 rounded">
        <h2 className="text-xl font-semibold">{nombre}</h2>
        <div className="text-xs opacity-70">
          CI: {u.ci ?? "-"} · Tel: {u.telefono ?? "-"}
        </div>
      </header>

      {/* Datos personales */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded">
          <h3 className="font-semibold mb-2 text-emerald-300/80">
            Datos personales
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
              <span className="opacity-70">Fecha de ingreso:</span>{" "}
              {paciente.fechaIngreso?.slice(0, 10) ?? "-"}
            </div>
            <div>
              <span className="opacity-70">Código de seguro:</span>{" "}
              {paciente.codigoSeguro ?? "-"}
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded">
          <h3 className="font-semibold mb-2 text-emerald-300/80">
            Signos vitales
          </h3>
          <div className="text-sm whitespace-pre-wrap">
            {historia?.signosVitales ?? "-"}
          </div>
        </div>
      </section>

      {/* Historia Clínica */}
      <section className="bg-white/5 p-4 rounded space-y-4">
        <h3 className="font-semibold text-emerald-300/80">
          Mi historia clínica
        </h3>

        <Item label="Motivo de consulta" value={historia?.motivoConsulta} />
        <Item label="Enfermedad actual" value={historia?.enfermedadActual} />
        <Item
          label="Antecedentes patológicos"
          value={historia?.antecedentesPatologicos}
        />
        <Item
          label="Signos y síntomas dentales"
          value={historia?.descripcionSignosSintomasDentales}
        />
        <Item
          label="Examen clínico bucodental"
          value={historia?.examenClinicoBucoDental}
        />
        <Item label="Observaciones" value={historia?.observaciones} />
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-xs opacity-60">{label}</div>
      <div className="text-sm whitespace-pre-wrap">{value ?? "-"}</div>
    </div>
  );
}
