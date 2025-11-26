import { useEffect, useMemo, useState } from "react";
import { searchPacientes, type PacienteLite } from "../odontograma.service";

export default function PacienteSearchBar({
  value,
  onSelect,
}: {
  value?: number | null;
  onSelect: (paciente: PacienteLite | null) => void;
}) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<PacienteLite[]>([]);
  const [loading, setLoading] = useState(false);

  const debounced = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    let live = true;
    if (!debounced) {
      setRows([]);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const res = await searchPacientes(debounced, 1, 10);
        const list = (res?.data ?? res) as PacienteLite[];
        if (!live) return;
        setRows(list);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [debounced]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="w-full bg-white/5 px-3 py-2 rounded outline-none"
          placeholder="Buscar por nombre o CI…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setQ(q)} // disparar efecto
          className="px-3 py-2 rounded bg-white/10 hover:bg-white/20"
        >
          Buscar
        </button>
      </div>

      {!!rows.length && (
        <div className="bg-white/5 rounded border border-white/10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-white/5">
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">CI</th>
                <th className="px-3 py-2">Teléfono</th>
                <th className="px-3 py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const u = p.usuario ?? {};
                const nombre = [u.nombre, u.paterno, u.materno].filter(Boolean).join(" ");
                return (
                  <tr key={p.idUsuario_Paciente} className="border-b border-white/10">
                    <td className="px-3 py-2">{nombre}</td>
                    <td className="px-3 py-2">{u.ci ?? "-"}</td>
                    <td className="px-3 py-2">{u.telefono ?? "-"}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onSelect(p)}
                        className="px-2 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white"
                      >
                        Elegir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <div className="px-3 py-2 text-xs opacity-70">Buscando…</div>}
        </div>
      )}
    </div>
  );
}
