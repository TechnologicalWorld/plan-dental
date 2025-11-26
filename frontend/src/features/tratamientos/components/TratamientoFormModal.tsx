import { useEffect, useMemo, useState } from "react";
import apiClient from "@/shared/api/apiClient";
import Modal from "@/shared/ui/Modal";
import type { Tratamiento } from "@/types/tratamiento";

type Props = {
  open: boolean;
  defaultValues?: Tratamiento | undefined;
  onClose: () => void;
  onSubmit: (payload: { nombre: string; precio: number; idCita: number }) => Promise<void> | void;
};

type CitaLite = {
  idCita: number;
  fecha: string;
  tipoCita: string;
  pacientes?: Array<{
    usuario?: { nombre: string; paterno?: string };
  }>;
};

export function TratamientoFormModal({
  open,
  defaultValues,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = !!defaultValues;

  const [nombre, setNombre] = useState<string>(defaultValues?.nombre ?? "");
  const [precio, setPrecio] = useState<string>(
    defaultValues?.precio != null ? String(defaultValues.precio) : ""
  );
  const [idCita, setIdCita] = useState<number | "">(
    defaultValues?.idCita ?? ""
  );

  const [citas, setCitas] = useState<CitaLite[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNombre(defaultValues?.nombre ?? "");
      setPrecio(
        defaultValues?.precio != null ? String(defaultValues.precio) : ""
      );
      setIdCita(defaultValues?.idCita ?? "");
      setErr(null);
    }
  }, [open, defaultValues]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoadingCitas(true);
      try {
        const resp = await apiClient.get<{ success: boolean; data: CitaLite[] }>(
          "/citas"
        );
        setCitas(resp.data.data || []);
      } catch {
        setCitas([]);
      } finally {
        setLoadingCitas(false);
      }
    };
    load();
  }, [open]);

  const citasOptions = useMemo(
    () =>
      citas.map((c) => {
        const paciente = c.pacientes?.[0]?.usuario
          ? `${c.pacientes[0].usuario.nombre} ${
              c.pacientes[0].usuario.paterno || ""
            }`.trim()
          : "—";
        return {
          id: c.idCita,
          label: `${(c.fecha ?? "").slice(0, 10)} — ${
            c.tipoCita ?? ""
          } — ${paciente}`,
        };
      }),
    [citas]
  );

  const canSave =
    nombre.trim().length > 0 &&
    precio !== "" &&
    !Number.isNaN(parseFloat(precio)) &&
    idCita !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) {
      setErr("Completa nombre, precio y cita.");
      return;
    }

    setSaving(true);
    setErr(null);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        idCita: Number(idCita),
      });
      onClose();
    } catch (e: any) {
      setErr(
        e?.message || "No se pudo guardar el tratamiento. Inténtalo de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar tratamiento" : "Nuevo tratamiento"}
      widthClass="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && (
          <div className="text-rose-300 text-sm border border-rose-600/40 bg-rose-900/20 rounded-lg px-3 py-2">
            {err}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Nombre</label>
          <input
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 text-slate-100 placeholder:text-slate-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Precio (Bs.)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 text-slate-100 placeholder:text-slate-500"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300">Cita</label>
          <select
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 text-slate-100"
            value={idCita}
            onChange={(e) =>
              setIdCita(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          >
            <option value="" disabled>
              {loadingCitas ? "Cargando citas…" : "Selecciona una cita"}
            </option>
            {citasOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSave || saving}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving
              ? "Guardando…"
              : isEdit
              ? "Guardar cambios"
              : "Crear tratamiento"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
