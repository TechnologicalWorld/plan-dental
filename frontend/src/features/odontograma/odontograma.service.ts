import api from "@/shared/api/apiClient";

export type PacienteLite = {
  idUsuario_Paciente: number;
  usuario?: {
    idUsuario: number;
    ci?: string;
    nombre?: string;
    paterno?: string;
    materno?: string | null;
    telefono?: string;
    correo?: string;
    fechaNacimiento?: string;
  };
  fechaIngreso?: string;
  codigoSeguro?: string;
};

export type PiezaDental = {
  idPieza?: number;
  idOdontograma?: number | null;
  posicion: string; 
  nombre?: string;
  tipo?: string;
  estado?: string;
  observacion?: string | null;
};

export type Odontograma = {
  idOdontograma?: number;
  nombre?: string;
  fecha?: string;
  descripcion?: string | null;
  idUsuario_Paciente?: number;
  piezas?: PiezaDental[];
  indicadores?: any;
};

export type TratamientoLite = {
  idTratamiento: number;
  nombre: string;
  precio?: number;
};

export type AccionLite = {
  idAccion: number;
  nombre: string;
};

// ---------- PACIENTE ----------
export async function searchPacientes(q: string, page = 1, perPage = 10) {
  const { data } = await api.get("/pacientes", { params: { search: q, page, per_page: perPage } });
  return data;
}
export async function getPacienteById(id: number) {
  const { data } = await api.get(`/pacientes/${id}`);
  return data;
}

// ---------- ODONTOGRAMA ----------
export async function getPiezasPorPaciente(idPaciente: number): Promise<PiezaDental[]> {
  const { data } = await api.get(`/pacientes/${idPaciente}/piezas-dentales`);
  const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  return list as PiezaDental[];
}

export async function crearOdontograma(payload: Partial<Odontograma>) {
  const { data } = await api.post("/odontogramas", payload);
  return data?.data ?? data;
}
export async function actualizarOdontograma(id: number, payload: Partial<Odontograma>) {
  const { data } = await api.put(`/odontogramas/${id}`, payload);
  return data?.data ?? data;
}

// Mapeo de posiciones a nombres de dientes
const nombresDientes: Record<string, string> = {
  "11": "Incisivo central superior derecho",
  "12": "Incisivo lateral superior derecho",
  "13": "Canino superior derecho",
  "14": "Primer premolar superior derecho",
  "15": "Segundo premolar superior derecho",
  "16": "Primer molar superior derecho",
  "17": "Segundo molar superior derecho",
  "18": "Tercer molar superior derecho",
  "21": "Incisivo central superior izquierdo",
  "22": "Incisivo lateral superior izquierdo",
  "23": "Canino superior izquierdo",
  "24": "Primer premolar superior izquierdo",
  "25": "Segundo premolar superior izquierdo",
  "26": "Primer molar superior izquierdo",
  "27": "Segundo molar superior izquierdo",
  "28": "Tercer molar superior izquierdo",
  "31": "Incisivo central inferior izquierdo",
  "32": "Incisivo lateral inferior izquierdo",
  "33": "Canino inferior izquierdo",
  "34": "Primer premolar inferior izquierdo",
  "35": "Segundo premolar inferior izquierdo",
  "36": "Primer molar inferior izquierdo",
  "37": "Segundo molar inferior izquierdo",
  "38": "Tercer molar inferior izquierdo",
  "41": "Incisivo central inferior derecho",
  "42": "Incisivo lateral inferior derecho",
  "43": "Canino inferior derecho",
  "44": "Primer premolar inferior derecho",
  "45": "Segundo premolar inferior derecho",
  "46": "Primer molar inferior derecho",
  "47": "Segundo molar inferior derecho",
  "48": "Tercer molar inferior derecho",
};

export async function upsertPieza(pieza: Partial<PiezaDental>) {
  const payload = {
    posicion: pieza.posicion,
    nombre: pieza.nombre || nombresDientes[pieza.posicion!] || `Pieza ${pieza.posicion}`,
    tipo: pieza.tipo || "Permanente",
    estado: pieza.estado || "Sano",
    idOdontograma: pieza.idOdontograma,
  };

  if (pieza.observacion) {
    (payload as any).observacion = pieza.observacion;
  }

  try {
    if (pieza.idPieza) {
      const { data } = await api.put(`/piezas-dentales/${pieza.idPieza}`, payload);
      return data?.data ?? data;
    } else {
      const { data } = await api.post("/piezas-dentales", payload);
      return data?.data ?? data;
    }
  } catch (error: any) {
    console.error("Error en upsertPieza:", error.response?.data || error);
    throw error;
  }
}

// ---------- TRATAMIENTOS / ACCIONES ----------
export async function listarTratamientos() {
  const { data } = await api.get("/tratamientos");
  return Array.isArray(data?.data) ? data.data : data;
}
export async function listarAcciones() {
  const { data } = await api.get("/acciones");
  return Array.isArray(data?.data) ? data.data : data;
}

export async function asignarPiezasATratamiento(idTratamiento: number, piezasIds: number[]) {
  try {
    const promises = piezasIds.map(idPieza => 
      api.post('/evoluciones', {
        idTratamiento,
        idPieza,
        fecha: new Date().toISOString().slice(0, 10),
        diagnosticoCIE: "Z00.0", 
        procedimientoIndicacion: "Tratamiento planificado", 
      })
    );
    
    const results = await Promise.all(promises);
    return results;
  } catch (error: any) {
    console.error("Error al asignar piezas:", error.response?.data || error);
    throw error;
  }
}

// ---------- DETALLE DENTAL ----------
export async function crearDetalleDental(payload: {
  idAccion: number;
  idPiezaDental: number;
  descripcion?: string;
  fecha: string;              
  cuadrante: string;          
}) {
  const { data } = await api.post("/detalle-dental", payload);
  return data?.data ?? data;
}

// ---------- COLOREADO DE ZONAS ----------
export type DetalleDental = {
  idAccion: number;
  idPiezaDental: number;
  descripcion?: string;
  cuadrante: string;   
  fecha: string;
  accion?: { idAccion: number; nombre: string; color?: string };
};

export async function listarDetallesDental(): Promise<DetalleDental[]> {
  const { data } = await api.get("/detalle-dental");
  return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
}

export async function fetchColoresPorPieza(
  piezas: { idPieza?: number; posicion: string }[]
): Promise<Record<string, import("./components/ToothCell").ColoredSegments>> {
  const detalles = await listarDetallesDental();
  const byIdPieza = new Map<number, DetalleDental[]>();
  detalles.forEach(d => {
    if (!d.idPiezaDental) return;
    if (!byIdPieza.has(d.idPiezaDental)) byIdPieza.set(d.idPiezaDental, []);
    byIdPieza.get(d.idPiezaDental)!.push(d);
  });

  const segMap: Record<string, import("./components/ToothCell").ColoredSegments> = {};
  for (const p of piezas) {
    const list = p.idPieza ? byIdPieza.get(p.idPieza) : undefined;
    if (!list?.length) continue;

    const colored: any = {};
    for (const d of list) {
      const color = d.accion?.color || "#38BDF8";
      switch (d.cuadrante) {
        case "1": colored.TOP = color; break;
        case "2": colored.RIGHT = color; break;
        case "3": colored.BOTTOM = color; break;
        case "4": colored.LEFT = color; break;
        case "5": colored.CENTER = color; break;
        default: colored.TOP = color; break;
      }
    }
    segMap[p.posicion] = colored;
  }
  return segMap;
}



