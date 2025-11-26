import { useEffect, useMemo, useState } from "react";
import {
  listarEspecialidades,
  crearEspecialidad,
  actualizarEspecialidad,
  eliminarEspecialidad,
} from "@/features/personal/personal.service";
import type { Especialidad } from "@/types/especialidad";
import { Pencil, Trash2, Plus } from "lucide-react";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import Modal from "@/shared/ui/Modal";

export default function EspecialidadesAdminPage() {
  const [items, setItems] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  // crear/editar
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Especialidad | null>(null);
  const [form, setForm] = useState<{ nombre: string; descripcion?: string }>({
    nombre: "",
    descripcion: "",
  });
  const [saving, setSaving] = useState(false);

  // eliminar
  const [openDel, setOpenDel] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await listarEspecialidades();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const anyOpen = openEdit || openDel;
    if (anyOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openEdit, openDel]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      [it.nombre, it.descripcion]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [items, q]);

  function openNew() {
    setEditing(null);
    setForm({ nombre: "", descripcion: "" });
    setOpenEdit(true);
  }

  function openUpdate(it: Especialidad) {
    setEditing(it);
    setForm({ nombre: it.nombre ?? "", descripcion: it.descripcion ?? "" });
    setOpenEdit(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre?.trim()) return;

    setSaving(true);
    try {
      if (editing) {
        await actualizarEspecialidad(editing.idEspecialidad, form);
      } else {
        await crearEspecialidad(form);
      }
      setOpenEdit(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  function askDelete(id: number) {
    setDelId(id);
    setOpenDel(true);
  }

  async function confirmDelete() {
    if (!delId) return;
    await eliminarEspecialidad(delId);
    setOpenDel(false);
    setDelId(null);
    await load();
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Especialidades
          </h1>
          <p className="text-sm text-slate-400">
            Catálogo de especialidades asignables a odontólogos.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Nueva especialidad
        </button>
      </header>

      {/* BUSCADOR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Buscar por nombre o descripción…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {loading && (
          <span className="text-sm text-slate-400">Cargando…</span>
        )}
      </div>

      {/* TABLA */}
      <div className="overflow-auto rounded-xl border border-white/10 bg-slate-900/40">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="text-left p-3 text-slate-300 font-medium">ID</th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Nombre
              </th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Descripción
              </th>
              <th className="text-left p-3 text-slate-300 font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((it) => (
              <tr
                key={it.idEspecialidad}
                className="border-t border-white/10 hover:bg-slate-800/60 transition-colors"
              >
                <td className="p-3 text-slate-100">{it.idEspecialidad}</td>
                <td className="p-3 text-slate-100">{it.nombre}</td>
                <td className="p-3 text-slate-100">
                  {it.descripcion ?? "-"}
                </td>
                <td className="p-3 flex items-center gap-2">
                  <button
                    title="Editar"
                    onClick={() => openUpdate(it)}
                    className="p-1.5 rounded-full hover:bg-slate-700 text-slate-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    title="Eliminar"
                    onClick={() => askDelete(it.idEspecialidad)}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td
                  className="p-4 text-center text-slate-400"
                  colSpan={4}
                >
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR/EDITAR */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title={editing ? "Editar especialidad" : "Nueva especialidad"}
        widthClass="max-w-lg"
      >
        <form className="space-y-4" onSubmit={save}>
          <input
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm((s) => ({ ...s, nombre: e.target.value }))
            }
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 min-h-[90px] focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Descripción (opcional)"
            value={form.descripcion ?? ""}
            onChange={(e) =>
              setForm((s) => ({ ...s, descripcion: e.target.value }))
            }
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setOpenEdit(false)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
            >
              Cancelar
            </button>
            <button
              disabled={saving}
              className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRMAR ELIMINAR */}
      <ConfirmDialog
        open={openDel}
        onClose={() => setOpenDel(false)}
        title="Eliminar especialidad"
        message="¿Deseas eliminar esta especialidad?"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
