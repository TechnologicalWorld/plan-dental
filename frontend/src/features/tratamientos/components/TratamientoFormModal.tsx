import { useEffect, useMemo, useState } from "react";
import apiClient from "@/shared/api/apiClient";
import {
  createTratamiento,
  updateTratamiento,
  Tratamiento,
} from "../tratamientos.service";

type Props = {
  open: boolean;
  initialData?: Tratamiento;
  onClose: () => void;
  onSaved: () => void;
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
  initialData,
  onClose,
  onSaved,
}: Props) {
  const isEdit = !!initialData;

  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [precio, setPrecio] = useState(String(initialData?.precio ?? ""));
  const [idCita, setIdCita] = useState<number | "">(
    initialData?.idCita ?? ""
  );

  const [citas, setCitas] = useState<CitaLite[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNombre(initialData?.nombre ?? "");
      setPrecio(String(initialData?.precio ?? ""));
      setIdCita(initialData?.idCita ?? "");
      setErr(null);
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoadingCitas(true);
      try {
        const resp = await apiClient.get<{ success: boolean; data: CitaLite[] }>(
          "/citas"
        );
        setCitas(resp.data.data || []);
      } catch (e) {
        // si falla, dejamos arreglo vacío
        setCitas([]);
      } finally {
        setLoadingCitas(false);
      }
    };
    load();
  }, [open]);

  const citasOptions = useMemo(() => {
    return citas.map((c) => {
      const paciente =
        c.pacientes?.[0]?.usuario
          ? `${c.pacientes[0].usuario.nombre} ${c.pacientes[0].usuario.paterno || ""}`.trim()
          : "—";
      return {
        id: c.idCita,
        label: `${(c.fecha ?? "").slice(0, 10)} — ${c.tipoCita ?? ""} — ${paciente}`,
      };
    });
  }, [citas]);

  const canSave =
    nombre.trim().length > 0 &&
    !Number.isNaN(parseFloat(precio)) &&
    precio !== "" &&
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
      if (isEdit && initialData) {
        await updateTratamiento(initialData.idTratamiento, {
          nombre: nombre.trim(),
          precio: parseFloat(precio),
          idCita: Number(idCita),
        });
      } else {
        await createTratamiento({
          nombre: nombre.trim(),
          precio: parseFloat(precio),
          idCita: Number(idCita),
        });
      }
      onSaved();
    } catch (e: any) {
      setErr("No se pudo guardar. Revisa que el nombre sea único.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Editar tratamiento" : "Nuevo tratamiento"}
          </h2>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg hover:bg-slate-800"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {err && (
            <div className="text-rose-300 text-sm border border-rose-600/40 bg-rose-900/20 rounded-lg px-3 py-2">
              {err}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-slate-300">Nombre</label>
            <input
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
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
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300">Cita</label>
            <select
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              value={idCita}
              onChange={(e) => setIdCita(e.target.value === "" ? "" : Number(e.target.value))}
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

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSave || saving}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
