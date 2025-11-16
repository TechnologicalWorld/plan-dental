import { useState } from "react";
import { actualizarCita } from "@/features/citas/citas.service";
import type { Cita, CitaUpdatePayload } from "@/types/cita";

type Props = {
  cita: Cita;
  onClose: () => void;
  onUpdate: (c: Cita) => void;
};

export default function ModalEditarCita({ cita, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<CitaUpdatePayload>({
    fecha: cita.fecha,
    hora: cita.hora,
    tipoCita: cita.tipoCita,
    costo: Number(cita.costo),
    estado: cita.estado,
    pagado: cita.pagado,
    idUsuario_Paciente: cita.pacientes?.[0]?.idUsuario_Paciente,
    idUsuario_Odontologo: cita.odontologos?.[0]?.idUsuario_Odontologo,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await actualizarCita(cita.idCita, form);
      if (updated) {
        onUpdate(updated);
        alert("Cita actualizada correctamente");
      } else {
        alert("No se pudo actualizar la cita");
      }
    } catch (error: any) {
      alert("Error: " + (error.message ?? error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-trasparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl  max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-teal-700 mb-4">Editar Cita</h2>
        <form onSubmit={handleSubmit} className="space-y-3 ">
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="w-full px-3 py-2 border rounded  text-gray-800"
            required
          />
          <input
            type="time"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
            className="w-full px-3 py-2 border rounded text-gray-800 "
            required
          />
          <input
            type="text"
            value={form.tipoCita}
            onChange={(e) => setForm({ ...form, tipoCita: e.target.value })}
            placeholder="Tipo de Cita"
            className="w-full px-3 py-2 border rounded text-gray-800"
            required
          />
          <input
            type="number"
            value={form.costo}
            onChange={(e) => setForm({ ...form, costo: Number(e.target.value) })}
            placeholder="Costo"
            className="w-full px-3 py-2 border rounded text-gray-800"
            required
          />
          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            className="w-full px-3 py-2 border rounded text-gray-800"
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <div className="flex justify-end gap-2 pt-4 text-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
