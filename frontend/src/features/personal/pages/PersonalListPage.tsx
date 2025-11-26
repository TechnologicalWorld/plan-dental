import { useEffect, useMemo, useState } from 'react';
import api from '@/shared/api/apiClient';
import Modal from '@/shared/ui/Modal';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { getUsuario, updateUsuario, deleteUsuario } from '@/features/personal/personal.service';
import { Eye, Pencil, Trash2 } from 'lucide-react';

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

function onlyDate(iso?: string | null) {
  if (!iso) return undefined;
  return String(iso).split('T')[0];
}

export default function PersonalListPage() {
  const [tab, setTab] = useState<'odontologos' | 'asistentes'>('odontologos');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RolListadoUsuario[]>([]);
  const [search, setSearch] = useState('');

  const [estadoFilter, setEstadoFilter] = useState<'todos' | 'activos' | 'inactivos'>('todos');

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

  useEffect(() => {
    const anyModalOpen = open || viewOpen || editOpen || delOpen;

    if (anyModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, viewOpen, editOpen, delOpen]);

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 ' +
    'placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  const labelClass = 'text-xs font-medium text-slate-300';

  async function cargar() {
    setLoading(true);
    try {
      if (tab === 'odontologos') {
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

        const { data: fallback } = await api.get('/usuarios/odontologos/listar');
        const arr2 = (fallback?.data ?? fallback) as RolListadoUsuario[];
        setItems(Array.isArray(arr2) ? arr2 : []);
      } else {
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

  useEffect(() => {
    if (tab === 'odontologos') {
      listarEspecialidades().then((data) =>
        setEspecialidades(Array.isArray(data) ? data : [])
      );
    }
  }, [tab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let base = items;

    if (tab === 'odontologos') {
      if (estadoFilter === 'activos') {
        base = base.filter((x) => x.estado === true);
      } else if (estadoFilter === 'inactivos') {
        base = base.filter((x) => x.estado === false);
      }
    }

    if (!q) return base;

    return base.filter((x) =>
      [x.ci, x.nombre, x.paterno, x.materno, x.correo, x.telefono]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, search, estadoFilter, tab]);

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
    setSelEspecialidades([]);
  }

  // ------------ VER ------------
  async function verDetalle(u: RolListadoUsuario) {
    if (!u.idUsuario) return;
    setSelectedId(u.idUsuario);
    const full = await getUsuario(u.idUsuario);
    const base = full?.data ?? full;

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
          <h1 className="text-2xl font-semibold text-slate-100">Gestión de Personal</h1>
          <p className="text-sm text-slate-400">
            Odontólogos y asistentes. Usa el interruptor para activar/desactivar.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium shadow-sm"
        >
          Agregar {tab === 'odontologos' ? 'Odontólogo' : 'Asistente'}
        </button>
      </header>

      {/* Tabs */}
      <div className="inline-flex rounded-lg overflow-hidden border border-white/10 bg-slate-900/60">
        <button
          className={`px-3 py-1.5 text-sm ${
            tab === 'odontologos'
              ? 'bg-teal-600 text-white'
              : 'text-slate-200 hover:bg-white/5'
          }`}
          onClick={() => setTab('odontologos')}
        >
          Odontólogos
        </button>
        <button
          className={`px-3 py-1.5 text-sm ${
            tab === 'asistentes'
              ? 'bg-teal-600 text-white'
              : 'text-slate-200 hover:bg-white/5'
          }`}
          onClick={() => setTab('asistentes')}
        >
          Asistentes
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 w-full md:w-72 text-sm"
          placeholder="Buscar por CI, nombre o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {tab === 'odontologos' && (
          <select
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm w-full md:w-56"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as any)}
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
          </select>
        )}

        {loading && (
          <span className="text-sm text-slate-400">Cargando…</span>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-lg border border-white/10 bg-slate-900/40">
        <table className="w-full text-sm text-slate-100">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="text-left p-2 font-medium">CI</th>
              <th className="text-left p-2 font-medium">Nombre</th>
              <th className="text-left p-2 font-medium">
                {tab === 'odontologos' ? 'Horario' : 'Turno'}
              </th>
              <th className="text-left p-2 font-medium">Contratación</th>
              <th className="text-left p-2 font-medium">Correo</th>
              <th className="text-left p-2 font-medium">Teléfono</th>
              <th className="text-left p-2 font-medium">Estado</th>
              <th className="text-left p-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.idUsuario} className="border-t border-white/10 hover:bg-slate-900/60">
                <td className="p-2">{u.ci ?? '-'}</td>
                <td className="p-2">
                  {u.nombre} {u.paterno ?? ''} {u.materno ?? ''}
                </td>
                <td className="p-2">
                  {tab === 'odontologos' ? u.horario ?? '-' : u.turno ?? '-'}
                </td>
                <td className="p-2">{u.fechaContratacion ?? '-'}</td>
                <td className="p-2">{u.correo ?? '-'}</td>
                <td className="p-2">{u.telefono ?? '-'}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleEstado(u)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.estado
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-slate-600 text-slate-100'
                    }`}
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
                  <button
                    title="Eliminar"
                    onClick={() => abrirEliminar(u)}
                    className="p-1 rounded hover:bg-white/10 text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td className="p-3 opacity-70 text-slate-400" colSpan={8}>
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ----- Modal AGREGAR ----- */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title={`Agregar ${tab === 'odontologos' ? 'Odontólogo' : 'Asistente'}`}
        widthClass="w-full max-w-3xl"
      >
        <form
          onSubmit={onCreate}
          className="space-y-4 max-h-[75vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="CI"
              value={formBase.ci}
              onChange={(e) =>
                setFormBase({ ...formBase, ci: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Nombre"
              value={formBase.nombre}
              onChange={(e) =>
                setFormBase({ ...formBase, nombre: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Paterno"
              value={formBase.paterno ?? ''}
              onChange={(e) =>
                setFormBase({ ...formBase, paterno: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Materno"
              value={formBase.materno ?? ''}
              onChange={(e) =>
                setFormBase({ ...formBase, materno: e.target.value })
              }
            />

            {/* Fecha nacimiento */}
            <div className="md:col-span-2 space-y-1">
              <label className={labelClass}>Fecha de nacimiento</label>
              <input
                type="date"
                className={inputClass}
                value={formBase.fechaNacimiento}
                onChange={(e) =>
                  setFormBase({
                    ...formBase,
                    fechaNacimiento: e.target.value,
                  })
                }
              />
            </div>

            {/* Género / Teléfono */}
            <select
              className={inputClass}
              value={formBase.genero}
              onChange={(e) =>
                setFormBase({
                  ...formBase,
                  genero: e.target.value as 'M' | 'F',
                })
              }
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input
              className={inputClass}
              placeholder="Teléfono"
              value={formBase.telefono ?? ''}
              onChange={(e) =>
                setFormBase({ ...formBase, telefono: e.target.value })
              }
            />

            {/* Correo */}
            <input
              className={`${inputClass} md:col-span-2`}
              placeholder="Correo"
              value={formBase.correo}
              onChange={(e) =>
                setFormBase({ ...formBase, correo: e.target.value })
              }
            />

            {/* Contraseña */}
            <input
              type="password"
              className={inputClass}
              placeholder="Contraseña"
              value={formBase.contrasena}
              onChange={(e) =>
                setFormBase({ ...formBase, contrasena: e.target.value })
              }
            />
            <input
              className={inputClass}
              placeholder="Dirección"
              value={formBase.direccion ?? ''}
              onChange={(e) =>
                setFormBase({ ...formBase, direccion: e.target.value })
              }
            />

            {/* Fecha contratación */}
            <div className="md:col-span-2 space-y-1">
              <label className={labelClass}>Fecha de contratación</label>
              <input
                type="date"
                className={inputClass}
                value={fechaContratacion}
                onChange={(e) => setFechaContratacion(e.target.value)}
              />
            </div>

            {/* Datos específicos por rol */}
            {tab === 'odontologos' ? (
              <>
                {/* Horario */}
                <input
                  className={`${inputClass} md:col-span-2`}
                  placeholder="Horario (ej. Lun-Vie 8:00-16:00)"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                />

                {/* Especialidades */}
                <div className="md:col-span-2 space-y-2">
                  <div className={labelClass}>
                    Especialidades (seleccione una o varias)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {especialidades.map((e) => {
                      const active = selEspecialidades.includes(
                        e.idEspecialidad
                      );
                      return (
                        <button
                          key={e.idEspecialidad}
                          type="button"
                          onClick={() => toggleSelEsp(e.idEspecialidad)}
                          className={`px-2 py-1 rounded-full border text-xs transition-colors ${
                            active
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : 'bg-slate-900 border-slate-600 text-slate-200 hover:bg-slate-800'
                          }`}
                          title={e.descripcion ?? e.nombre}
                        >
                          {e.nombre}
                        </button>
                      );
                    })}
                    {especialidades.length === 0 && (
                      <span className="text-xs text-slate-500">
                        No hay especialidades registradas aún.
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <select
                className={`${inputClass} md:col-span-2`}
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
              >
                <option value="mañana">Turno mañana</option>
                <option value="tarde">Turno tarde</option>
                <option value="noche">Turno noche</option>
              </select>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              disabled={saving}
              className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm w-full sm:w-auto disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ----- Modal VER ----- */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle del usuario"
        widthClass="max-w-2xl w-full"
      >
        {!detail ? (
          <div className="text-slate-200">Cargando…</div>
        ) : (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 max-h-[70vh] overflow-y-auto text-sm text-slate-100 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><span className="font-medium text-slate-300">CI:</span> {detail.ci ?? '-'}</div>
              <div><span className="font-medium text-slate-300">Nombre:</span> {detail.nombre ?? '-'}</div>
              <div><span className="font-medium text-slate-300">Paterno:</span> {detail.paterno ?? '-'}</div>
              <div><span className="font-medium text-slate-300">Materno:</span> {detail.materno ?? '-'}</div>
              <div><span className="font-medium text-slate-300">Nacimiento:</span> {detail.fechaNacimiento?.slice(0,10) ?? '-'}</div>
              <div><span className="font-medium text-slate-300">Género:</span> {detail.genero ?? '-'}</div>
              <div><span className="font-medium text-slate-300">Teléfono:</span> {detail.telefono ?? '-'}</div>
              <div><span className="font-medium text-slate-300">Correo:</span> {detail.correo ?? '-'}</div>
              <div className="md:col-span-2">
                <span className="font-medium text-slate-300">Dirección:</span> {detail.direccion ?? '-'}
              </div>
              <div><span className="font-medium text-slate-300">Estado:</span> {detail.estado ? 'Activo' : 'Inactivo'}</div>

              {/* Especialidades del odontólogo */}
              {tab === 'odontologos' && Array.isArray(detail?._especialidades) && (
                <div className="md:col-span-2">
                  <span className="font-medium text-slate-300">Especialidades:</span>{' '}
                  {detail._especialidades.length ? (
                    <span className="inline-flex flex-wrap gap-2 align-middle mt-1">
                      {detail._especialidades.map((e: any) => (
                        <span
                          key={e.idEspecialidad}
                          className="px-2 py-0.5 rounded-full bg-teal-600/20 text-teal-300 text-xs border border-teal-500/40"
                        >
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
          </div>
        )}
      </Modal>

      {/* ----- Modal EDITAR ----- */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar usuario"
        widthClass="max-w-2xl w-full"
      >
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="CI"
              value={edit.ci ?? ''}
              onChange={(e) => setEdit((s) => ({ ...s, ci: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Nombre"
              value={edit.nombre ?? ''}
              onChange={(e) => setEdit((s) => ({ ...s, nombre: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Paterno"
              value={edit.paterno ?? ''}
              onChange={(e) => setEdit((s) => ({ ...s, paterno: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Materno"
              value={edit.materno ?? ''}
              onChange={(e) => setEdit((s) => ({ ...s, materno: e.target.value }))}
            />

            <div className="md:col-span-2 space-y-1">
              <label className={labelClass}>Fecha de nacimiento</label>
              <input
                type="date"
                className={inputClass}
                value={edit.fechaNacimiento ?? ''}
                onChange={(e) => setEdit((s) => ({ ...s, fechaNacimiento: e.target.value }))}
              />
            </div>

            <select
              className={inputClass}
              value={edit.genero ?? 'M'}
              onChange={(e) => setEdit((s) => ({ ...s, genero: e.target.value as 'M'|'F' }))}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input
              className={inputClass}
              placeholder="Teléfono"
              value={edit.telefono ?? ''}
              onChange={(e) => setEdit((s) => ({ ...s, telefono: e.target.value }))}
            />
            <input
              className={`${inputClass} md:col-span-2`}
              placeholder="Correo"
              value={edit.correo ?? ''}
              onChange={(e) => setEdit((s) => ({ ...s, correo: e.target.value }))}
            />
            <input
              className={`${inputClass} md:col-span-2`}
              placeholder="Dirección"
              value={edit.direccion ?? ''}
              onChange={(e) => setEdit((s) => ({ ...s, direccion: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setEditOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={guardarEdicion}
              className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
      {/* ----- Dialog ELIMINAR ----- */}

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
