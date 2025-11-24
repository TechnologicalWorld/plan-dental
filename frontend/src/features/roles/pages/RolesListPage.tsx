import { useEffect, useState } from 'react';
import api from '@/shared/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

type RolRow = { clave: string; nombre: string; descripcion: string; cantidad: number };

export default function RolesListPage() {
  const [rows, setRows] = useState<RolRow[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function cargar() {
    setLoading(true);
    try {
      const [adminsR, odontosR, asisR, pacsR] = await Promise.all([
        api.get('/usuarios/administradores/listar'),
        api.get('/usuarios/odontologos/listar'),
        api.get('/usuarios/asistentes/listar'),
        api.get('/usuarios/pacientes/listar'),
      ]);

      const admins  = (adminsR.data?.data  ?? adminsR.data)  as unknown[];
      const odontos = (odontosR.data?.data ?? odontosR.data) as unknown[];
      const asis    = (asisR.data?.data    ?? asisR.data)    as unknown[];
      const pacs    = (pacsR.data?.data    ?? pacsR.data)    as unknown[];

      setRows([
        { clave: 'administrador', nombre: 'Administradores', descripcion: 'Acceso total al sistema',  cantidad: admins.length },
        { clave: 'odontologo',    nombre: 'Odontólogos',     descripcion: 'Atención clínica y agenda', cantidad: odontos.length },
        { clave: 'asistente',     nombre: 'Asistentes',      descripcion: 'Apoyo en citas y gestión',  cantidad: asis.length },
        { clave: 'paciente',      nombre: 'Pacientes',       descripcion: 'Usuarios atendidos',        cantidad: pacs.length },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const goTo = (clave: string) => {
    if (clave === 'odontologo') return navigate('/app/admin/usuarios/personal');
    if (clave === 'asistente')  return navigate('/app/admin/usuarios/personal');
    if (clave === 'paciente')   return navigate('/app/admin/usuarios/pacientes');
    if (clave === 'administrador') return alert('Lista de administradores aún no implementada.');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Gestión de Roles</h1>
        <p className="text-sm opacity-70">Resumen de distribución de usuarios por rol.</p>
      </header>

      {loading && <div className="opacity-70">Cargando…</div>}

      <div className="overflow-auto rounded border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-2">Rol</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-left p-2">Cantidad</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.clave} className="border-t border-white/10">
                <td className="p-2">{r.nombre}</td>
                <td className="p-2">{r.descripcion}</td>
                <td className="p-2">{r.cantidad}</td>
                <td className="p-2 space-x-2">
                  
                  <button title='Ver' onClick={() => goTo(r.clave)} className="p-1 rounded hover:bg-white/10">
                    <Eye size={16} />
                  </button>

                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 opacity-70">Sin datos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
