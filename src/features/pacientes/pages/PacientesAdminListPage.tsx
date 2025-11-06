// src/features/pacientes/pages/PacientesAdminListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import api from '@/shared/api/apiClient';

type PacienteItem = {
  idUsuario_Paciente: number;
  codigoSeguro?: string;
  lugarNacimiento?: string;
  domicilio?: string;
  fechaIngreso?: string;
  // a veces viene el usuario embebido; si no, mostraremos '-'
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

export default function PacientesAdminListPage() {
  const [items, setItems] = useState<PacienteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // modal agregar
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
            ? {
                ...it,
                // si 'usuario' puede venir undefined, mantenlo igual; si existe, muta solo 'estado'
                usuario: it.usuario ? { ...it.usuario, estado: nuevo } : it.usuario,
                }
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

  function ver(p: PacienteItem) {
    window.alert(JSON.stringify(p, null, 2));
  }
  function editar(p: PacienteItem) {
    window.alert(`TODO editar paciente usuario#${p.usuario?.idUsuario ?? p.idUsuario_Paciente}`);
  }
  function eliminar(p: PacienteItem) {
    window.alert(`TODO eliminar paciente usuario#${p.usuario?.idUsuario ?? p.idUsuario_Paciente}`);
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
                    {u?.nombre ?? '-'} {u?.paterno ?? ''} {u?.materno ?? ''}
                  </td>
                  <td className="p-2">{p.fechaIngreso ?? '-'}</td>
                  <td className="p-2">{u?.telefono ?? '-'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleEstado(p)}
                      className={`px-2 py-1 rounded text-xs ${
                        u?.estado ? 'bg-green-600' : 'bg-slate-600'
                      }`}
                    >
                      {u?.estado ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="p-2 space-x-2">
                    <button className="underline" onClick={() => ver(p)}>Ver</button>
                    <button className="underline" onClick={() => editar(p)}>Editar</button>
                    <button className="underline text-red-300" onClick={() => eliminar(p)}>Borrar</button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !loading && (
              <tr>
                <td className="p-3 opacity-70" colSpan={6}>
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal agregar */}
      <dialog open={open} className="backdrop:bg-black/50 rounded-md w-[720px]">
        <form onSubmit={crearPaciente} className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">Agregar Paciente</h2>

          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="CI"
              value={form.ci} onChange={(e) => onChange('ci', e.target.value)} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Nombre"
              value={form.nombre} onChange={(e) => onChange('nombre', e.target.value)} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Paterno"
              value={form.paterno ?? ''} onChange={(e) => onChange('paterno', e.target.value)} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Materno"
              value={form.materno ?? ''} onChange={(e) => onChange('materno', e.target.value)} />

            <label className="text-xs opacity-80 col-span-2">Fecha de nacimiento</label>
            <input type="date" className="px-3 py-2 rounded bg-white text-slate-900 col-span-2"
              value={form.fechaNacimiento ?? ''} onChange={(e) => onChange('fechaNacimiento', e.target.value)} />

            <select className="px-3 py-2 rounded bg-white text-slate-900"
              value={form.genero ?? 'M'} onChange={(e) => onChange('genero', e.target.value as 'M' | 'F')}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Teléfono"
              value={form.telefono ?? ''} onChange={(e) => onChange('telefono', e.target.value)} />

            <input className="px-3 py-2 rounded bg-white text-slate-900 col-span-2" placeholder="Correo"
              value={form.correo} onChange={(e) => onChange('correo', e.target.value)} />
            <input type="password" className="px-3 py-2 rounded bg-white text-slate-900 col-span-2" placeholder="Contraseña"
              value={form.contrasena} onChange={(e) => onChange('contrasena', e.target.value)} />

            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Código de seguro"
              value={form.codigoSeguro ?? ''} onChange={(e) => onChange('codigoSeguro', e.target.value)} />
            <input className="px-3 py-2 rounded bg-white text-slate-900" placeholder="Lugar de nacimiento"
              value={form.lugarNacimiento ?? ''} onChange={(e) => onChange('lugarNacimiento', e.target.value)} />

            <input className="px-3 py-2 rounded bg-white text-slate-900 col-span-2" placeholder="Domicilio"
              value={form.domicilio ?? ''} onChange={(e) => onChange('domicilio', e.target.value)} />

            <label className="text-xs opacity-80 col-span-2">Fecha de ingreso</label>
            <input type="date" className="px-3 py-2 rounded bg-white text-slate-900 col-span-2"
              value={form.fechaIngreso} onChange={(e) => onChange('fechaIngreso', e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">
              Cancelar
            </button>
            <button disabled={saving} className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700">
              {saving ? 'Guardando…' : 'Registrar'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
