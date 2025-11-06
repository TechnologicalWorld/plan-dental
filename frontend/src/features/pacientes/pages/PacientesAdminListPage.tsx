// src/features/pacientes/pages/PacientesAdminListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import api from '@/shared/api/apiClient';
import Modal from '@/shared/ui/Modal';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { getUsuario, updateUsuario, deleteUsuario } from '@/features/personal/personal.service';
import { Eye, Pencil, Trash2 } from 'lucide-react';

type PacienteItem = {
  idUsuario_Paciente: number;
  codigoSeguro?: string;
  lugarNacimiento?: string;
  domicilio?: string;
  fechaIngreso?: string;
  usuario?: {
    idUsuario: number;
    ci?: string;
    nombre: string;
    paterno?: string;
    materno?: string;
    telefono?: string;
    correo?: string;
    estado?: boolean;
  };
};

type RegisterBody = {
  nombre: string;
  paterno?: string;
  materno?: string;
  fechaNacimiento?: string;
  genero?: 'M' | 'F';
  telefono?: string;
  contrasena: string;
  correo: string;
  ci: string;
  codigoSeguro?: string;
  lugarNacimiento?: string;
  domicilio?: string;
  fechaIngreso: string;
  device_name?: string;
};

function onlyDate(d?: string) {
  return d ? String(d).split('T')[0] : d;
}

export default function PacientesAdminListPage() {
  const [items, setItems] = useState<PacienteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // agregar
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<RegisterBody>({
    nombre: '',
    paterno: '',
    materno: '',
    fechaNacimiento: '',
    genero: 'M',
    telefono: '',
    contrasena: '',
    correo: '',
    ci: '',
    codigoSeguro: '',
    lugarNacimiento: '',
    domicilio: '',
    fechaIngreso: '',
  });

  // ver/editar/eliminar
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [edit, setEdit] = useState<Partial<{
    ci: string; nombre: string; paterno?: string; materno?: string;
    fechaNacimiento?: string; genero?: 'M'|'F'; telefono?: string;
    correo?: string; direccion?: string; estado?: boolean;
  }>>({});

  function onChange<K extends keyof RegisterBody>(k: K, v: RegisterBody[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function cargar() {
    setLoading(true);
    try {
      const { data } = await api.get('/pacientes');
      const arr = (data?.data ?? data) as PacienteItem[];
      setItems(Array.isArray(arr) ? arr : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const u = p.usuario;
      return [u?.ci, u?.nombre, u?.paterno, u?.correo, u?.telefono]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [items, search]);

  async function toggleEstado(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    const nuevo = !(p.usuario?.estado ?? false);
    await api.put(`/usuarios/${idU}`, { estado: nuevo });
    setItems((prev) =>
      prev.map((it) =>
        it.idUsuario_Paciente === p.idUsuario_Paciente
          ? { ...it, usuario: it.usuario ? { ...it.usuario, estado: nuevo } : it.usuario }
          : it
      )
    );
  }

  async function crearPaciente(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, device_name: 'react-app' };
      await api.post('/register', body);
      setOpen(false);
      setForm({
        nombre: '',
        paterno: '',
        materno: '',
        fechaNacimiento: '',
        genero: 'M',
        telefono: '',
        contrasena: '',
        correo: '',
        ci: '',
        codigoSeguro: '',
        lugarNacimiento: '',
        domicilio: '',
        fechaIngreso: '',
      });
      await cargar();
    } finally {
      setSaving(false);
    }
  }

  // ---- Ver / Editar / Borrar ----
  async function ver(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    setSelectedId(idU);
    const full = await getUsuario(idU);
    setDetail(full?.data ?? full);
    setViewOpen(true);
  }

  async function abrirEditar(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    setSelectedId(idU);
    const full = await getUsuario(idU);
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
    const res = await updateUsuario(selectedId, { ...edit });
    const updated = res?.data ?? res;

    // reflejar en tabla
    setItems((prev) =>
      prev.map((it) => {
        const isThis = (it.usuario?.idUsuario ?? it.idUsuario_Paciente) === selectedId;
        if (!isThis) return it;
        const u = it.usuario ?? { idUsuario: selectedId };
        return {
          ...it,
          usuario: {
            ...u,
            ci: updated.ci,
            nombre: updated.nombre,
            paterno: updated.paterno,
            materno: updated.materno,
            correo: updated.correo,
            telefono: updated.telefono,
            estado: updated.estado,
            idUsuario: selectedId,
          },
        };
      })
    );
    setEditOpen(false);
  }

  function abrirEliminar(p: PacienteItem) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    setSelectedId(idU ?? null);
    setDelOpen(true);
  }

  async function confirmarEliminar() {
    if (!selectedId) return;
    await deleteUsuario(selectedId);
    setItems((prev) =>
      prev.filter((it) => (it.usuario?.idUsuario ?? it.idUsuario_Paciente) !== selectedId)
    );
    setDelOpen(false);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Pacientes</h1>
          <p className="text-sm opacity-70">Lista, búsqueda, alta y cambio de estado.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white"
        >
          Agregar Paciente
        </button>
      </header>

      <div className="flex items-center gap-2">
        <input
          className="px-3 py-2 rounded bg-white text-slate-900 w-72"
          placeholder="Buscar por CI, nombre o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && <span className="text-sm opacity-70">Cargando…</span>}
      </div>

      <div className="overflow-auto rounded border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-2">CI</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Fecha ingreso</th>
              <th className="text-left p-2">Teléfono</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const u = p.usuario ?? ({} as PacienteItem['usuario']);
              return (
                <tr key={p.idUsuario_Paciente} className="border-t border-white/10">
                  <td className="p-2">{u?.ci ?? '-'}</td>
                  <td className="p-2">
                    {[u?.nombre, u?.paterno, u?.materno].filter(Boolean).join(' ') || '-' }
                  </td>
                  <td className="p-2">{onlyDate(p.fechaIngreso) ?? '-'}</td>
                  <td className="p-2">{u?.telefono ?? '-'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleEstado(p)}
                      className={`px-2 py-1 rounded text-xs ${u?.estado ? 'bg-green-600' : 'bg-slate-600'}`}
                    >
                      {u?.estado ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="p-2 flex items-center gap-2">
                    <button title="Ver" onClick={() => ver(p)} className="p-1 rounded hover:bg-white/10">
                      <Eye size={16} />
                    </button>
                    <button title="Editar" onClick={() => abrirEditar(p)} className="p-1 rounded hover:bg-white/10">
                      <Pencil size={16} />
                    </button>
                    <button title="Eliminar" onClick={() => abrirEliminar(p)} className="p-1 rounded hover:bg-white/10 text-red-300">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !loading && (
              <tr>
                <td className="p-3 opacity-70" colSpan={6}>Sin resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal agregar (centrado) */}
      <dialog
        open={open}
        className="rounded-md w-[720px] bg-white text-slate-900"
        style={{ position: 'fixed', inset: '0', margin: 'auto' }}
      >
        <form onSubmit={crearPaciente} className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">Agregar Paciente</h2>
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 rounded border" placeholder="CI"
              value={form.ci} onChange={(e) => onChange('ci', e.target.value)} />
            <input className="px-3 py-2 rounded border" placeholder="Nombre"
              value={form.nombre} onChange={(e) => onChange('nombre', e.target.value)} />
            <input className="px-3 py-2 rounded border" placeholder="Paterno"
              value={form.paterno ?? ''} onChange={(e) => onChange('paterno', e.target.value)} />
            <input className="px-3 py-2 rounded border" placeholder="Materno"
              value={form.materno ?? ''} onChange={(e) => onChange('materno', e.target.value)} />

            <label className="text-xs opacity-80 col-span-2">Fecha de nacimiento</label>
            <input type="date" className="px-3 py-2 rounded border col-span-2"
              value={form.fechaNacimiento ?? ''} onChange={(e) => onChange('fechaNacimiento', e.target.value)} />

            <select className="px-3 py-2 rounded border"
              value={form.genero ?? 'M'} onChange={(e) => onChange('genero', e.target.value as 'M' | 'F')}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input className="px-3 py-2 rounded border" placeholder="Teléfono"
              value={form.telefono ?? ''} onChange={(e) => onChange('telefono', e.target.value)} />

            <input className="px-3 py-2 rounded border col-span-2" placeholder="Correo"
              value={form.correo} onChange={(e) => onChange('correo', e.target.value)} />
            <input type="password" className="px-3 py-2 rounded border col-span-2" placeholder="Contraseña"
              value={form.contrasena} onChange={(e) => onChange('contrasena', e.target.value)} />

            <input className="px-3 py-2 rounded border" placeholder="Código de seguro"
              value={form.codigoSeguro ?? ''} onChange={(e) => onChange('codigoSeguro', e.target.value)} />
            <input className="px-3 py-2 rounded border" placeholder="Lugar de nacimiento"
              value={form.lugarNacimiento ?? ''} onChange={(e) => onChange('lugarNacimiento', e.target.value)} />

            <input className="px-3 py-2 rounded border col-span-2" placeholder="Domicilio"
              value={form.domicilio ?? ''} onChange={(e) => onChange('domicilio', e.target.value)} />

            <label className="text-xs opacity-80 col-span-2">Fecha de ingreso</label>
            <input type="date" className="px-3 py-2 rounded border col-span-2"
              value={form.fechaIngreso} onChange={(e) => onChange('fechaIngreso', e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300">
              Cancelar
            </button>
            <button disabled={saving} className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white">
              {saving ? 'Guardando…' : 'Registrar'}
            </button>
          </div>
        </form>
      </dialog>

      {/* VER (tu Modal existente) */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalle de paciente" widthClassName="max-w-2xl">
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
          </div>
        )}
      </Modal>

      {/* EDITAR (tu Modal existente) */}
      {/* EDITAR (con acciones dentro del contenido) */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar paciente"
        widthClassName="max-w-2xl"
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
          <input
            type="date"
            className="px-3 py-2 rounded border col-span-2"
            value={edit.fechaNacimiento ?? ''}
            onChange={(e) => setEdit((s) => ({ ...s, fechaNacimiento: e.target.value }))}
          />

          <select className="px-3 py-2 rounded border"
            value={edit.genero ?? 'M'}
            onChange={(e) => setEdit((s) => ({ ...s, genero: e.target.value as 'M'|'F' }))}>
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

        {/* Botonera fija al final */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setEditOpen(false)}
            className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300"
          >
            Cancelar
          </button>
          <button
            onClick={guardarEdicion}
            className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white"
          >
            Guardar
          </button>
        </div>
      </Modal>


      {/* ELIMINAR (tu ConfirmDialog) */}
      <ConfirmDialog
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="Eliminar paciente"
        message="Esta acción eliminará al usuario y su cuenta de paciente."
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
