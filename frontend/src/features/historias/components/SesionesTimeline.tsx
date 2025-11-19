import React from 'react';
import type { SesionMin, EvolucionMin } from '@/types/historia';

type Item = { fecha: string; titulo: string; detalle?: string };

export default function SesionesTimeline({
  sesiones,
  evoluciones,
}: {
  sesiones?: SesionMin[] | null;
  evoluciones?: EvolucionMin[] | null;
}) {
  const items: Item[] = [];
  (sesiones ?? []).forEach(s => items.push({ fecha: s.fecha, titulo: s.nombre, detalle: s.descripcion ?? s.observacion ?? '' }));
  (evoluciones ?? []).forEach(e => items.push({
    fecha: e.fecha,
    titulo: e.tratamiento?.nombre ?? 'Evolución',
    detalle: `${e.diagnosticoCIE ?? ''} ${e.procedimientoIndicacion ?? ''}`.trim(),
  }));
  items.sort((a,b)=> new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700 h-full overflow-auto">
      <div className="text-emerald-300 font-semibold mb-2">Todas las sesiones</div>
      <ul className="space-y-3">
        {items.map((it, idx)=>(
          <li key={idx} className="border-l-2 border-slate-600 pl-3">
            <div className="text-sm text-slate-400">{new Date(it.fecha).toLocaleDateString()}</div>
            <div className="text-slate-100 font-medium">{it.titulo}</div>
            {it.detalle && <div className="text-slate-300 text-sm">{it.detalle}</div>}
          </li>
        ))}
        {!items.length && <div className="text-slate-400">Sin registros</div>}
      </ul>
    </div>
  );
}
