// src/features/personal/pages/PersonalListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import api from '@/shared/api/apiClient';

type RolListadoUsuario = {
  idUsuario: number;
  ci?: string;
  nombre: string;
  paterno?: string;
  materno?: string;
  correo?: string;
  telefono?: string;
  estado?: boolean;
  // extras que a veces vienen:
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
  fechaNacimiento: string;        // yyyy-mm-dd
  genero: 'M' | 'F';
  telefono?: string;
  contrasena: string;
  correo: string;
  direccion?: string;
  estado?: boolean;
};

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
  // extras por rol
  const [fechaContratacion, setFechaContratacion] = useState('');
  const [horario, setHorario] = useState(''); // para odontólogos
  const [turno, setTurno] = useState('mañana'); // para asistentes

  async function cargar() {
    setLoading(true);
    try {
      const url =
        tab === 'odontologos'
          ? '/usuarios/odontologos/listar'
          : '/usuarios/asistentes/listar';
      const { data } = await api.get(url);
      const arr = (data?.data ?? data) as RolListadoUsuario[];
      setItems(Array.isArray(arr) ? arr : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // 1) crea usuario base
      console.log('Creando usuario base con datos:', formBase);
      const { data: user } = await api.post('/usuarios', formBase);
      const userId = user?.idUsuario ?? user?.data?.idUsuario;

      // 2) crea el rol específico
      if (tab === 'odontologos') {
        await api.post('/odontologos', {
          idUsuario_Odontologo: userId,
          fechaContratacion,
          horario,
        });
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
    } catch (error: unknown){
        console.log('Error al crear usuario:', error);
    }finally {
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
  }

  function verDetalle(u: RolListadoUsuario) {
    const detalle = JSON.stringify(u, null, 2);
    window.alert(detalle); // Puedes cambiar esto por un modal más bonito
  }

  function editar(u: RolListadoUsuario) {
    // TODO: abrir modal edición (actualizar /usuarios y /odontologos|/asistentes)
    window.alert(`TODO editar usuario #${u.idUsuario}`);
  }

  function eliminar(u: RolListadoUsuario) {
    // TODO: si quieres eliminar completamente, necesitarás eliminar el rol y quizá el usuario.
    window.alert(`TODO eliminar usuario #${u.idUsuario}`);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Personal</h1>
          <p className="text-sm opacity-70">
            Odontólogos y asistentes. Usa el interruptor para activar/desactivar.
          </p>
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
          className={`px-3 py-1.5 text-sm ${
            tab === 'odontologos' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
          onClick={() => setTab('odontologos')}
        >
          Odontólogos
        </button>
        <button
          className={`px-3 py-1.5 text-sm ${
            tab === 'asistentes' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
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
                <td className="p-2">
                  {tab === 'odontologos' ? u.horario ?? '-' : u.turno ?? '-'}
                </td>
                <td className="p-2">{u.fechaContratacion ?? '-'}</td>
                <td className="p-2">{u.correo ?? '-'}</td>
                <td className="p-2">{u.telefono ?? '-'}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleEstado(u)}
                    className={`px-2 py-1 rounded text-xs ${
                      u.estado ? 'bg-green-600' : 'bg-slate-600'
                    }`}
                    title="Cambiar estado"
                  >
                    {u.estado ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  <button className="underline" onClick={() => verDetalle(u)}>
                    Ver
                  </button>
                  <button className="underline" onClick={() => editar(u)}>
                    Editar
                  </button>
                  <button className="underline text-red-300" onClick={() => eliminar(u)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td className="p-3 opacity-70" colSpan={8}>
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal agregar con <dialog> nativo */}
      <dialog open={open} className="backdrop:bg-black/50 rounded-md w-[720px]">
        <form onSubmit={onCreate} className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">
            Agregar {tab === 'odontologos' ? 'Odontólogo' : 'Asistente'}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="CI"
              value={formBase.ci} onChange={(e) => setFormBase({ ...formBase, ci: e.target.value })} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Nombre"
              value={formBase.nombre} onChange={(e) => setFormBase({ ...formBase, nombre: e.target.value })} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Paterno"
              value={formBase.paterno ?? ''} onChange={(e) => setFormBase({ ...formBase, paterno: e.target.value })} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Materno"
              value={formBase.materno ?? ''} onChange={(e) => setFormBase({ ...formBase, materno: e.target.value })} />
            <label className="text-xs opacity-80 col-span-2">Fecha de nacimiento</label>
            <input type="date" className="px-3 py-2 rounded bg-white text-slate-900 col-span-2"
              value={formBase.fechaNacimiento} onChange={(e) => setFormBase({ ...formBase, fechaNacimiento: e.target.value })} />
            <select className="px-3 py-2 rounded bg-white text-slate-900"
              value={formBase.genero} onChange={(e) => setFormBase({ ...formBase, genero: e.target.value as 'M' | 'F' })}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Teléfono"
              value={formBase.telefono ?? ''} onChange={(e) => setFormBase({ ...formBase, telefono: e.target.value })} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Correo"
              value={formBase.correo} onChange={(e) => setFormBase({ ...formBase, correo: e.target.value })} />
            <input type="password" className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Contraseña"
              value={formBase.contrasena} onChange={(e) => setFormBase({ ...formBase, contrasena: e.target.value })} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Dirección"
              value={formBase.direccion ?? ''} onChange={(e) => setFormBase({ ...formBase, direccion: e.target.value })} />

            <label className="text-xs opacity-80 col-span-2">Fecha de contratación</label>
            <input type="date" className="px-3 py-2 rounded bg-white text-slate-900 col-span-2"
              value={fechaContratacion} onChange={(e) => setFechaContratacion(e.target.value)} />

            {tab === 'odontologos' ? (
              <input className="px-3 py-2 rounded bg-white text-slate-900 col-span-2" placeholder="Horario (ej. Lun-Vie 8:00-16:00)"
                value={horario} onChange={(e) => setHorario(e.target.value)} />
            ) : (
              <select className="px-3 py-2 rounded bg-white text-slate-900 col-span-2"
                value={turno} onChange={(e) => setTurno(e.target.value)}>
                <option value="mañana">Turno mañana</option>
                <option value="tarde">Turno tarde</option>
                <option value="noche">Turno noche</option>
              </select>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">
              Cancelar
            </button>
            <button disabled={saving} className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
