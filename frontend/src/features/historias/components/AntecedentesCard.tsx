import React from 'react';

export default function AntecedentesCard({ texto }: { texto?: string | null }) {
  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
      <div className="text-emerald-300 font-semibold mb-2">Antecedentes Patológicos</div>
      <div className="text-slate-200 whitespace-pre-wrap min-h-[64px]">
        {texto || '—'}
      </div>
    </div>
  );
}
