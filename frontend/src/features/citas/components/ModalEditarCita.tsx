// src/features/citas/components/ModalEditarCita.tsx
import { useState } from "react";
import { actualizarCita } from "@/features/citas/citas.service";
import type { Cita } from "@/types/cita";

export type CitaUpdatePayload = Partial<{
  hora: string;
  fecha: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  tipoCita: string;
  costo: number;
  pagado: boolean;
  observacion?: string;
}>;

type Props = {
  cita: Cita;
  onClose: () => void;
  onUpdate: (c: Cita) => void;
};

export default function ModalEditarCita({ cita, onClose, onUpdate }: Props) {
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const formatTimeForInput = (timeStr: string) => {
    if (!timeStr) return "";
    const time = new Date(timeStr);
    return isNaN(time.getTime()) ? "" : time.toTimeString().slice(0, 5);
  };

  const [form, setForm] = useState<CitaUpdatePayload>({
    fecha: formatDateForInput(cita.fecha),
    hora: formatTimeForInput(cita.hora),
    tipoCita: cita.tipoCita,
    costo: Number(cita.costo),
    estado: cita.estado ,
    pagado: cita.pagado,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fecha || !form.hora) {
      alert("Fecha y hora son obligatorias");
      return;
    }

    setLoading(true);
    try {
      const updated = await actualizarCita(cita.idCita, form);
      if (updated) {
        const citaActualizada: Cita = {
          ...cita, 
          ...updated, 
        };
        onUpdate(citaActualizada);
        alert("Cita actualizada correctamente");
      } else {
        alert("No se pudo actualizar la cita");
      }
    } catch (error: any) {
      alert("Error: " + (error.message ?? "Desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-teal-700 mb-4">Editar Cita</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cita</label>
            <input
              type="text"
              value={form.tipoCita}
              onChange={(e) => setForm({ ...form, tipoCita: e.target.value })}
              placeholder="Ej: Limpieza, Ortodoncia"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo (Bs.)</label>
            <input
              type="number"
              value={form.costo}
              onChange={(e) => setForm({ ...form, costo: Number(e.target.value) })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-800"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.pagado}
                onChange={(e) => setForm({ ...form, pagado: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              Pagado
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {loading ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}