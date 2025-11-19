import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchHistoriaPorPaciente } from "../historiaClinica.service";
import type { HistoriaClinica, PacienteMin } from "@/types/historia";
import api from "@/shared/api/apiClient";
import { useEditarHistoria } from "../hooks/useEditarHistoria";

function getAuthUserId(): number | null {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token");
    if (token) {
      const payload = token.split(".")[1];
      const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      const id = json?.idUsuario ?? json?.sub ?? json?.user_id;
      if (typeof id === "number") return id;
      if (typeof id === "string" && /^\d+$/.test(id)) return Number(id);
    }
  } catch {}
  return null;
}

async function getOdontologoByUsuario(idUsuario: number) {
  const { data } = await api.get("/odontologos", { params: { per_page: 1000 } });
  const list = (data?.data ?? data) as Array<{
    idUsuario_Odontologo: number;
    usuario?: { idUsuario: number };
  }>;
  return list.find((o) => o?.usuario?.idUsuario === idUsuario) ?? null;
}

export default function HistoriaClinicaEditPage() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const pid = useMemo(() => Number(pacienteId), [pacienteId]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<HistoriaClinica | null>(null);
  const [paciente, setPaciente] = useState<PacienteMin | null>(null);
  const [odontologoId, setOdontologoId] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!pid) { navigate("/app/historias"); return; }
      setLoading(true);
      try {
        const { paciente, historia } = await fetchHistoriaPorPaciente(pid);
        if (!live) return;
        setPaciente(paciente ?? null);
        setInitial(historia ?? null);

        if (historia?.idUsuario_Odontologo) {
          setOdontologoId(historia.idUsuario_Odontologo);
        } else {
          const uid = getAuthUserId();
          if (uid) {
            const od = await getOdontologoByUsuario(uid);
            if (od?.idUsuario_Odontologo) setOdontologoId(od.idUsuario_Odontologo);
          }
        }
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [pid, navigate]);

  const { form, setField, saving, submit } = useEditarHistoria(initial ?? null, pid, odontologoId ?? undefined);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hc = await submit();
    // volver a la vista del paciente
    navigate(`/app/historias/${pid}`, { replace: true });
  }

  if (loading) return <div className="p-4">Cargando…</div>;
  if (!paciente) {
    return (
      <div className="p-4 space-y-3">
        <div>Paciente no encontrado.</div>
        <Link to="/app/historias" className="px-3 py-1.5 rounded bg-white/10">Volver</Link>
      </div>
    );
  }
  if (!odontologoId) {
    return (
      <div className="p-4 space-y-3">
        <div>No se pudo determinar el odontólogo del usuario.</div>
        <Link to={`/app/historias/${pid}`} className="px-3 py-1.5 rounded bg-white/10">Volver</Link>
      </div>
    );
  }

  const u = paciente.usuario;
  const nombre = [u?.nombre, u?.paterno, u?.materno].filter(Boolean).join(" ");

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Editar historia clínica</h2>
          <div className="text-sm opacity-70">{nombre} · CI {u?.ci ?? "-"}</div>
        </div>
        <button
          onClick={() => navigate(`/app/historias/${pid}`)}
          className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20"
        >
          Volver
        </button>
      </header>

      <form onSubmit={onSubmit} className="bg-white/5 rounded-xl p-4 border border-slate-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Motivo de consulta</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.motivoConsulta ?? ""}
              onChange={(e) => setField("motivoConsulta", e.target.value as any)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Signos vitales</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.signosVitales ?? ""}
              onChange={(e) => setField("signosVitales", e.target.value as any)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300">Antecedentes patológicos</label>
          <textarea
            className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 min-h-[72px]"
            value={form.antecedentesPatologicos ?? ""}
            onChange={(e) => setField("antecedentesPatologicos", e.target.value as any)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Examen clínico buco-dental</label>
            <textarea
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 min-h-[96px]"
              value={form.examenClinicoBucoDental ?? ""}
              onChange={(e) => setField("examenClinicoBucoDental", e.target.value as any)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Signos / síntomas dentales</label>
            <textarea
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 min-h-[96px]"
              value={form.descripcionSignosSintomasDentales ?? ""}
              onChange={(e) => setField("descripcionSignosSintomasDentales", e.target.value as any)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Enfermedad actual</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.enfermedadActual ?? ""}
              onChange={(e) => setField("enfermedadActual", e.target.value as any)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Observaciones</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.observaciones ?? ""}
              onChange={(e) => setField("observaciones", e.target.value as any)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/app/historias/${pid}`)}
            className="px-3 py-2 rounded-lg bg-slate-700 text-slate-100"
          >
            Cancelar
          </button>
          <button
            disabled={saving}
            className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
