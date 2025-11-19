import React from 'react';
import type { PacienteMin } from '@/types/historia';

function edad(fechaIso?: string) {
  if (!fechaIso) return '-';
  const d = new Date(fechaIso);
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export default function HistoriaHeader({
  paciente,
  onVerOdontograma,
}: {
  paciente: PacienteMin;
  onVerOdontograma?: () => void;
}) {
  const u = paciente.usuario;
  return (
    <div className="flex items-center justify-between bg-slate-800 text-slate-100 rounded-xl px-4 py-3 shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-600" />
        <div>
          <div className="font-semibold">{u.nombre} {u.paterno} {u.materno}</div>
          <div className="text-sm opacity-80">{u.ci} · {edad(u.fechaNacimiento)} años</div>
        </div>
      </div>
      <button
        onClick={onVerOdontograma}
        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
      >
        Odontograma actual
      </button>
    </div>
  );
}
