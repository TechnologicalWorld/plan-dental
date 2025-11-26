"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp, Activity, FileText, Filter } from 'lucide-react';
import { dashboardService } from "../dashboardservice";

const COLORS = ['#4ade80', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa'];

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  bgColor?: string;
}

const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }: StatCardProps) => (
  <div className="rounded-lg shadow-lg p-6 border-l-4" style={{ backgroundColor: '#2c3e50', borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>{title}</p>
        <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
        {subtitle && <p className="text-sm mt-1" style={{ color: '#64748b' }}>{subtitle}</p>}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: bgColor || '#1e293b' }}>
        <Icon size={28} style={{ color }} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  const [anio, setAnio] = useState(2025);
  const [mes, setMes] = useState(11);
  
  const meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];
  
  const currentYear = new Date().getFullYear();
  const anios = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const aplicarFiltros = () => {
    setLoading(true); 
    fetchData();
  };

  const handleMesChange = (nuevoMes: number) => {
    setMes(nuevoMes);
  };

  const handleAnioChange = (nuevoAnio: number) => {
    setAnio(nuevoAnio);
  };

  const fetchData = async () => {
    setError(null);
    
    try {
      console.log(`Cargando datos para: ${mes}/${anio}`);
      
      const [
        ingresosPorOdonto,
        gananciaTratamientos,
        ingresosYPendientes,
        totalCitas,
        odontologosActivos,
        citasPorEstado,
        facturacionDiaria,
        odontologosCitas,
        resumenAdmin
      ] = await Promise.all([
        dashboardService.cdIngresosPorOdontoMes({ anio, mes }),
        dashboardService.cdGananciaPorTratamiento({ anio, mes }),
        dashboardService.cdIngresosYPendientes({ anio, mes }),
        dashboardService.cdTotalCitas({ anio, mes }),
        dashboardService.cdOdontologosActivos(),
        dashboardService.cdCitasPorEstado({ anio, mes }),
        dashboardService.cdFacturacionDiaria({ anio, mes }),
        dashboardService.cdOdontologosCitasProporcion({ anio, mes }),
        dashboardService.cdResumenAdministrativo({ anio, mes })
      ]);

      setDashboardData({
        ingresosPorOdonto,
        gananciaTratamientos,
        ingresosYPendientes: ingresosYPendientes[0],
        totalCitas: totalCitas[0],
        odontologosActivos: odontologosActivos[0],
        citasPorEstado,
        facturacionDiaria,
        odontologosCitas,
        resumenAdmin: resumenAdmin[0]
      });
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err?.message || 'Error desconocido al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a2332' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a2332' }}>
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Error al cargar los datos</p>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a2332' }}>
        <p className="text-red-400">No hay datos disponibles</p>
      </div>
    );
  }

  const { 
    ingresosPorOdonto, 
    gananciaTratamientos, 
    ingresosYPendientes, 
    totalCitas, 
    odontologosActivos, 
    citasPorEstado, 
    facturacionDiaria, 
    odontologosCitas, 
    resumenAdmin 
  } = dashboardData;

  const citasPorEstadoData = citasPorEstado.map((item: any) => ({
    name: item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
    value: item.total
  }));

  const facturacionDiariaData = facturacionDiaria.map((item: any) => ({
    dia: `Día ${item.fecha}`,
    facturado: parseFloat(item.facturado),
    cobrado: parseFloat(item.cobrado),
    saldo: parseFloat(item.saldo)
  }));

  const ingresosPorOdontologoData = ingresosPorOdonto.map((item: any) => ({
    nombre: item.nombre_completo.split(' ')[0] + ' ' + item.nombre_completo.split(' ')[1],
    ingresos: parseFloat(item.total)
  }));

  const tratamientosTop5 = gananciaTratamientos.slice(0, 5).map((item: any) => ({
    nombre: item.nombre.length > 25 ? item.nombre.substring(0, 25) + '...' : item.nombre,
    ganancia: parseFloat(item.total_ganancia_tratamiento)
  }));

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1a2332' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#e2e8f0' }}>Dashboard Clínica Dental</h1>
              <p className="mt-1" style={{ color: '#94a3b8' }}>
                {meses.find(m => m.value === mes)?.label} {anio} - Resumen General
              </p>
            </div>
            
            {/* Filtros */}
            <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: '#2c3e50' }}>
              <div className="flex items-center gap-3">
                <Filter size={20} style={{ color: '#94a3b8' }} />
                <select
                  value={mes}
                  onChange={(e) => handleMesChange(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #374151' }}
                >
                  {meses.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                
                <select
                  value={anio}
                  onChange={(e) => handleAnioChange(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #374151' }}
                >
                  {anios.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                
                <button
                  onClick={aplicarFiltros}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg p-1 mb-6" style={{ backgroundColor: '#2c3e50' }}>
          <button
            onClick={() => setSelectedTab('general')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              selectedTab === 'general' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: selectedTab === 'general' ? '#3b82f6' : 'transparent',
              color: selectedTab === 'general' ? '#ffffff' : '#94a3b8'
            }}
          >
            General
          </button>
          <button
            onClick={() => setSelectedTab('financiero')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              selectedTab === 'financiero' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: selectedTab === 'financiero' ? '#3b82f6' : 'transparent',
              color: selectedTab === 'financiero' ? '#ffffff' : '#94a3b8'
            }}
          >
            Financiero
          </button>
          <button
            onClick={() => setSelectedTab('odontologos')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              selectedTab === 'odontologos' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: selectedTab === 'odontologos' ? '#3b82f6' : 'transparent',
              color: selectedTab === 'odontologos' ? '#ffffff' : '#94a3b8'
            }}
          >
            Odontólogos
          </button>
        </div>

        {/* Tab: General */}
        {selectedTab === 'general' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                icon={Calendar}
                title="Total Citas"
                value={totalCitas.total_citas}
                subtitle={`${resumenAdmin.NroCitasCompletadas} completadas`}
                color="#60a5fa"
                bgColor="#1e3a8a"
              />
              <StatCard
                icon={Users}
                title="Pacientes Activos"
                value={resumenAdmin.NroPacientes}
                subtitle="En el mes"
                color="#4ade80"
                bgColor="#14532d"
              />
              <StatCard
                icon={Activity}
                title="Odontólogos"
                value={odontologosActivos.odontologos_activos}
                subtitle="Activos"
                color="#fbbf24"
                bgColor="#78350f"
              />
              <StatCard
                icon={FileText}
                title="Pendientes"
                value={resumenAdmin.NroCitasPendiente}
                subtitle="Citas por confirmar"
                color="#f87171"
                bgColor="#7f1d1d"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Citas por Estado */}
              <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: '#2c3e50' }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#e2e8f0' }}>Estado de Citas</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={citasPorEstadoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {citasPorEstadoData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Tratamientos más Rentables */}
              <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: '#2c3e50' }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#e2e8f0' }}>Tratamientos más Rentables</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tratamientosTop5}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} fontSize={12} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0' }} formatter={(value) => `Bs ${value}`} />
                    <Bar dataKey="ganancia" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Tab: Financiero */}
        {selectedTab === 'financiero' && (
          <>
            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                icon={DollarSign}
                title="Ingresos Cobrados"
                value={`Bs ${parseFloat(ingresosYPendientes.ingresos).toLocaleString()}`}
                subtitle="Efectivamente cobrado"
                color="#4ade80"
                bgColor="#14532d"
              />
              <StatCard
                icon={TrendingUp}
                title="Pendiente de Cobro"
                value={`Bs ${parseFloat(ingresosYPendientes.pendiente).toLocaleString()}`}
                subtitle="Por cobrar"
                color="#fbbf24"
                bgColor="#78350f"
              />
              <StatCard
                icon={DollarSign}
                title="Total Facturado"
                value={`Bs ${(parseFloat(ingresosYPendientes.ingresos) + parseFloat(ingresosYPendientes.pendiente)).toLocaleString()}`}
                subtitle="Ingresos + Pendiente"
                color="#60a5fa"
                bgColor="#1e3a8a"
              />
            </div>

            {/* Facturación Diaria */}
            <div className="rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: '#2c3e50' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#e2e8f0' }}>Facturación Diaria</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={facturacionDiariaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="dia" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0' }} formatter={(value) => `Bs ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="facturado" stroke="#60a5fa" name="Facturado" strokeWidth={2} />
                  <Line type="monotone" dataKey="cobrado" stroke="#4ade80" name="Cobrado" strokeWidth={2} />
                  <Line type="monotone" dataKey="saldo" stroke="#f87171" name="Saldo" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Tab: Odontólogos */}
        {selectedTab === 'odontologos' && (
          <>
            {/* Ingresos por Odontólogo */}
            <div className="rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: '#2c3e50' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#e2e8f0' }}>Ingresos por Odontólogo</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ingresosPorOdontologoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="nombre" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0' }} formatter={(value) => `Bs ${value}`} />
                  <Bar dataKey="ingresos" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla de Odontólogos */}
            <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#2c3e50' }}>
              <h2 className="text-lg font-semibold p-6 pb-4" style={{ color: '#e2e8f0' }}>Detalle por Odontólogo</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#1e293b' }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                        Citas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                        Proporción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                        Ingresos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ backgroundColor: '#2c3e50', borderColor: '#374151' }}>
                    {odontologosCitas.map((odonto: any, idx: number) => {
                      const ingreso = ingresosPorOdonto.find((i: any) => i.idUsuario === odonto.idUsuario);
                      return (
                        <tr key={idx} className="hover:bg-opacity-50" style={{ backgroundColor: idx % 2 === 0 ? '#2c3e50' : '#334155' }}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#e2e8f0' }}>
                            {odonto.nombre_completo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#94a3b8' }}>
                            {odonto.NroCitas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#94a3b8' }}>
                            {(parseFloat(odonto.ProporcionGlobal) * 100).toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: '#4ade80' }}>
                            Bs {ingreso ? parseFloat(ingreso.total).toLocaleString() : '0'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}