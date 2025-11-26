import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

export type MesParam = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ReportFilters {
  anio: number;
  mes: MesParam;
  idUsuario: number | null;
}

export interface ReportData {
  filtros: ReportFilters;
  citasPorDiaSemanaMes: any[];
  ingresosPorOdontoMes: any[];
  resumenCitasPorOdonto: any[];
  resumenCitasDias: any[];
  reporteCitasEstadoOdontologo: any[];
  gananciaCitasPorOdontologo: any[];
  gananciaTratamientosPorOdontologo: any[];
  gananciaPorTratamiento: any[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #2563eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
    border: "1 solid #e2e8f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b",
    borderBottom: "1 solid #cbd5e1",
    paddingBottom: 4,
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e2e8f0",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#e0e7ff",
    fontWeight: "bold",
    borderBottom: "2 solid #3b82f6",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 9,
  },
  noData: {
    fontSize: 9,
    color: "#94a3b8",
    fontStyle: "italic",
    padding: 10,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTop: "1 solid #e2e8f0",
    paddingTop: 10,
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    padding: 8,
    backgroundColor: "#eff6ff",
    borderRadius: 4,
    border: "1 solid #bfdbfe",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#475569",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e40af",
  },
});

const MESES_NOMBRES: { [key: number]: string } = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

interface TableProps {
  data: any[];
  title: string;
}

const DataTable: React.FC<TableProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.noData}>No hay datos disponibles</Text>
      </View>
    );
  }

  const keys = Object.keys(data[0]);

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          {keys.map((key) => (
            <Text key={key} style={styles.tableCell}>
              {key.replace(/_/g, " ").toUpperCase()}
            </Text>
          ))}
        </View>
        {data.map((row, index) => (
          <View key={index} style={styles.tableRow}>
            {keys.map((key) => (
              <Text key={key} style={styles.tableCell}>
                {String(row[key] ?? "")}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 8, color: "#64748b", marginTop: 5 }}>
        Total de registros: {data.length}
      </Text>
    </View>
  );
};

interface DashboardReportPDFProps {
  data: ReportData;
  titulo: string;
}

const DashboardReportPDF: React.FC<DashboardReportPDFProps> = ({
  data,
  titulo,
}) => {
  const mesNombre = MESES_NOMBRES[data.filtros.mes] || "Desconocido";

  const calcularTotalRegistros = () => {
    return (
      (data.citasPorDiaSemanaMes?.length || 0) +
      (data.ingresosPorOdontoMes?.length || 0) +
      (data.resumenCitasPorOdonto?.length || 0) +
      (data.resumenCitasDias?.length || 0) +
      (data.reporteCitasEstadoOdontologo?.length || 0) +
      (data.gananciaCitasPorOdontologo?.length || 0) +
      (data.gananciaTratamientosPorOdontologo?.length || 0) +
      (data.gananciaPorTratamiento?.length || 0)
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.subtitle}>
            Período: {mesNombre} {data.filtros.anio}
          </Text>
          <Text style={styles.subtitle}>
            Fecha de generación: {new Date().toLocaleDateString("es-ES")}
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Año</Text>
            <Text style={styles.summaryValue}>{data.filtros.anio}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Mes</Text>
            <Text style={styles.summaryValue}>{mesNombre}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Registros</Text>
            <Text style={styles.summaryValue}>{calcularTotalRegistros()}</Text>
          </View>
        </View>

        <DataTable
          data={data.ingresosPorOdontoMes}
          title="Ingresos por Odontólogo"
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <DataTable
          data={data.resumenCitasPorOdonto}
          title="Resumen de Citas por Odontólogo"
        />

        <DataTable
          data={data.citasPorDiaSemanaMes}
          title="Citas por Día de la Semana"
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <DataTable
          data={data.resumenCitasDias}
          title="Resumen de Citas por Días"
        />

        <DataTable
          data={data.reporteCitasEstadoOdontologo}
          title="Reporte de Citas por Estado y Odontólogo"
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <DataTable
          data={data.gananciaCitasPorOdontologo}
          title="Ganancia de Citas por Odontólogo"
        />

        <DataTable
          data={data.gananciaTratamientosPorOdontologo}
          title="Ganancia de Tratamientos por Odontólogo"
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <DataTable
          data={data.gananciaPorTratamiento}
          title="Ganancia por Tratamiento"
        />

        <View style={styles.footer}>
          <Text>
            Generado el {new Date().toLocaleDateString("es-ES")} a las{" "}
            {new Date().toLocaleTimeString("es-ES")}
          </Text>
          <Text>{titulo}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DashboardReportPDF;