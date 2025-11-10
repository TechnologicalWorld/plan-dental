import { useEffect, useMemo, useState } from 'react';
import {
  listarEspecialidades,
  crearEspecialidad,
  actualizarEspecialidad,
  eliminarEspecialidad,
} from '@/features/personal/personal.service';
import type { Especialidad } from '@/types/especialidad';
import { Pencil, Trash2, Plus } from 'lucide-react';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import Modal from '@/shared/ui/Modal';

export default function EspecialidadesAdminPage() {
  const [items, setItems] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');

  // crear/editar
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Especialidad | null>(null);
  const [form, setForm] = useState<{ nombre: string; descripcion?: string }>({ nombre: '', descripcion: '' });

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

  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(it =>
      [it.nombre, it.descripcion].filter(Boolean).some(v => String(v).toLowerCase().includes(s))
    );
  }, [items, q]);

  function openNew() {
    setEditing(null);
    setForm({ nombre: '', descripcion: '' });
    setOpenEdit(true);
  }

  function openUpdate(it: Especialidad) {
    setEditing(it);
    setForm({ nombre: it.nombre ?? '', descripcion: it.descripcion ?? '' });
    setOpenEdit(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre?.trim()) return;
    if (editing) {
      await actualizarEspecialidad(editing.idEspecialidad, form);
    } else {
      await crearEspecialidad(form);
    }
    setOpenEdit(false);
    await load();
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Especialidades</h1>
          <p className="text-sm opacity-70">Catálogo de especialidades asignables a odontólogos.</p>
        </div>
        <button onClick={openNew} className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
          <Plus size={16}/> Nueva especialidad
        </button>
      </header>

      <div className="flex items-center gap-2">
        <input
          className="px-3 py-2 rounded bg-white text-slate-900 w-72"
          placeholder="Buscar por nombre o descripción…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {loading && <span className="text-sm opacity-70">Cargando…</span>}
      </div>

      <div className="overflow-auto rounded border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((it) => (
              <tr key={it.idEspecialidad} className="border-t border-white/10">
                <td className="p-2">{it.idEspecialidad}</td>
                <td className="p-2">{it.nombre}</td>
                <td className="p-2">{it.descripcion ?? '-'}</td>
                <td className="p-2 flex items-center gap-2">
                  <button title="Editar" onClick={() => openUpdate(it)} className="p-1 rounded hover:bg-white/10"><Pencil size={16}/></button>
                  <button title="Eliminar" onClick={() => askDelete(it.idEspecialidad)} className="p-1 rounded hover:bg-white/10 text-red-300"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td className="p-3 opacity-70" colSpan={4}>Sin resultados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)} title={editing ? 'Editar especialidad' : 'Nueva especialidad'} widthClass="max-w-lg">
        <form className="space-y-3" onSubmit={save}>
          <input className="px-3 py-2 rounded border w-full" placeholder="Nombre" value={form.nombre}
                 onChange={(e)=>setForm(s=>({...s, nombre:e.target.value}))}/>
          <textarea className="px-3 py-2 rounded border w-full" placeholder="Descripción (opcional)" value={form.descripcion ?? ''}
                    onChange={(e)=>setForm(s=>({...s, descripcion:e.target.value}))}/>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>setOpenEdit(false)} className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300">Cancelar</button>
            <button className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white">Guardar</button>
          </div>
        </form>
      </Modal>

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
