import React from 'react';
import Modal from '@/shared/ui/Modal';
import { useEditarHistoria } from '../hooks/useEditarHistoria';
import type { HistoriaClinica } from '@/types/historia';

export default function EditHistoriaModal({
  open,
  onClose,
  initial,
  pacienteId,
  odontologoId,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial?: HistoriaClinica | null;
  pacienteId: number;
  odontologoId: number;
  onSaved: (hc: HistoriaClinica) => void;
}) {
  const { form, setField, saving, submit } = useEditarHistoria(initial ?? null, pacienteId, odontologoId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hc = await submit();
    onSaved(hc);
    onClose();
  }

  return (
    <Modal isOpen={open} onClose={onClose} title={`${initial ? 'Editar' : 'Crear'} Historia Clínica`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Motivo de consulta</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.motivoConsulta ?? ''}
              onChange={e => setField('motivoConsulta', e.target.value as any)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Signos vitales</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.signosVitales ?? ''}
              onChange={e => setField('signosVitales', e.target.value as any)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300">Antecedentes patológicos</label>
          <textarea
            className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 min-h-[72px]"
            value={form.antecedentesPatologicos ?? ''}
            onChange={e => setField('antecedentesPatologicos', e.target.value as any)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Examen clínico buco-dental</label>
            <textarea
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 min-h-[96px]"
              value={form.examenClinicoBucoDental ?? ''}
              onChange={e => setField('examenClinicoBucoDental', e.target.value as any)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Signos/síntomas dentales</label>
            <textarea
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 min-h-[96px]"
              value={form.descripcionSignosSintomasDentales ?? ''}
              onChange={e => setField('descripcionSignosSintomasDentales', e.target.value as any)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Enfermedad actual</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.enfermedadActual ?? ''}
              onChange={e => setField('enfermedadActual', e.target.value as any)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Observaciones</label>
            <input
              className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
              value={form.observaciones ?? ''}
              onChange={e => setField('observaciones', e.target.value as any)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-700 text-slate-100">
            Cancelar
          </button>
          <button disabled={saving} className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
