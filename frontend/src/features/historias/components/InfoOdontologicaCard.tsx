import React from 'react';

export default function InfoOdontologicaCard({
  examen,
  signos,
  enfermedadActual,
}: {
  examen?: string | null;
  signos?: string | null;
  enfermedadActual?: string | null;
}) {
  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700 space-y-3">
      <div>
        <div className="text-emerald-300 font-semibold mb-1">Examen Clínico Buco-Dental</div>
        <div className="text-slate-200 whitespace-pre-wrap">{examen || '—'}</div>
      </div>
      <div>
        <div className="text-emerald-300 font-semibold mb-1">Signos / Síntomas Dentales</div>
        <div className="text-slate-200 whitespace-pre-wrap">{signos || '—'}</div>
      </div>
      <div>
        <div className="text-emerald-300 font-semibold mb-1">Enfermedad Actual</div>
        <div className="text-slate-200 whitespace-pre-wrap">{enfermedadActual || '—'}</div>
      </div>
    </div>
  );
}
