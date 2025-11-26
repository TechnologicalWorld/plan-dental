import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/renderer";
import type { MesParam } from "../../dashboard/dashboardservice";

export type ReportFilters = {
  anio?: number;
  mes?: MesParam;
<<<<<<< HEAD
  idUsuario?: number | null;
=======
  idUsuario?: number | null; 
>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
};

export type ReportData = {
  filtros: ReportFilters;
<<<<<<< HEAD
  citasPorDiaSemanaMes: Array<{ dia_semana: string; total_citas: number }>;
=======

  citasPorDiaSemanaMes: Array<{ dia_semana: string; total_citas: number }>;


>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
  ingresosPorOdontoMes: Array<{
    idUsuario: number;
    total: number;
    nombre_completo: string;
    anio: number | null;
    mes: number | null;
  }>;
<<<<<<< HEAD
=======

>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
  resumenCitasPorOdonto: Array<{
    idUsuario: number;
    nombre_completo: string;
    estado: string;
    anio: number | null;
    mes: number | null;
    Nro: number;
  }>;
<<<<<<< HEAD
=======

>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
  resumenCitasDias: Array<{
    idUsuario: number | null;
    estado: string;
    anio: number | null;
    mes: number | null;
    dia: string;
    Nro: number;
  }>;
<<<<<<< HEAD
=======

>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
  reporteCitasEstadoOdontologo: Array<{
    idUsuario: number;
    nombre_completo: string;
    estado: string;
    Nro_Citas: number;
  }>;
<<<<<<< HEAD
=======

>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
  gananciaCitasPorOdontologo: Array<{
    idUsuario: number;
    nombre_completo: string;
    Total_Ganancia_Citas: number;
  }>;
<<<<<<< HEAD
=======

>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
  gananciaTratamientosPorOdontologo: Array<{
    idUsuario: number;
    nombre_completo: string;
    total_ganancia_tratamiento: number;
  }>;
<<<<<<< HEAD
  gananciaPorTratamiento: Array<{ nombre: string; total_ganancia_tratamiento: number }>;
};

// Crear estilos fuera del componente para evitar recreación
const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 28,
    fontSize: 10,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 28,
    right: 28,
    fontSize: 9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  h1: { 
    fontSize: 16, 
    marginBottom: 6,
    fontWeight: 700,
  },
  h2: { 
    fontSize: 12, 
    marginTop: 12, 
    marginBottom: 6,
    fontWeight: 700,
  },
  small: { 
    color: "#666",
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 4,
  },
  rowHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 4,
    fontWeight: 700,
    backgroundColor: "#f0f0f0",
  },
  cell: { 
    paddingRight: 6,
  },
  cellRight: { 
    paddingRight: 6,
    textAlign: "right",
  },
  col1: { width: "10%" },
  col2: { width: "50%" },
  col3: { width: "20%" },
  col4: { width: "20%" },
  wrapBlock: { 
    marginBottom: 6,
  },
  labelBold: {
    fontWeight: 700,
  },
});
=======

  gananciaPorTratamiento: Array<{ nombre: string; total_ganancia_tratamiento: number }>;
};

export function DashboardReportPDF(
  { data, titulo }: { data: ReportData; titulo: string }
): React.ReactElement<DocumentProps> {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 60,
      paddingBottom: 40,
      paddingHorizontal: 28,
      fontSize: 10,
    },
    header: {
      position: "absolute", 
      top: 20,
      left: 28,
      right: 28,
      height: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 10,
    },
    footer: {
      position: "absolute",
      bottom: 16,
      left: 28,
      right: 28,
      height: 16,
      fontSize: 9,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    h1: { fontSize: 16, marginBottom: 6 },
    h2: { fontSize: 12, marginTop: 12, marginBottom: 6 },
    small: { color: "#666" },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#ddd",
      paddingVertical: 4,
    },
    th: { fontWeight: "bold" },
    cell: { paddingRight: 6 },
    right: { textAlign: "right" as const },
    col1: { width: "10%" },
    col2: { width: "50%" },
    col3: { width: "20%" },
    col4: { width: "20%" },
    wrapBlock: { marginBottom: 6 },
  });
>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8

export function DashboardReportPDF({ data, titulo }: { data: ReportData; titulo: string }) {
  const { filtros } = data;
  const fecha = new Date().toLocaleString("es-BO");

  const money = (n: number) =>
    new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
      maximumFractionDigits: 2,
    }).format(n ?? 0);

  const monthNameEs = (m?: MesParam): string => {
    if (m == null) return "—";
    if (typeof m === "string") return m;
    const map = [
      "enero","febrero","marzo","abril","mayo","junio",
      "julio","agosto","septiembre","octubre","noviembre","diciembre",
    ];
    return map[(m as number) - 1] ?? String(m);
  };

  const SectionTitle = ({ children }: { children: string }) => (
    <Text style={styles.h2}>{children}</Text>
  );

  const Header = () => (
    <View style={styles.header} fixed>
      <Text>{titulo}</Text>
      <Text style={styles.small}>Generado: {fecha}</Text>
    </View>
  );

  const Footer = () => (
    <View style={styles.footer} fixed>
      <Text style={styles.small}>
        Filtros: Año={filtros.anio ?? "—"} • Mes={monthNameEs(filtros.mes)}
        {filtros.idUsuario ? ` • Odonto=${filtros.idUsuario}` : ""}
      </Text>
      <Text
        style={styles.small}
        render={({ pageNumber, totalPages }) => `Página ${pageNumber} / ${totalPages}`}
      />
    </View>
  );

  const TableHeader = ({ cols }: { cols: string[] }) => (
    <View style={styles.rowHeader}>
      {cols.map((c, i) => (
        <Text
          key={i}
          style={[
            styles.cell,
            i === 0 ? styles.col1 : i === cols.length - 1 ? styles.col4 : styles.col2,
          ]}
        >
          {c}
        </Text>
      ))}
    </View>
  );

  const KV = ({ k, v }: { k: string; v: string }) => (
    <View style={styles.wrapBlock}>
      <Text>
        <Text style={styles.labelBold}>{k}: </Text>
        <Text>{v}</Text>
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Header />
        <Footer />

        <Text style={styles.h1}>{titulo}</Text>
        <KV k="Fecha" v={fecha} />
        <KV
          k="Parámetros"
          v={`Año=${filtros.anio ?? "—"} • Mes=${monthNameEs(filtros.mes)} • Odonto=${filtros.idUsuario ?? "—"}`}
        />

<<<<<<< HEAD
        {/* 2) Citas por día-semana del mes */}
        {data.citasPorDiaSemanaMes && data.citasPorDiaSemanaMes.length > 0 && (
=======
        {data.citasPorDiaSemanaMes.length > 0 && (
>>>>>>> 2256e560f645c2a82c04a8f605af59bb48d119c8
          <>
            <SectionTitle>Citas por día de la semana (mes seleccionado)</SectionTitle>
            <TableHeader cols={["#", "Día", "Citas", ""]} />
            {data.citasPorDiaSemanaMes.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{r.dia_semana}</Text>
                <Text style={[styles.cellRight, styles.col3]}>{r.total_citas}</Text>
                <Text style={[styles.cell, styles.col4]} />
              </View>
            ))}
          </>
        )}

        {/* 3) Ingresos por odontólogo */}
        {data.ingresosPorOdontoMes && data.ingresosPorOdontoMes.length > 0 && (
          <>
            <SectionTitle>Ingresos por odontólogo</SectionTitle>
            <TableHeader cols={["#", "Odontólogo", "Total", "Año/Mes"]} />
            {data.ingresosPorOdontoMes.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{r.nombre_completo}</Text>
                <Text style={[styles.cellRight, styles.col3]}>{money(r.total)}</Text>
                <Text style={[styles.cellRight, styles.col4]}>
                  {`${r.anio ?? "—"}/${r.mes ?? "—"}`}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* 4) Resumen de citas por odontólogo */}
        {data.resumenCitasPorOdonto && data.resumenCitasPorOdonto.length > 0 && (
          <>
            <SectionTitle>Resumen de citas por odontólogo (por estado)</SectionTitle>
            <TableHeader cols={["#", "Odontólogo / Estado", "Nro", "Año/Mes"]} />
            {data.resumenCitasPorOdonto.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{`${r.nombre_completo} — ${r.estado}`}</Text>
                <Text style={[styles.cellRight, styles.col3]}>{r.Nro}</Text>
                <Text style={[styles.cellRight, styles.col4]}>
                  {`${r.anio ?? "—"}/${r.mes ?? "—"}`}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* 5) Resumen citas por día */}
        {data.resumenCitasDias && data.resumenCitasDias.length > 0 && (
          <>
            <SectionTitle>Resumen de citas por día (por odontólogo/estado)</SectionTitle>
            <TableHeader cols={["#", "Odontólogo / Estado / Día", "Nro", "Año/Mes"]} />
            {data.resumenCitasDias.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>
                  {`${r.idUsuario ?? "—"} • ${r.estado} • ${r.dia}`}
                </Text>
                <Text style={[styles.cellRight, styles.col3]}>{r.Nro}</Text>
                <Text style={[styles.cellRight, styles.col4]}>
                  {`${r.anio ?? "—"}/${r.mes ?? "—"}`}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* 6) Citas por estado y odontólogo */}
        {data.reporteCitasEstadoOdontologo && data.reporteCitasEstadoOdontologo.length > 0 && (
          <>
            <SectionTitle>Citas por estado y odontólogo</SectionTitle>
            <TableHeader cols={["#", "Odontólogo / Estado", "Nro Citas", ""]} />
            {data.reporteCitasEstadoOdontologo.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{`${r.nombre_completo} — ${r.estado}`}</Text>
                <Text style={[styles.cellRight, styles.col3]}>{r.Nro_Citas}</Text>
                <Text style={[styles.cell, styles.col4]} />
              </View>
            ))}
          </>
        )}

        {/* 7) Ganancia por citas por odontólogo */}
        {data.gananciaCitasPorOdontologo && data.gananciaCitasPorOdontologo.length > 0 && (
          <>
            <SectionTitle>Ganancia por citas por odontólogo</SectionTitle>
            <TableHeader cols={["#", "Odontólogo", "Total", ""]} />
            {data.gananciaCitasPorOdontologo.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{r.nombre_completo}</Text>
                <Text style={[styles.cellRight, styles.col3]}>
                  {money(r.Total_Ganancia_Citas)}
                </Text>
                <Text style={[styles.cell, styles.col4]} />
              </View>
            ))}
          </>
        )}

        {/* 8) Ganancia por tratamientos por odontólogo */}
        {data.gananciaTratamientosPorOdontologo && data.gananciaTratamientosPorOdontologo.length > 0 && (
          <>
            <SectionTitle>Ganancia por tratamientos por odontólogo</SectionTitle>
            <TableHeader cols={["#", "Odontólogo", "Total", ""]} />
            {data.gananciaTratamientosPorOdontologo.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{r.nombre_completo}</Text>
                <Text style={[styles.cellRight, styles.col3]}>
                  {money(r.total_ganancia_tratamiento)}
                </Text>
                <Text style={[styles.cell, styles.col4]} />
              </View>
            ))}
          </>
        )}

        {/* 9) Ganancia por tratamiento */}
        {data.gananciaPorTratamiento && data.gananciaPorTratamiento.length > 0 && (
          <>
            <SectionTitle>Ganancia por tratamiento</SectionTitle>
            <TableHeader cols={["#", "Tratamiento", "Total", ""]} />
            {data.gananciaPorTratamiento.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.col1]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{r.nombre}</Text>
                <Text style={[styles.cellRight, styles.col3]}>
                  {money(r.total_ganancia_tratamiento)}
                </Text>
                <Text style={[styles.cell, styles.col4]} />
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}