// src/features/personal/pages/PersonalListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import api from '@/shared/api/apiClient';
import Modal from '@/shared/ui/Modal';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { getUsuario, updateUsuario, deleteUsuario } from '@/features/personal/personal.service';
import { Eye, Pencil, Trash2 } from 'lucide-react';

// 👉 imports nuevos para especialidades
import type { Especialidad } from '@/types/especialidad';
import {
  listarEspecialidades,
  asignarEspecialidadesAOdontologo,
  getOdontologoByUsuario,
} from '@/features/personal/personal.service';

type RolListadoUsuario = {
  idUsuario: number;
  ci?: string;
  nombre: string;
  paterno?: string;
  materno?: string;
  correo?: string;
  telefono?: string;
  estado?: boolean;
  especialidad?: string;
  horario?: string;
  turno?: string;
  fechaContratacion?: string;
};

type CrearUsuarioBase = {
  ci: string;
  nombre: string;
  paterno?: string;
  materno?: string;
  fechaNacimiento: string;
  genero: 'M' | 'F';
  telefono?: string;
  contrasena: string;
  correo: string;
  direccion?: string;
  estado?: boolean;
};

// —— helpers de normalización (soporta ambos shapes de tus endpoints) ——
function onlyDate(iso?: string | null) {
  if (!iso) return undefined;
  return String(iso).split('T')[0];
}

export default function PersonalListPage() {
  const [tab, setTab] = useState<'odontologos' | 'asistentes'>('odontologos');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RolListadoUsuario[]>([]);
  const [search, setSearch] = useState('');

  // modal agregar
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formBase, setFormBase] = useState<CrearUsuarioBase>({
    ci: '',
    nombre: '',
    paterno: '',
    materno: '',
    fechaNacimiento: '',
    genero: 'M',
    telefono: '',
    contrasena: '',
    correo: '',
    direccion: '',
    estado: true,
  });
  const [fechaContratacion, setFechaContratacion] = useState('');
  const [horario, setHorario] = useState('');
  const [turno, setTurno] = useState('mañana');

  // catálogo de especialidades (solo relevante para odontólogos)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [selEspecialidades, setSelEspecialidades] = useState<number[]>([]);

  // Ver / Editar / Eliminar
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // datos para Ver/Editar
  const [detail, setDetail] = useState<any>(null);
  const [edit, setEdit] = useState<Partial<{
    ci: string; nombre: string; paterno?: string; materno?: string;
    fechaNacimiento?: string; genero?: 'M'|'F'; telefono?: string;
    correo?: string; direccion?: string; estado?: boolean;
    contrasena?: string;
  }>>({});

  async function cargar() {
    setLoading(true);
    try {
      if (tab === 'odontologos') {
        // 1) forma real: GET /odontologos (paginado con { data: [] } y usuario embebido)
        try {
          const { data } = await api.get('/odontologos');
          const arr = (data?.data ?? data) as any[];
          const mapped: RolListadoUsuario[] = (arr ?? []).map((o) => ({
            idUsuario: o?.usuario?.idUsuario,
            ci: o?.usuario?.ci,
            nombre: o?.usuario?.nombre,
            paterno: o?.usuario?.paterno,
            materno: o?.usuario?.materno,
            correo: o?.usuario?.correo,
            telefono: o?.usuario?.telefono,
            estado: o?.usuario?.estado,
            horario: o?.horario ?? '-',
            fechaContratacion: onlyDate(o?.fechaContratacion) ?? '-',
          })).filter(x => !!x.idUsuario);
          if (mapped.length) {
            setItems(mapped);
            return;
          }
        } catch {
          /* fallback abajo */
        }
        // 2) fallback: /usuarios/odontologos/listar (tu listado anterior)
        const { data: fallback } = await api.get('/usuarios/odontologos/listar');
        const arr2 = (fallback?.data ?? fallback) as RolListadoUsuario[];
        setItems(Array.isArray(arr2) ? arr2 : []);
      } else {
        // 1) forma real: GET /asistentes ({ success: true, data: [] } y usuario embebido)
        try {
          const { data } = await api.get('/asistentes');
          const arr = (data?.data ?? data) as any[];
          const mapped: RolListadoUsuario[] = (arr ?? []).map((a) => ({
            idUsuario: a?.usuario?.idUsuario,
            ci: a?.usuario?.ci,
            nombre: a?.usuario?.nombre,
            paterno: a?.usuario?.paterno,
            materno: a?.usuario?.materno,
            correo: a?.usuario?.correo,
            telefono: a?.usuario?.telefono,
            estado: a?.usuario?.estado,
            turno: a?.turno ?? '-',
            fechaContratacion: onlyDate(a?.fechaContratacion) ?? '-',
          })).filter(x => !!x.idUsuario);
          if (mapped.length) {
            setItems(mapped);
            return;
          }
        } catch {
          /* fallback abajo */
        }
        // 2) fallback: /usuarios/asistentes/listar
        const { data: fallback } = await api.get('/usuarios/asistentes/listar');
        const arr2 = (fallback?.data ?? fallback) as RolListadoUsuario[];
        setItems(Array.isArray(arr2) ? arr2 : []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // cargar catálogo de especialidades cuando la pestaña es odontólogos
  useEffect(() => {
    if (tab === 'odontologos') {
      listarEspecialidades().then((data) => setEspecialidades(Array.isArray(data) ? data : []));
    }
  }, [tab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) =>
      [x.ci, x.nombre, x.paterno, x.materno, x.correo, x.telefono]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, search]);

  async function toggleEstado(u: RolListadoUsuario) {
    if (!u.idUsuario) return;
    const nuevo = !u.estado;
    await api.put(`/usuarios/${u.idUsuario}`, { estado: nuevo });
    setItems((prev) =>
      prev.map((r) => (r.idUsuario === u.idUsuario ? { ...r, estado: nuevo } : r))
    );
  }

  function toggleSelEsp(id: number) {
    setSelEspecialidades((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: user } = await api.post('/usuarios', formBase);
      const userId = user?.idUsuario ?? user?.data?.idUsuario;

      if (tab === 'odontologos') {
        await api.post('/odontologos', {
          idUsuario_Odontologo: userId,
          fechaContratacion,
          horario,
        });

        // asignar especialidades seleccionadas (si hay)
        if (selEspecialidades.length) {
          await asignarEspecialidadesAOdontologo(userId, selEspecialidades);
        }
      } else {
        await api.post('/asistentes', {
          idUsuario_Asistente: userId,
          turno,
          fechaContratacion,
        });
      }

      setOpen(false);
      resetForm();
      await cargar();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setFormBase({
      ci: '',
      nombre: '',
      paterno: '',
      materno: '',
      fechaNacimiento: '',
      genero: 'M',
      telefono: '',
      contrasena: '',
      correo: '',
      direccion: '',
      estado: true,
    });
    setFechaContratacion('');
    setHorario('');
    setTurno('mañana');
    setSelEspecialidades([]); // limpiar selección de especialidades
  }

  // ------------ VER ------------
  async function verDetalle(u: RolListadoUsuario) {
    if (!u.idUsuario) return;
    setSelectedId(u.idUsuario);
    const full = await getUsuario(u.idUsuario);
    const base = full?.data ?? full;

    // si es odontólogo, traer sus especialidades
    let esp: Especialidad[] = [];
    if (tab === 'odontologos') {
      const od = await getOdontologoByUsuario(u.idUsuario);
      esp = (od?.especialidades ?? []) as any;
    }

    setDetail({ ...base, _especialidades: esp });
    setViewOpen(true);
  }

  // ------------ EDITAR ------------
  async function abrirEditar(u: RolListadoUsuario) {
    if (!u.idUsuario) return;
    setSelectedId(u.idUsuario);
    const full = await getUsuario(u.idUsuario);
    const d = (full?.data ?? full) as any;
    setEdit({
      ci: d.ci ?? '',
      nombre: d.nombre ?? '',
      paterno: d.paterno ?? '',
      materno: d.materno ?? '',
      fechaNacimiento: d.fechaNacimiento?.slice(0, 10) ?? '',
      genero: d.genero ?? 'M',
      telefono: d.telefono ?? '',
      correo: d.correo ?? '',
      direccion: d.direccion ?? '',
      estado: d.estado ?? true,
    });
    setEditOpen(true);
  }

  async function guardarEdicion() {
    if (!selectedId) return;
    const payload = { ...edit };
    const res = await updateUsuario(selectedId, payload);
    const updated = res?.data ?? res;

    setItems((prev) =>
      prev.map((r) =>
        r.idUsuario === selectedId
          ? {
              ...r,
              ci: updated.ci,
              nombre: updated.nombre,
              paterno: updated.paterno,
              materno: updated.materno,
              correo: updated.correo,
              telefono: updated.telefono,
              estado: updated.estado,
            }
          : r
      )
    );

    setEditOpen(false);
  }

  // ------------ ELIMINAR ------------
  function abrirEliminar(u: RolListadoUsuario) {
    setSelectedId(u.idUsuario);
    setDelOpen(true);
  }

  async function confirmarEliminar() {
    if (!selectedId) return;
    await deleteUsuario(selectedId);
    setItems((prev) => prev.filter((x) => x.idUsuario !== selectedId));
    setDelOpen(false);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Personal</h1>
          <p className="text-sm opacity-70">Odontólogos y asistentes. Usa el interruptor para activar/desactivar.</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white"
        >
          Agregar {tab === 'odontologos' ? 'Odontólogo' : 'Asistente'}
        </button>
      </header>

      {/* Tabs */}
      <div className="inline-flex rounded overflow-hidden border border-white/10">
        <button
          className={`px-3 py-1.5 text-sm ${tab === 'odontologos' ? 'bg-white/10' : 'hover:bg-white/5'}`}
          onClick={() => setTab('odontologos')}
        >
          Odontólogos
        </button>
        <button
          className={`px-3 py-1.5 text-sm ${tab === 'asistentes' ? 'bg-white/10' : 'hover:bg-white/5'}`}
          onClick={() => setTab('asistentes')}
        >
          Asistentes
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <input
          className="px-3 py-2 rounded bg-white text-slate-900 w-72"
          placeholder="Buscar por CI, nombre o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && <span className="text-sm opacity-70">Cargando…</span>}
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-2">CI</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">{tab === 'odontologos' ? 'Horario' : 'Turno'}</th>
              <th className="text-left p-2">Contratación</th>
              <th className="text-left p-2">Correo</th>
              <th className="text-left p-2">Teléfono</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.idUsuario} className="border-t border-white/10">
                <td className="p-2">{u.ci ?? '-'}</td>
                <td className="p-2">
                  {u.nombre} {u.paterno ?? ''} {u.materno ?? ''}
                </td>
                <td className="p-2">{tab === 'odontologos' ? u.horario ?? '-' : u.turno ?? '-'}</td>
                <td className="p-2">{u.fechaContratacion ?? '-'}</td>
                <td className="p-2">{u.correo ?? '-'}</td>
                <td className="p-2">{u.telefono ?? '-'}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleEstado(u)}
                    className={`px-2 py-1 rounded text-xs ${u.estado ? 'bg-green-600' : 'bg-slate-600'}`}
                    title="Cambiar estado"
                  >
                    {u.estado ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="p-2 flex items-center gap-2">
                  <button title="Ver" onClick={() => verDetalle(u)} className="p-1 rounded hover:bg-white/10">
                    <Eye size={16} />
                  </button>
                  <button title="Editar" onClick={() => abrirEditar(u)} className="p-1 rounded hover:bg-white/10">
                    <Pencil size={16} />
                  </button>
                  <button title="Eliminar" onClick={() => abrirEliminar(u)} className="p-1 rounded hover:bg-white/10 text-red-300">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td className="p-3 opacity-70" colSpan={8}>Sin resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal agregar — centrado sin cambiar tu flujo */}
      <dialog
        open={open}
        className="rounded-md w-[720px] bg-white text-slate-900"
        style={{ position: 'fixed', inset: '0', margin: 'auto' }}
      >
        <form onSubmit={onCreate} className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">
            Agregar {tab === 'odontologos' ? 'Odontólogo' : 'Asistente'}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 rounded border" placeholder="CI"
              value={formBase.ci} onChange={(e) => setFormBase({ ...formBase, ci: e.target.value })} />
            <input className="px-3 py-2 rounded border" placeholder="Nombre"
              value={formBase.nombre} onChange={(e) => setFormBase({ ...formBase, nombre: e.target.value })} />
            <input className="px-3 py-2 rounded border" placeholder="Paterno"
              value={formBase.paterno ?? ''} onChange={(e) => setFormBase({ ...formBase, paterno: e.target.value })} />
            <input className="px-3 py-2 rounded border" placeholder="Materno"
              value={formBase.materno ?? ''} onChange={(e) => setFormBase({ ...formBase, materno: e.target.value })} />

            <label className="text-xs opacity-80 col-span-2">Fecha de nacimiento</label>
            <input type="date" className="px-3 py-2 rounded border col-span-2"
              value={formBase.fechaNacimiento} onChange={(e) => setFormBase({ ...formBase, fechaNacimiento: e.target.value })} />

            <select className="px-3 py-2 rounded border"
              value={formBase.genero} onChange={(e) => setFormBase({ ...formBase, genero: e.target.value as 'M' | 'F' })}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input className="px-3 py-2 rounded border" placeholder="Teléfono"
              value={formBase.telefono ?? ''} onChange={(e) => setFormBase({ ...formBase, telefono: e.target.value })} />
            <input className="px-3 py-2 rounded border" placeholder="Correo"
              value={formBase.correo} onChange={(e) => setFormBase({ ...formBase, correo: e.target.value })} />
            <input type="password" className="px-3 py-2 rounded border" placeholder="Contraseña"
              value={formBase.contrasena} onChange={(e) => setFormBase({ ...formBase, contrasena: e.target.value })} />
            <input className="px-3 py-2 rounded border" placeholder="Dirección"
              value={formBase.direccion ?? ''} onChange={(e) => setFormBase({ ...formBase, direccion: e.target.value })} />

            <label className="text-xs opacity-80 col-span-2">Fecha de contratación</label>
            <input type="date" className="px-3 py-2 rounded border col-span-2"
              value={fechaContratacion} onChange={(e) => setFechaContratacion(e.target.value)} />

            {tab === 'odontologos' ? (
              <>
                <input className="px-3 py-2 rounded border col-span-2" placeholder="Horario (ej. Lun-Vie 8:00-16:00)"
                  value={horario} onChange={(e) => setHorario(e.target.value)} />

                {/* Selector múltiple de especialidades */}
                <div className="col-span-2 space-y-2">
                  <div className="text-xs opacity-80">Especialidades (seleccione una o varias)</div>
                  <div className="flex flex-wrap gap-2">
                    {especialidades.map((e) => {
                      const active = selEspecialidades.includes(e.idEspecialidad);
                      return (
                        <button
                          key={e.idEspecialidad}
                          type="button"
                          onClick={() => toggleSelEsp(e.idEspecialidad)}
                          className={`px-2 py-1 rounded-full border text-xs ${
                            active ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-300'
                          }`}
                          title={e.descripcion ?? e.nombre}
                        >
                          {e.nombre}
                        </button>
                      );
                    })}
                    {especialidades.length === 0 && (
                      <span className="text-xs text-slate-500">No hay especialidades registradas aún.</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <select className="px-3 py-2 rounded border col-span-2"
                value={turno} onChange={(e) => setTurno(e.target.value)}>
                <option value="mañana">Turno mañana</option>
                <option value="tarde">Turno tarde</option>
                <option value="noche">Turno noche</option>
              </select>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300">
              Cancelar
            </button>
            <button disabled={saving} className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </dialog>

      {/* ----- Modal VER (tu componente existente) ----- */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle del usuario"
        widthClass="max-w-2xl"
      >
        {!detail ? (
          <div>Cargando…</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="font-medium">CI:</span> {detail.ci ?? '-'}</div>
            <div><span className="font-medium">Nombre:</span> {detail.nombre ?? '-'}</div>
            <div><span className="font-medium">Paterno:</span> {detail.paterno ?? '-'}</div>
            <div><span className="font-medium">Materno:</span> {detail.materno ?? '-'}</div>
            <div><span className="font-medium">Nacimiento:</span> {detail.fechaNacimiento?.slice(0,10) ?? '-'}</div>
            <div><span className="font-medium">Género:</span> {detail.genero ?? '-'}</div>
            <div><span className="font-medium">Teléfono:</span> {detail.telefono ?? '-'}</div>
            <div><span className="font-medium">Correo:</span> {detail.correo ?? '-'}</div>
            <div className="col-span-2"><span className="font-medium">Dirección:</span> {detail.direccion ?? '-'}</div>
            <div><span className="font-medium">Estado:</span> {detail.estado ? 'Activo' : 'Inactivo'}</div>

            {/* Especialidades del odontólogo */}
            {tab === 'odontologos' && Array.isArray(detail?._especialidades) && (
              <div className="col-span-2">
                <span className="font-medium">Especialidades:</span>{' '}
                {detail._especialidades.length ? (
                  <span className="inline-flex flex-wrap gap-2 align-middle">
                    {detail._especialidades.map((e: any) => (
                      <span key={e.idEspecialidad} className="px-2 py-0.5 rounded-full bg-teal-600/15 text-teal-800 text-xs border border-teal-600/30">
                        {e.nombre}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>-</span>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ----- Modal EDITAR (tu componente existente) ----- */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar usuario"
        widthClass="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded border" placeholder="CI"
            value={edit.ci ?? ''} onChange={(e) => setEdit((s) => ({ ...s, ci: e.target.value }))} />
          <input className="px-3 py-2 rounded border" placeholder="Nombre"
            value={edit.nombre ?? ''} onChange={(e) => setEdit((s) => ({ ...s, nombre: e.target.value }))} />
          <input className="px-3 py-2 rounded border" placeholder="Paterno"
            value={edit.paterno ?? ''} onChange={(e) => setEdit((s) => ({ ...s, paterno: e.target.value }))} />
          <input className="px-3 py-2 rounded border" placeholder="Materno"
            value={edit.materno ?? ''} onChange={(e) => setEdit((s) => ({ ...s, materno: e.target.value }))} />
          <label className="text-xs opacity-70 col-span-2">Fecha de nacimiento</label>
          <input type="date" className="px-3 py-2 rounded border col-span-2"
            value={edit.fechaNacimiento ?? ''} onChange={(e) => setEdit((s) => ({ ...s, fechaNacimiento: e.target.value }))} />
          <select className="px-3 py-2 rounded border"
            value={edit.genero ?? 'M'} onChange={(e) => setEdit((s) => ({ ...s, genero: e.target.value as 'M'|'F' }))}>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <input className="px-3 py-2 rounded border" placeholder="Teléfono"
            value={edit.telefono ?? ''} onChange={(e) => setEdit((s) => ({ ...s, telefono: e.target.value }))} />
          <input className="px-3 py-2 rounded border col-span-2" placeholder="Correo"
            value={edit.correo ?? ''} onChange={(e) => setEdit((s) => ({ ...s, correo: e.target.value }))} />
          <input className="px-3 py-2 rounded border col-span-2" placeholder="Dirección"
            value={edit.direccion ?? ''} onChange={(e) => setEdit((s) => ({ ...s, direccion: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setEditOpen(false)} className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300">Cancelar</button>
          <button onClick={guardarEdicion} className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white">Guardar</button>
        </div>
      </Modal>

      {/* ----- Confirmar ELIMINAR (tu componente existente) ----- */}
      <ConfirmDialog
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="Eliminar usuario"
        message="Esta acción eliminará al usuario. ¿Deseas continuar?"
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
