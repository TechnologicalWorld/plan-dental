import { useEffect, useMemo, useState } from "react";
import { getTratamientos, deleteTratamiento, Tratamiento } from "../tratamientos.service";
import { TratamientoFormModal } from "./TratamientoFormModal";

function BOB(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(v)) return "—";
  return `Bs. ${v.toFixed(2)}`;
}

export default function TratamientosTable() {
  const [rows, setRows] = useState<Tratamiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tratamiento | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTratamientos();
      setRows(data);
    } catch (e: any) {
      setError("No se pudieron cargar los tratamientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const onCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const onEdit = (row: Tratamiento) => {
    setEditing(row);
    setOpen(true);
  };

  const onDelete = async (row: Tratamiento) => {
    if (!confirm(`¿Eliminar "${row.nombre}"?`)) return;
    await deleteTratamiento(row.idTratamiento);
    fetchRows();
  };

  const theadClasses =
    "bg-slate-800 text-slate-200 uppercase text-xs tracking-wider sticky top-0 z-10";
  const cellHead = "px-3 py-2 font-semibold";
  const cell = "px-3 py-3 align-middle";

  const items = useMemo(() => rows, [rows]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">Tratamientos</h1>
        <button
          onClick={onCreate}
          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
        >
          Nuevo
        </button>
      </div>

      <div className="overflow-auto rounded-xl border border-slate-700">
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
            {loading && (
              <tr>
                <td className={cell} colSpan={6}>Cargando…</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td className={cell} colSpan={6} style={{ color: "#f87171" }}>
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td className={cell} colSpan={6}>Sin datos</td>
              </tr>
            )}
            {items.map((t, idx) => {
              const cita = t.cita;
              const paciente =
                cita?.pacientes?.[0]?.usuario
                  ? `${cita.pacientes[0].usuario.nombre} ${cita.pacientes[0].usuario.paterno || ""}`.trim()
                  : "—";
              const citaTxt = cita
                ? `${(cita.fecha ?? "").slice(0,10)} — ${cita.tipoCita ?? ""}`
                : "—";

              return (
                <tr key={t.idTratamiento} className="hover:bg-slate-800/30">
                  <td className={cell}>{idx + 1}</td>
                  <td className={cell}>{t.nombre}</td>
                  <td className={cell}>{BOB(t.precio)}</td>
                  <td className={cell}>{citaTxt}</td>
                  <td className={cell}>{paciente}</td>
                  <td className={cell}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(t)}
                        className="px-3 py-1 rounded-lg border border-slate-600 hover:bg-slate-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        className="px-3 py-1 rounded-lg border border-rose-600 text-rose-300 hover:bg-rose-600/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TratamientoFormModal
        open={open}
        initialData={editing || undefined}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          fetchRows();
        }}
      />
    </div>
  );
}
