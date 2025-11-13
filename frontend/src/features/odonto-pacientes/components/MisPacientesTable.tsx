import type { PacienteLite } from '../odontoPacientes.service';

type Props = {
  rows: PacienteLite[];
};

export default function MisPacientesTable({ rows }: Props) {
  if (!rows.length) {
    return (
      <div className="p-4 text-sm opacity-80">
        No tienes pacientes asignados en tu agenda.
      </div>
    );
  }

  return (
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
  );
}
