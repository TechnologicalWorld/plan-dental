import { useEffect, useMemo, useState } from "react";
import Modal from "@/shared/ui/Modal";
import {
  listarTratamientos,
  listarAcciones,
  upsertPieza,
  asignarPiezasATratamiento,
  crearDetalleDental,
  type PiezaDental,
  type TratamientoLite,
  type AccionLite,
} from "../odontograma.service";
import type { ToothSegment } from "./ToothCell";

function segToCuadrante(seg?: ToothSegment): string {
  switch (seg) {
    case "TOP": return "1";
    case "RIGHT": return "2";
    case "BOTTOM": return "3";
    case "LEFT": return "4";
    case "CENTER": return "5";
    default: return "1";
  }
}

// Colores para cada acción 
const accionColors: Record<string, string> = {
  "Caries": "#EF4444",          // rojo
  "Obturación": "#3B82F6",      // azul
  "Corona": "#EAB308",          // amarillo
  "Extracción": "#8B5CF6",      // violeta
  "Endodoncia": "#EC4899",      // rosa
  "Implante": "#06B6D4",        // cyan
  "Limpieza": "#10B981",        // verde
};

export default function ToothActionModal({
  open,
  onClose,
  piezaBase,
  pacienteId,
  odontogramaId,
  segment,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  piezaBase: PiezaDental | null;
  pacienteId: number;
  odontogramaId?: number | null;
  segment?: ToothSegment | null;
  onSaved: (pieza: PiezaDental) => void;
}) {
  const [tratamientos, setTratamientos] = useState<TratamientoLite[]>([]);
  const [acciones, setAcciones] = useState<AccionLite[]>([]);

  const [observacion, setObservacion] = useState<string>("");
  const [seleccionTrat, setSeleccionTrat] = useState<number[]>([]);
  const [accionId, setAccionId] = useState<number | "">("");

  const [saving, setSaving] = useState(false);

  const zonaLabel = useMemo(() => {
    if (!segment) return "Diente completo";
    const labels: Record<ToothSegment, string> = {
      TOP: "OCLUSAL/INCISAL",
      RIGHT: "DISTAL",
      BOTTOM: "LINGUAL/PALATINA",
      LEFT: "MESIAL",
      CENTER: "CENTRO/CÁMARA"
    };
    return labels[segment] || segment;
  }, [segment]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const [t, a] = await Promise.all([listarTratamientos(), listarAcciones()]);
      setTratamientos(t ?? []);
      setAcciones(a ?? []);
    })();
  }, [open]);

  useEffect(() => {
    if (!open || !piezaBase) return;
    setObservacion(piezaBase.observacion ?? "");
    setSeleccionTrat([]);
    setAccionId("");
  }, [open, piezaBase]);

  function toggleTrat(id: number) {
    setSeleccionTrat((old) => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }

  async function handleSave() {
    if (!piezaBase) return;
    
    // Validación básica
    if (!accionId && seleccionTrat.length === 0) {
        alert("Debes seleccionar al menos una acción o tratamiento");
        return;
    }

    setSaving(true);
    try {
        // 1. Crear o actualizar la pieza dental
        const piezaPayload: Partial<PiezaDental> = {
        idPieza: piezaBase.idPieza,
        posicion: piezaBase.posicion,
        nombre: piezaBase.nombre,
        tipo: piezaBase.tipo || "Permanente",
        estado: piezaBase.estado || "Sano",
        idOdontograma: odontogramaId,
        };

        // Solo agregar observación si hay contenido
        if (observacion?.trim()) {
        piezaPayload.observacion = observacion.trim();
        }

        const saved = await upsertPieza(piezaPayload);

        // 2. Asignar tratamientos si hay selección
        if (saved?.idPieza && seleccionTrat.length > 0) {
        const promises = seleccionTrat.map(idT => 
            asignarPiezasATratamiento(idT, [saved.idPieza!])
        );
        await Promise.all(promises);
        }

        // 3. Crear detalle dental si hay acción seleccionada
        if (saved?.idPieza && typeof accionId === "number") {
        const detallePayload = {
            idAccion: accionId,
            idPiezaDental: saved.idPieza,
            descripcion: observacion?.trim() || `${segment || "Diente completo"} - Pieza ${saved.posicion}`,
            fecha: new Date().toISOString().slice(0, 10),
            cuadrante: segToCuadrante(segment ?? undefined),
        };
        await crearDetalleDental(detallePayload);
        }

        // 4. Notificar éxito
        onSaved(saved);
        onClose();
    } catch (error: any) {
        console.error("Error completo:", error);
        const mensaje = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "Error desconocido";
        
        alert(`Error al guardar: ${mensaje}`);
    } finally {
        setSaving(false);
    }
    }

  const accionSeleccionada = acciones.find(a => a.idAccion === accionId);

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={`Pieza ${piezaBase?.posicion ?? ""} · Zona: ${zonaLabel}`}
    >
      <div className="space-y-6">
        {/* Acción / Diagnóstico */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Acción / Diagnóstico</h3>
          <div className="grid grid-cols-2 gap-3">
            {acciones.map((accion) => {
              const borderColor = accionColors[accion.nombre] || "#64748B";
              const isSelected = accionId === accion.idAccion;
              
              return (
                <button
                  key={accion.idAccion}
                  onClick={() => setAccionId(accion.idAccion)}
                  className={`
                    relative px-4 py-3 rounded-lg text-sm font-medium text-white
                    transition-all duration-200
                    ${isSelected 
                      ? 'bg-slate-700 ring-2 ring-sky-500' 
                      : 'bg-slate-800 hover:bg-slate-700'
                    }
                  `}
                  style={{
                    borderLeft: `4px solid ${borderColor}`
                  }}
                >
                  {accion.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tratamientos */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Tratamientos (puedes seleccionar varios)
          </h3>
          <div className="max-h-56 overflow-auto rounded-lg border border-slate-700 bg-slate-800/50">
            {tratamientos.map((t) => {
              const isSelected = seleccionTrat.includes(t.idTratamiento);
              return (
                <label 
                  key={t.idTratamiento} 
                  className={`
                    flex items-center justify-between px-4 py-3 cursor-pointer
                    border-b border-slate-700 last:border-b-0
                    transition-colors duration-150
                    ${isSelected ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleTrat(t.idTratamiento)}
                      className="w-4 h-4 rounded border-slate-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-200">{t.nombre}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Bs. {Number(t.precio || 0).toFixed(2)}
                  </span>
                </label>
              );
            })}
            {!tratamientos.length && (
              <div className="text-xs text-slate-400 text-center py-6">
                No hay tratamientos disponibles
              </div>
            )}
          </div>
        </div>

        {/* Observación */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Observación</h3>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-slate-100 text-sm min-h-[100px] focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder:text-slate-500"
            placeholder="Ingrese comentarios sobre este diagnóstico..."
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            {saving ? "Guardando…" : "Agregar al odontograma"}
          </button>
        </div>
      </div>
    </Modal>
  );
}