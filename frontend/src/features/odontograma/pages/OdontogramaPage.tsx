import { useEffect, useMemo, useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
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

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e40af',
    borderBottom: '2 solid #1e40af',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    flex: 1,
  },
  imageContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  dentalImage: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'contain',
  },
  // Estilos para mapa dental
  dentalMapContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  dentalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1 solid #cbd5e1',
  },
  dentalRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  toothContainer: {
    alignItems: 'center',
    width: 30,
  },
  toothCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    border: '2 solid #64748b',
    marginBottom: 3,
    position: 'relative',
  },
  toothNumber: {
    fontSize: 8,
    color: '#475569',
    textAlign: 'center',
  },
  toothSegment: {
    position: 'absolute',
  },
  indicadoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  indicadorBox: {
    width: '30%',
    padding: 8,
    border: '1 solid #ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  indicadorTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#0ea5e9',
  },
  indicadorItem: {
    fontSize: 9,
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTop: '1 solid #ddd',
    paddingTop: 5,
  },
  descripcion: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
  }
});

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

// Componente para renderizar un diente en el PDF con 5 secciones
const ToothPDF = ({ 
  number, 
  coloredSegments 
}: { 
  number: string; 
  coloredSegments?: ColoredSegments 
}) => {
  const defaultColor = '#f1f5f9';
  
  return (
    <View style={styles.toothContainer}>
      <View style={styles.toothCircle}>
        {/* TOP - Cuadrante superior */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: '25%',
          right: '25%',
          height: '35%',
          backgroundColor: coloredSegments?.TOP || defaultColor,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }} />
        
        {/* RIGHT - Cuadrante derecho */}
        <View style={{
          position: 'absolute',
          right: 0,
          top: '25%',
          bottom: '25%',
          width: '35%',
          backgroundColor: coloredSegments?.RIGHT || defaultColor,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
        }} />
        
        {/* BOTTOM - Cuadrante inferior */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: '25%',
          right: '25%',
          height: '35%',
          backgroundColor: coloredSegments?.BOTTOM || defaultColor,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }} />
        
        {/* LEFT - Cuadrante izquierdo */}
        <View style={{
          position: 'absolute',
          left: 0,
          top: '25%',
          bottom: '25%',
          width: '35%',
          backgroundColor: coloredSegments?.LEFT || defaultColor,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        }} />
        
        {/* CENTER - Centro del círculo */}
        <View style={{
          position: 'absolute',
          top: '35%',
          left: '35%',
          right: '35%',
          bottom: '35%',
          backgroundColor: coloredSegments?.CENTER || defaultColor,
          borderRadius: 3,
        }} />
        
        {/* Bordes del círculo */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 12,
          border: '1.5 solid #64748b',
        }} />
        
        {/* Borde del centro */}
        <View style={{
          position: 'absolute',
          top: '35%',
          left: '35%',
          right: '35%',
          bottom: '35%',
          borderRadius: 3,
          border: '1 solid #64748b',
        }} />
      </View>
      <Text style={styles.toothNumber}>{number}</Text>
    </View>
  );
};

// Componente del documento PDF
const OdontogramaPDF = ({ 
  paciente, 
  descripcion, 
  indicadores,
  coloredByPos,
  piezas
}: { 
  paciente: PacienteLite; 
  descripcion: string; 
  indicadores: IndicadoresState;
  coloredByPos?: Record<string, ColoredSegments>;
  piezas: PiezaDental[];
}) => {
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const nombreCompleto = [
    paciente?.usuario?.nombre,
    paciente?.usuario?.paterno,
    paciente?.usuario?.materno
  ].filter(Boolean).join(" ");

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>ODONTOGRAMA</Text>
          <Text style={styles.subtitle}>{fechaActual}</Text>
        </View>

        {/* Datos del Paciente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL PACIENTE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{nombreCompleto}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CI:</Text>
            <Text style={styles.value}>{paciente?.usuario?.ci || "N/A"}</Text>
          </View>
          {paciente?.usuario?.telefono && (
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{paciente.usuario.telefono}</Text>
            </View>
          )}
        </View>

        {/* Descripción */}
        {descripcion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESCRIPCIÓN</Text>
            <Text style={styles.descripcion}>{descripcion}</Text>
          </View>
        )}

        {/* Mapa Dental con Leyenda */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAPA DENTAL</Text>
          
          {/* Leyenda de colores */}
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: 8, 
            marginBottom: 10,
            padding: 8,
            backgroundColor: '#f8fafc',
            borderRadius: 4 
          }}>
            {Object.entries(accionColors).map(([accion, color]) => (
              <View key={accion} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: color,
                  borderRadius: 2,
                  border: '1 solid #94a3b8'
                }} />
                <Text style={{ fontSize: 8, color: '#475569' }}>{accion}</Text>
              </View>
            ))}
          </View>

          <View style={styles.dentalMapContainer}>
            {/* Dientes superiores */}
            <View style={styles.dentalRow}>
              {/* Superior derecho */}
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {["18","17","16","15","14","13","12","11"].map(num => (
                  <ToothPDF 
                    key={num} 
                    number={num} 
                    coloredSegments={coloredByPos?.[num]} 
                  />
                ))}
              </View>
              
              {/* Superior izquierdo */}
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {["21","22","23","24","25","26","27","28"].map(num => (
                  <ToothPDF 
                    key={num} 
                    number={num} 
                    coloredSegments={coloredByPos?.[num]} 
                  />
                ))}
              </View>
            </View>

            {/* Dientes inferiores */}
            <View style={styles.dentalRowBottom}>
              {/* Inferior derecho */}
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {["48","47","46","45","44","43","42","41"].map(num => (
                  <ToothPDF 
                    key={num} 
                    number={num} 
                    coloredSegments={coloredByPos?.[num]} 
                  />
                ))}
              </View>
              
              {/* Inferior izquierdo */}
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {["31","32","33","34","35","36","37","38"].map(num => (
                  <ToothPDF 
                    key={num} 
                    number={num} 
                    coloredSegments={coloredByPos?.[num]} 
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Indicadores de Salud Bucal */}
        {indicadores && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INDICADORES DE SALUD BUCAL</Text>
            
            <View style={styles.indicadoresGrid}>
              {/* Higiene Oral */}
              {indicadores.higiene && (
                <View style={styles.indicadorBox}>
                  <Text style={styles.indicadorTitle}>HIGIENE ORAL</Text>
                  <Text style={styles.indicadorItem}>Placa: {indicadores.higiene.placa || "N/A"}</Text>
                  <Text style={styles.indicadorItem}>Cálculo: {indicadores.higiene.calculo || "N/A"}</Text>
                  <Text style={styles.indicadorItem}>Gingivitis: {indicadores.higiene.gingivitis || "N/A"}</Text>
                </View>
              )}

              {/* Enfermedad Periodontal */}
              {indicadores.enfermedadPeriodontal && (
                <View style={styles.indicadorBox}>
                  <Text style={styles.indicadorTitle}>ENF. PERIODONTAL</Text>
                  <Text style={styles.indicadorItem}>
                    Leve: {indicadores.enfermedadPeriodontal.leve ? "Sí" : "No"}
                  </Text>
                  <Text style={styles.indicadorItem}>
                    Moderada: {indicadores.enfermedadPeriodontal.moderada ? "Sí" : "No"}
                  </Text>
                  <Text style={styles.indicadorItem}>
                    Severa: {indicadores.enfermedadPeriodontal.severa ? "Sí" : "No"}
                  </Text>
                </View>
              )}

              {/* Mal Oclusión */}
              {indicadores.malOclusion && (
                <View style={styles.indicadorBox}>
                  <Text style={styles.indicadorTitle}>MAL OCLUSIÓN</Text>
                  <Text style={styles.indicadorItem}>
                    Angle I: {indicadores.malOclusion.angleI ? "Sí" : "No"}
                  </Text>
                  <Text style={styles.indicadorItem}>
                    Angle II: {indicadores.malOclusion.angleII ? "Sí" : "No"}
                  </Text>
                  <Text style={styles.indicadorItem}>
                    Angle III: {indicadores.malOclusion.angleIII ? "Sí" : "No"}
                  </Text>
                </View>
              )}

              {/* Fluorosis */}
              {indicadores.fluorosis && (
                <View style={styles.indicadorBox}>
                  <Text style={styles.indicadorTitle}>FLUOROSIS</Text>
                  <Text style={styles.indicadorItem}>
                    Leve: {indicadores.fluorosis.leve ? "Sí" : "No"}
                  </Text>
                  <Text style={styles.indicadorItem}>
                    Moderada: {indicadores.fluorosis.moderada ? "Sí" : "No"}
                  </Text>
                  <Text style={styles.indicadorItem}>
                    Severa: {indicadores.fluorosis.severa ? "Sí" : "No"}
                  </Text>
                </View>
              )}

              {/* Índices CPO */}
              {indicadores.cpo && (
                <View style={styles.indicadorBox}>
                  <Text style={styles.indicadorTitle}>ÍNDICES CPO</Text>
                  <Text style={styles.indicadorItem}>C: {indicadores.cpo.C || "0"}</Text>
                  <Text style={styles.indicadorItem}>P: {indicadores.cpo.P || "0"}</Text>
                  <Text style={styles.indicadorItem}>O: {indicadores.cpo.O || "0"}</Text>
                  <Text style={styles.indicadorItem}>Total: {indicadores.cpo.total || "0"}</Text>
                </View>
              )}

              {/* Índices ceo */}
              {indicadores.ceo && (
                <View style={styles.indicadorBox}>
                  <Text style={styles.indicadorTitle}>ÍNDICES ceo</Text>
                  <Text style={styles.indicadorItem}>c: {indicadores.ceo.c || "0"}</Text>
                  <Text style={styles.indicadorItem}>e: {indicadores.ceo.e || "0"}</Text>
                  <Text style={styles.indicadorItem}>o: {indicadores.ceo.o || "0"}</Text>
                  <Text style={styles.indicadorItem}>Total: {indicadores.ceo.total || "0"}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Documento generado por Sistema Odontológico - {fechaActual}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function OdontogramaPage() {
  const [paciente, setPaciente] = useState<PacienteLite | null>(null);
  const [piezas, setPiezas] = useState<PiezaDental[]>([]);
  const [piezaModal, setPiezaModal] = useState<PiezaDental | null>(null);
  const [indicadores, setIndicadores] = useState<IndicadoresState>(IndicadoresSaludBucal.initialValue);
  const [odo, setOdo] = useState<Odontograma | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [coloredByPos, setColoredByPos] = useState<Record<string, any>>({});
  const [segmentModal, setSegmentModal] = useState<ToothSegment | null>(null);
  const [creandoOdontograma, setCreandoOdontograma] = useState(false);

  // Ref para el contenedor que se capturará
  const odontogramaRef = useRef<HTMLDivElement>(null);

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

  async function descargarPDF() {
    if (!paciente) {
      alert("No hay datos para generar el PDF");
      return;
    }

    setGenerandoPDF(true);

    try {
      // Crear el documento PDF directamente sin captura de pantalla
      const doc = (
        <OdontogramaPDF
          paciente={paciente}
          descripcion={descripcion}
          indicadores={indicadores}
          coloredByPos={coloredByPos}
          piezas={piezas}
        />
      );

      // Generar el blob del PDF
      const blob = await pdf(doc).toBlob();

      // Crear link de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const nombreCompleto = [
        paciente.usuario?.nombre,
        paciente.usuario?.paterno,
        paciente.usuario?.materno
      ].filter(Boolean).join("_");
      
      const fileName = `Odontograma_${nombreCompleto}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      link.href = url;
      link.download = fileName;
      link.click();

      // Limpiar
      URL.revokeObjectURL(url);

      alert("PDF descargado exitosamente");

    } catch (error: any) {
      console.error("Error al generar PDF:", error);
      alert(`Error al generar el PDF: ${error.message}`);
    } finally {
      setGenerandoPDF(false);
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
          {/* Contenedor REF para captura de PDF */}
          <div ref={odontogramaRef} className="space-y-5">
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
          </div>

          {/* Botones de acción - FUERA del ref */}
          <div className="flex justify-end gap-3">
            <button
              onClick={descargarPDF}
              disabled={generandoPDF}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {generandoPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generando PDF...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar PDF
                </>
              )}
            </button>
            
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