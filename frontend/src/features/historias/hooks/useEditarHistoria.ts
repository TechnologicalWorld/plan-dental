import { useEffect, useState } from 'react';
import type { HistoriaClinica } from '@/types/historia';
import { createHistoria, updateHistoria } from '../historiaClinica.service';

function toForm(i?: HistoriaClinica | null): Partial<HistoriaClinica> {
  return {
    antecedentesPatologicos: i?.antecedentesPatologicos ?? '',
    motivoConsulta: i?.motivoConsulta ?? '',
    signosVitales: i?.signosVitales ?? '',
    descripcionSignosSintomasDentales: i?.descripcionSignosSintomasDentales ?? '',
    examenClinicoBucoDental: i?.examenClinicoBucoDental ?? '',
    observaciones: i?.observaciones ?? '',
    enfermedadActual: i?.enfermedadActual ?? '',
  };
}

export function useEditarHistoria(
  initial?: HistoriaClinica | null,
  pacienteId?: number,
  odontologoId?: number
) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<HistoriaClinica>>(() => toForm(initial));

  useEffect(() => {
    setForm(toForm(initial));
  }, [initial]);

  function setField<K extends keyof HistoriaClinica>(k: K, v: HistoriaClinica[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(): Promise<HistoriaClinica> {
    setSaving(true);
    try {
      if (initial?.idHistoriaClinica) {
        // editar
        const updated = await updateHistoria(initial.idHistoriaClinica, form);
        return updated;
      } else {
        // crear
        const payload = {
          ...form,
          idUsuario_Paciente: pacienteId!,
          idUsuario_Odontologo: odontologoId!,
        };
        const created = await createHistoria(payload);
        return created;
      }
    } finally {
      setSaving(false);
    }
  }

  return { form, setField, saving, submit };
}
