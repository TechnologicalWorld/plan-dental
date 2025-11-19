import { useEffect, useMemo, useState } from "react";
import api from "@/shared/api/apiClient";
import type { PacienteLite } from "@/features/odonto-pacientes/odontoPacientes.service";
import BuscarPacienteResultsHC from "../components/BuscarPacienteResultsHC";

async function fetchPacientesLite(params: { page: number; q?: string }) {
  const { page, q } = params;
  const { data } = await api.get("/pacientes", { params: { page } });
  const raw = Array.isArray(data?.data) ? data.data : [];

  let rows: PacienteLite[] = raw.map((p: any) => ({
    idUsuario_Paciente: p.idUsuario_Paciente,
    nombre: p.usuario?.nombre ?? "",
    paterno: p.usuario?.paterno ?? "",
    materno: p.usuario?.materno ?? "",
    ci: p.usuario?.ci ?? "",
    telefono: p.usuario?.telefono ?? "",
    correo: p.usuario?.correo ?? "",
  }));

  if (q && q.trim()) {
    const qn = q.trim().toLowerCase();
    rows = rows.filter((r) => {
      const full = [r.nombre, r.paterno, r.materno].filter(Boolean).join(" ").toLowerCase();
      return full.includes(qn) || (r.ci ?? "").toLowerCase().includes(qn);
    });
  }

  return {
    rows,
    lastPage: data?.last_page ?? 1,
    total: data?.total ?? rows.length,
  };
}

export default function HistoriasListPage() {
  const [rows, setRows] = useState<PacienteLite[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => ({ page, q }), [page, q]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPacientesLite(params);
        if (!mounted) return;
        setRows(res.rows);
        setLastPage(res.lastPage);
        setTotal(res.total);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Buscar por nombre o CI..."
          className="w-full bg-white/5 px-3 py-2 rounded outline-none"
        />
      </div>

      <BuscarPacienteResultsHC
        rows={rows}
        page={page}
        lastPage={lastPage}
        total={total}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(lastPage, p + 1))}
        loading={loading}
      />
    </div>
  );
}
