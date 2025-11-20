import { useEffect, useMemo, useState } from "react";
import PacienteSearchBar from "../components/PacienteSearchBar";
import DentalChart from "../components/DentalChart";
import ToothActionModal from "../components/ToothActionModal";
import IndicadoresSaludBucal, { type IndicadoresState } from "../components/IndicadoresSaludBucal";
import {
  getPacienteById,
  getPiezasPorPaciente,
  crearOdontograma,
  actualizarOdontograma,
  type PacienteLite,
  type PiezaDental,
  type Odontograma,
  fetchColoresPorPieza,
} from "../odontograma.service";
import type { ToothSegment } from "../components/ToothCell";

export default function OdontogramaPage() {
  const [paciente, setPaciente] = useState<PacienteLite | null>(null);
  const [piezas, setPiezas] = useState<PiezaDental[]>([]);
  const [piezaModal, setPiezaModal] = useState<PiezaDental | null>(null);
  const [indicadores, setIndicadores] = useState<IndicadoresState>(IndicadoresSaludBucal.initialValue);
  const [odo, setOdo] = useState<Odontograma | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [coloredByPos, setColoredByPos] = useState<Record<string, any>>({});
  const [segmentModal, setSegmentModal] = useState<ToothSegment | null>(null);
  const [creandoOdontograma, setCreandoOdontograma] = useState(false);

  const pacienteId = useMemo(() => paciente?.idUsuario_Paciente, [paciente]);

  // Cargar piezas y crear odontograma al seleccionar paciente
  useEffect(() => {
    let live = true;
    if (!pacienteId) return;

    (async () => {
      try {
        // 1. Cargar piezas existentes
        const list = await getPiezasPorPaciente(pacienteId);
        if (!live) return;
        setPiezas(list);

        // 2. Crear odontograma automáticamente si no existe
        if (!odo) {
          setCreandoOdontograma(true);
          const nuevoOdo = await crearOdontograma({
            idUsuario_Paciente: pacienteId,
            nombre: `Odontograma - ${paciente?.usuario?.nombre} ${paciente?.usuario?.paterno}`,
            descripcion: "Odontograma inicial",
            fecha: new Date().toISOString(),
          });
          if (live) {
            setOdo(nuevoOdo);
            console.log("Odontograma creado:", nuevoOdo);
          }
        }

        // 3. Cargar colores por zona
        const colored = await fetchColoresPorPieza(list);
        if (live) setColoredByPos(colored);
      } catch (error) {
        console.error("Error al inicializar:", error);
      } finally {
        if (live) setCreandoOdontograma(false);
      }
    })();

    return () => { live = false; };
  }, [pacienteId]);

  // Cargar datos completos del paciente
  async function handleSelect(p: PacienteLite | null) {
    if (!p) {
      setPaciente(null);
      setPiezas([]);
      setOdo(null);
      return;
    }
    const full = await getPacienteById(p.idUsuario_Paciente);
    setPaciente(full?.data ?? full ?? p);
  }

  async function guardarOdontograma() {
    if (!pacienteId || !odo?.idOdontograma) {
      alert("Primero selecciona un paciente");
      return;
    }

    setGuardando(true);
    try {
      const payload: Partial<Odontograma> = {
        descripcion,
        indicadores,
      };
      const upd = await actualizarOdontograma(odo.idOdontograma, payload);
      setOdo(upd);
      alert("Odontograma actualizado correctamente");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Buscar paciente */}
      <section className="bg-white/5 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Odontograma</h2>
          {paciente && (
            <div className="text-sm opacity-80">
              <span className="font-medium">
                {[paciente.usuario?.nombre, paciente.usuario?.paterno, paciente.usuario?.materno]
                  .filter(Boolean)
                  .join(" ")}
              </span>{" "}
              · CI {paciente.usuario?.ci ?? "-"}
            </div>
          )}
        </div>
        <PacienteSearchBar value={pacienteId ?? null} onSelect={handleSelect} />
        
        {creandoOdontograma && (
          <div className="mt-3 text-sm text-sky-400 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-400 border-t-transparent"></div>
            Creando odontograma...
          </div>
        )}
      </section>

      {/* Solo mostrar el resto si hay paciente Y odontograma */}
      {pacienteId && odo?.idOdontograma && (
        <>
          {/* Descripción */}
          <section className="bg-white/5 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <label className="text-sm text-slate-300">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 min-h-[70px]"
                  placeholder="Descripción del caso / notas del odontograma…"
                />
              </div>
              <div className="ml-4 text-sm opacity-70">{new Date().toLocaleDateString()}</div>
            </div>
          </section>

          {/* Mapa de piezas */}
          <section className="bg-white/5 rounded-xl p-4 border border-slate-700">
            <DentalChart
              piezas={piezas}
              coloredByPos={coloredByPos}
              onClickPieza={(p) => {
                setSegmentModal(null);
                setPiezaModal(p);
              }}
              onClickZona={(p, seg) => {
                setSegmentModal(seg);
                setPiezaModal(p);
              }}
            />
          </section>

          {/* Indicadores */}
          <IndicadoresSaludBucal value={indicadores} onChange={setIndicadores} />

          {/* Botón guardar */}
          <div className="flex justify-end gap-2">
            <button
              onClick={guardarOdontograma}
              disabled={guardando}
              className="px-4 py-2 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white disabled:opacity-50"
            >
              {guardando ? "Guardando…" : "Guardar odontograma"}
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      <ToothActionModal
        open={!!piezaModal}
        onClose={() => { setPiezaModal(null); setSegmentModal(null); }}
        piezaBase={piezaModal}
        pacienteId={pacienteId ?? 0}
        odontogramaId={odo?.idOdontograma ?? null}
        segment={segmentModal}
        onSaved={async (saved) => {
          setPiezas((old) => {
            const i = old.findIndex((x) => x.posicion === saved.posicion);
            if (i >= 0) {
              const copy = [...old];
              copy[i] = { ...copy[i], ...saved };
              return copy;
            }
            return [...old, saved];
          });

          const colored = await fetchColoresPorPieza([saved, ...piezas.filter(p => p.posicion !== saved.posicion)]);
          setColoredByPos((prev) => ({ ...prev, ...colored }));
        }}
      />
    </div>
  );
}