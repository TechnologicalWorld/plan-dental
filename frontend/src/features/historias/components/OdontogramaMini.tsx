import React from 'react';
import type { OdontogramaMin, PiezaDentalMin } from '@/types/historia';

export default function OdontogramaMini({
  odontograma,
  piezas,
}: {
  odontograma: OdontogramaMin | null;
  piezas: PiezaDentalMin[];
}) {
  const byCuadrante = {
    supDer: piezas.filter(p => ['18','17','16','15','14','13','12','11'].includes(p.posicion)),
    supIzq: piezas.filter(p => ['21','22','23','24','25','26','27','28'].includes(p.posicion)),
    infDer: piezas.filter(p => ['48','47','46','45','44','43','42','41'].includes(p.posicion)),
    infIzq: piezas.filter(p => ['31','32','33','34','35','36','37','38'].includes(p.posicion)),
  };
  const Pill = ({estado}:{estado:string})=>(
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-100">{estado}</span>
  );

  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="text-emerald-300 font-semibold">Odontograma</div>
        {odontograma && <div className="text-xs text-slate-400">{new Date(odontograma.fecha).toLocaleDateString()}</div>}
      </div>

      {!odontograma ? (
        <div className="text-slate-400">Sin odontograma asociado</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-slate-100">
          {Object.entries(byCuadrante).map(([q, arr])=>(
            <div key={q} className="border border-slate-700 rounded-lg p-2">
              <div className="text-xs text-slate-400 mb-1">
                {q === 'supDer' && 'Superior Derecho'}
                {q === 'supIzq' && 'Superior Izquierdo'}
                {q === 'infDer' && 'Inferior Derecho'}
                {q === 'infIzq' && 'Inferior Izquierdo'}
              </div>
              <div className="flex flex-wrap gap-1">
                {arr.map(p=>(
                  <div key={p.idPieza} className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700">
                    <div className="text-xs">{p.posicion}</div>
                    <Pill estado={p.estado} />
                  </div>
                ))}
                {!arr.length && <div className="text-slate-500 text-xs">—</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
