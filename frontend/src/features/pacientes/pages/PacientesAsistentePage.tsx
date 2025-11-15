// src/features/pacientes/pages/PacientesAdminListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Modal from '@/shared/ui/Modal';
import { getUsuario } from '@/features/personal/personal.service';
import { Eye } from 'lucide-react';
// importando services
import { listarPacientes, actualizarEstadoUsuario, registrarPaciente } from '@/features/pacientes/pacientes.service';

// Asumiendo que tienes este interface disponible (lo importas si es necesario)
export interface Paciente {
  idUsuario_Paciente: number;
  codigoSeguro?: string | null;
  lugarNacimiento?: string | null;
  domicilio?: string | null;
  fechaIngreso?: string | null;
  usuario: {
    idUsuario: number;
    ci: string;
    nombre: string;
    paterno: string;
    materno?: string | null;
    correo: string;
    telefono: string;
    estado: boolean;
    fechaNacimiento?: string | null;
    genero?: 'M' | 'F' | 'Otro';
  };
}

type RegisterBody = {
  nombre: string;
  paterno: string;
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
  const [items, setItems] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
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
  const [detail, setDetail] = useState<Paciente | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  function onChange<K extends keyof RegisterBody>(k: K, v: RegisterBody[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function cargar() {
    setLoading(true);
    try {
      const { data } = await listarPacientes();
      const arr = (data?.data ?? data) as Paciente[];
      // Filtrar duplicados por ID para evitar keys no únicas
      const uniqueArr = Array.from(new Map(arr.map(item => [item.idUsuario_Paciente, item])).values());
      setItems(uniqueArr);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const rows = useMemo(() => {
    let lista = [...items];

    // filtro de estados
    if (filtroEstado !== 'todos') {
      const estadoBool = filtroEstado === 'activo';
      lista = lista.filter((p) => p.usuario?.estado === estadoBool);
    }
    // filtro de busqueda
    const q = search.trim().toLowerCase();
    if (q) {
      lista = lista.filter((p) => {
        const u = p.usuario;
        return [u?.ci, u?.nombre, u?.paterno, u?.correo, u?.telefono]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      });
    }
    return lista;
  }, [items, filtroEstado, search]);

  async function toggleEstado(p: Paciente) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    const nuevo = !(p.usuario?.estado ?? false);
    await actualizarEstadoUsuario(idU, nuevo);
    setItems((prev) =>
      prev.map((it) =>
        it.idUsuario_Paciente === p.idUsuario_Paciente
          ? { ...it, usuario: { ...it.usuario, estado: nuevo } }
          : it
      )
    );
  }

  async function crearPaciente(e: React.FormEvent) {
    e.preventDefault(); // pa que no se recargue
    setSaving(true);
    try {
      await registrarPaciente(form);
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

  // ---- Ver
  async function ver(p: Paciente) {
    const idU = p.usuario?.idUsuario ?? p.idUsuario_Paciente;
    if (!idU) return;
    const full = await getUsuario(idU);
    // Combinar datos de p (paciente) con full (usuario) para incluir domicilio, etc.
    const combinedDetail: Paciente = {
      ...p,
      usuario: {
        ...p.usuario,
        ...full?.data, // Sobreescribe con datos frescos de getUsuario
      },
    };
    setDetail(combinedDetail);
    setViewOpen(true);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Pacientes</h1>
          <p className="text-sm opacity-70">Lista, búsqueda, alta y cambio de estado.</p>
        </div>

        <div className="w-fit">
          <label htmlFor="filtro" className="text-sm font-medium mr-2 text-white">Elige Estado</label>
          <select
            id="filtro"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'activo' | 'inactivo')}
            className="px-3 py-1 rounded bg-blue text-sm bg-teal-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-700"
          >
            <option value="todos">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
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
              const u = p.usuario ?? ({} as Paciente['usuario']);
              return (
                <tr key={p.idUsuario_Paciente} className="border-t border-white/10">
                  <td className="p-2">{u?.ci ?? '-'}</td>
                  <td className="p-2">
                    {[u?.nombre, u?.paterno, u?.materno].filter(Boolean).join(' ') || '-'}
                  </td>
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
                    <button
                      onClick={() => navigate(`/pacientes/historial/${p.idUsuario_Paciente}`)}
                      className="px-2 py-1 rounded text-xs bg-teal-700" // Color fijo, no depende de estado
                    >
                      Historial Clinico
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

      {/* Modal agregar (usando Modal component para consistencia) */}
      <Modal open={open} onClose={() => setOpen(false)} title="Agregar Paciente">
        <form onSubmit={crearPaciente} className="p-5 space-y-3">
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
      </Modal>

      {/* VER */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Detalle de paciente" >
        {!detail ? (
          <div>Cargando…</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="font-medium">CI:</span> {detail.usuario?.ci ?? '-'}</div>
            <div><span className="font-medium">Nombre:</span> {detail.usuario?.nombre ?? '-'}</div>
            <div><span className="font-medium">Paterno:</span> {detail.usuario?.paterno ?? '-'}</div>
            <div><span className="font-medium">Materno:</span> {detail.usuario?.materno ?? '-'}</div>
            <div><span className="font-medium">Nacimiento:</span> {detail.usuario?.fechaNacimiento?.slice(0, 10) ?? '-'}</div>
            <div><span className="font-medium">Género:</span> {detail.usuario?.genero ?? '-'}</div>
            <div><span className="font-medium">Teléfono:</span> {detail.usuario?.telefono ?? '-'}</div>
            <div><span className="font-medium">Correo:</span> {detail.usuario?.correo ?? '-'}</div>
            <div><span className="font-medium">Código Seguro:</span> {detail.codigoSeguro ?? '-'}</div>
            <div><span className="font-medium">Lugar Nacimiento:</span> {detail.lugarNacimiento ?? '-'}</div>
            <div className="col-span-2"><span className="font-medium">Dirección:</span> {detail.domicilio ?? '-'}</div>
            <div><span className="font-medium">Estado:</span> {detail.usuario?.estado ? 'Activo' : 'Inactivo'}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}