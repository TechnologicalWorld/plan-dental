import type { PacienteLite } from '../odontoPacientes.service';

type Props = {
  rows: PacienteLite[];
  page: number;
  lastPage: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
};

export default function BuscarPacienteResults({
  rows,
  page,
  lastPage,
  total,
  onPrev,
  onNext,
  loading,
}: Props) {
  return (
    <div className="space-y-3">
      {loading && <div className="text-sm opacity-80">Buscando…</div>}

      {!loading && rows.length === 0 && (
        <div className="text-sm opacity-80">Sin resultados.</div>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left">
                <th className="px-3 py-2 font-semibold">Nombre</th>
                <th className="px-3 py-2 font-semibold">CI</th>
                <th className="px-3 py-2 font-semibold">Teléfono</th>
                <th className="px-3 py-2 font-semibold">Correo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.idUsuario_Paciente} className="border-b border-white/10">
                  <td className="px-3 py-2">
                    {[p.nombre, p.paterno, p.materno].filter(Boolean).join(' ')}
                  </td>
                  <td className="px-3 py-2">{p.ci ?? '-'}</td>
                  <td className="px-3 py-2">{p.telefono ?? '-'}</td>
                  <td className="px-3 py-2">{p.correo ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-xs opacity-80">
        <div>Total: {total}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="px-2 py-1 rounded bg-white/10 disabled:opacity-40"
          >
            Anterior
          </button>
          <div>
            Página {page} de {lastPage}
          </div>
          <button
            onClick={onNext}
            disabled={page >= lastPage}
            className="px-2 py-1 rounded bg-white/10 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
