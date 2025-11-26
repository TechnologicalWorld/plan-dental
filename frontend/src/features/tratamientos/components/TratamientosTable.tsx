import { useMemo, useState } from "react";
import type { Tratamiento } from "@/types/tratamiento";
import { Pencil, Trash2, Plus } from "lucide-react";

type Props = {
  rows: Tratamiento[];
  loading?: boolean;
  error?: string | null;
  onNew: () => void;
  onEdit: (row: Tratamiento) => void;
  onDelete: (row: Tratamiento) => void;
};

function BOB(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(v)) return "—";
  return `Bs. ${v.toFixed(2)}`;
}

export default function TratamientosTable({
  rows,
  loading,
  error,
  onNew,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((t) => {
      const cita = t.cita;
      const paciente =
        cita?.pacientes?.[0]?.usuario
          ? `${cita.pacientes[0].usuario.nombre} ${
              cita.pacientes[0].usuario.paterno || ""
            }`.trim()
          : "";
      const citaTxt = cita
        ? `${(cita.fecha ?? "").slice(0, 10)} — ${cita.tipoCita ?? ""}`
        : "";

      return [
        t.nombre,
        String(t.precio),
        citaTxt,
        paciente,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, search]);

  const theadClasses =
    "bg-slate-900/80 text-slate-200 uppercase text-xs tracking-wider sticky top-0 z-10";
  const cellHead = "px-3 py-2 font-semibold";
  const cell = "px-3 py-3 align-middle text-slate-100";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Tratamientos
          </h1>
          <p className="text-sm text-slate-400">
            Lista de tratamientos asociados a citas de pacientes.
          </p>
        </div>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Nuevo tratamiento
        </button>
      </div>

      {/* Buscador */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Buscar por nombre, paciente o tipo de cita…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && (
          <span className="text-sm text-slate-400">Cargando…</span>
        )}
        {error && !loading && (
          <span className="text-sm text-rose-400">{error}</span>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-xl border border-slate-700 bg-slate-900/40">
        <table className="min-w-[900px] w-full text-sm">
          <thead className={theadClasses}>
            <tr>
              <th className={cellHead}>#</th>
              <th className={cellHead}>Nombre</th>
              <th className={cellHead}>Precio</th>
              <th className={cellHead}>Cita</th>
              <th className={cellHead}>Paciente</th>
              <th className={cellHead}>Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {items.length === 0 && !loading && !error && (
              <tr>
                <td className="px-3 py-4 text-slate-400" colSpan={6}>
                  Sin datos.
                </td>
              </tr>
            )}

            {items.map((t, idx) => {
              const cita = t.cita;
              const paciente =
                cita?.pacientes?.[0]?.usuario
                  ? `${cita.pacientes[0].usuario.nombre} ${
                      cita.pacientes[0].usuario.paterno || ""
                    }`.trim()
                  : "—";
              const citaTxt = cita
                ? `${(cita.fecha ?? "").slice(0, 10)} — ${
                    cita.tipoCita ?? ""
                  }`
                : "—";

              return (
                <tr
                  key={t.idTratamiento}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className={cell}>{idx + 1}</td>
                  <td className={cell}>{t.nombre}</td>
                  <td className={cell}>{BOB(t.precio)}</td>
                  <td className={cell}>{citaTxt}</td>
                  <td className={cell}>{paciente}</td>
                  <td className={cell}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(t)}
                        title="Editar"
                        className="p-1.5 rounded-full border border-slate-600 hover:bg-slate-700 text-slate-100"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        title="Eliminar"
                        className="p-1.5 rounded-full border border-rose-600 text-rose-300 hover:bg-rose-600/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
