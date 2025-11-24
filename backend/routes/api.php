<?php

use App\Http\Controllers\AdministradorController;
use App\Http\Controllers\AsistenteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OdontologoController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\{
    AccionController,
    AsisteController,
    AtiendeController,
    DetalleDentalController,
    EfectuaController,
    HaceController,
    TieneController,
    PiezaDentalController,
    CitaController,
    SesionController,
    TratamientoController,
    EvaluaController,
    EvolucionController,
    PlanController,
    EspecialidadController,
    OdontogramaController,
    HistoriaClinicaController,
    DashboardController,
    ReportesController,
};
use App\Models\Odontograma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas de autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::apiResource('usuarios', UsuarioController::class);
// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Rutas de usuarios y roles
    Route::apiResource('pacientes', PacienteController::class);
    Route::apiResource('odontologos', OdontologoController::class);
    Route::apiResource('asistentes', AsistenteController::class);
    Route::apiResource('administradores', AdministradorController::class);

    // Rutas adicionales para usuarios
    Route::get('/usuarios/odontologos/listar', [UsuarioController::class, 'odontologos']);
    Route::get('/usuarios/pacientes/listar', [UsuarioController::class, 'pacientes']);
    Route::get('/usuarios/administradores/listar', [UsuarioController::class, 'administradores']);
    Route::get('/usuarios/asistentes/listar', [UsuarioController::class, 'asistentes']);
    Route::get('/usuarios/buscar/search', [UsuarioController::class, 'search']);
    // Rutas para entidades principales
    Route::apiResource('acciones', AccionController::class);
    Route::apiResource('especialidades', EspecialidadController::class);
    Route::apiResource('citas', CitaController::class);
    Route::apiResource('sesiones', SesionController::class);
    Route::apiResource('tratamientos', TratamientoController::class);
    Route::apiResource('odontogramas', OdontogramaController::class);
    Route::apiResource('planes', PlanController::class);
    Route::apiResource('piezas-dentales', PiezaDentalController::class);
    Route::apiResource('historias-clinicas', HistoriaClinicaController::class);

    // Rutas para relaciones 
    Route::apiResource('tiene', TieneController::class);
    Route::apiResource('atiende', AtiendeController::class);
    Route::apiResource('asiste', AsisteController::class);
    Route::apiResource('hace', HaceController::class);
    Route::apiResource('evalua', EvaluaController::class);
    Route::apiResource('efectua', EfectuaController::class);
    Route::apiResource('evoluciones', EvolucionController::class);
    Route::apiResource('detalle-dental', DetalleDentalController::class);     
    // Citas act
    Route::post('/citas/{id}/cambiar-estado', [CitaController::class, 'cambiarEstado']);
    Route::get('/citas/por-fecha/{fecha}', [CitaController::class, 'porFecha']);
    Route::get('/pacientes/{id}/citas', [PacienteController::class, 'citasPorpaciente']);
    // Odontólogos
    Route::post('/odontologos/{id}/asignar-especialidades', [OdontologoController::class, 'asignarEspecialidades']);
    Route::get('/odontologos/{id}/agenda', [OdontologoController::class, 'agenda']);
    Route::get('/odontologos/{id}/especialidades', [EspecialidadController::class, 'especialidadesPorOdontologo']);
    Route::get('/odontologos/{id}/citas', [OdontologoController::class, 'citasPorOdontologo']);
    Route::get('/odontologos/{id}/citas-por-fecha/{fecha}', [OdontologoController::class, 'citasPorOdontologoYFecha']);
    // Pacientes
    Route::get('/pacientes/{id}/historial-medico', [PacienteController::class, 'historialMedico']);
    Route::get('/pacientes/{id}/piezas-dentales', [OdontogramaController::class, 'porPaciente']);
    //Citas por paciente 
    Route::get('/pacientes/{id}/citas', [PacienteController::class, 'citasPorPaciente']);

    // Historias clínicas
    Route::get('/historias-clinicas/paciente/{pacienteId}', [HistoriaClinicaController::class, 'porPaciente']);

    // Tratamientos
    Route::post('/tratamientos/{id}/asignar-piezas-dentales', [TratamientoController::class, 'asignarPiezasDentales']);

    // Especialidades
    Route::get('/especialidades/{id}/odontologos', [EspecialidadController::class, 'odontologos']);

    // Rutas de prueba por roles
    Route::middleware('role:paciente')->get('/paciente-test', function () {
        return response()->json(['message' => 'Eres paciente!']);
    });

    Route::middleware('role:odontologo')->get('/odontologo-test', function () {
        return response()->json(['message' => 'Eres odontólogo!']);
    });

    Route::middleware('role:administrador')->get('/admin-test', function () {
        return response()->json(['message' => 'Eres administrador!']);
    });

    Route::middleware('role:asistente')->get('/asistente-test', function () {
        return response()->json(['message' => 'Eres asistente!']);
    });
Route::prefix('dashboard')->group(function () {
    // === Rutas actuales ===
    Route::get('/citas-por-mes-anio',        [DashboardController::class, 'citasPorMesAnio']);
    Route::get('/citas-por-dia-semana-mes',  [DashboardController::class, 'citasPorDiaSemanaMes']);        
    Route::get('/ingresos-odonto',           [DashboardController::class, 'ingresosPorOdontoMes']);
    Route::get('/resumen-citas-odonto',      [DashboardController::class, 'resumenCitasPorOdonto']);
    Route::get('/citas-dias',                [DashboardController::class, 'resumenCitasDias']);        
    Route::get('/citas-estado-odontologo',        [DashboardController::class, 'reporteCitasEstadoOdontologo']);
    Route::get('/ganancia-citas-odontologo',      [DashboardController::class, 'gananciaCitasPorOdontologo']);
    Route::get('/ganancia-tratamientos-odontologo',[DashboardController::class, 'gananciaTratamientosPorOdontologo']);
    Route::get('/ganancia-por-tratamiento',       [DashboardController::class, 'gananciaPorTratamiento']);
    Route::get('/graf-citas-por-paciente',             [DashboardController::class, 'grafCitasPorPaciente']);
    Route::get('/graf-tratamientos-realizados',        [DashboardController::class, 'grafTratamientosRealizados']);
    Route::get('/graf-ingresos-mensuales-odontologo',  [DashboardController::class, 'grafIngresosMensualesPorOdontologo']);

    Route::get('/nro-odontogramas-paciente',           [DashboardController::class, 'dashboardNroOdontogramasPaciente']);
    Route::get('/total-citas-odontologo',              [DashboardController::class, 'dashboardTotalCitasOdontologo']);
    Route::get('/total-ingresos-odontologo',           [DashboardController::class, 'dashboardTotalIngresosOdontologo']);
    Route::get('/ultimo-plan-paciente',                [DashboardController::class, 'dashboardUltimoPlanPaciente']);

    // === Endpoints enfocados en un paciente (idUsuario obligatorio) ===
    Route::get('/paciente/piezas-por-estado',          [DashboardController::class, 'pacientePiezasPorEstado']);
    Route::get('/paciente/ultimo-plan',                [DashboardController::class, 'pacienteUltimoPlan']);
    Route::get('/paciente/historia-clinica',           [DashboardController::class, 'pacienteHistoriaClinica']);
    Route::get('/paciente/ultima-cita',                [DashboardController::class, 'pacienteUltimaCita']);
    Route::get('/paciente/doctores',                   [DashboardController::class, 'pacienteDoctores']);

    // === Nuevos endpoints que llaman a los cd_* (procedimientos almacenados) ===
    Route::get('/cd-ingresos-odonto-mes',              [DashboardController::class, 'cd_ingresos_por_odonto_mes']);
    Route::get('/cd-resumen-citas-dias',               [DashboardController::class, 'cd_resumen_citas_dias']);
    Route::get('/cd-resumen-citas-odonto',             [DashboardController::class, 'cd_resumen_citas_por_odonto']);
    Route::get('/cd-ganancia-citas-odontologo',        [DashboardController::class, 'cd_ganancia_citas_por_odontologo']);
    Route::get('/cd-ganancia-por-tratamiento',         [DashboardController::class, 'cd_ganancia_por_tratamiento']);
    Route::get('/cd-ganancia-tratamientos-odontologo', [DashboardController::class, 'cd_ganancia_tratamientos_por_odontologo']);
    Route::get('/cd-reporte-citas-estado-odontologo',  [DashboardController::class, 'cd_reporte_citas_por_estado_odontologo']);

    Route::get('/cd-vaciar-bd',                        [DashboardController::class, 'cd_vaciar_bd']);
    Route::get('/cd-ingresos-y-pendientes',            [DashboardController::class, 'cd_obtener_ingresos_y_pendientes']);
    Route::get('/cd-total-citas',                      [DashboardController::class, 'cd_obtener_total_citas']);
    Route::get('/cd-odontologos-activos',              [DashboardController::class, 'cd_obtener_odontologos_activos']);
    Route::get('/cd-citas-por-estado',                 [DashboardController::class, 'cd_obtener_citas_por_estado']);
    Route::get('/cd-suma-pagado',                      [DashboardController::class, 'cd_obtener_suma_pagado']);
    Route::get('/cd-odontologos-citas-proporcion',     [DashboardController::class, 'cd_odontologos_citas_proporcion']);
    Route::get('/cd-facturacion-diaria',               [DashboardController::class, 'cd_facturacion_diaria']);
    Route::get('/cd-estados-cita-proporcion',          [DashboardController::class, 'cd_estados_cita_proporcion']);
    Route::get('/cd-resumen-administrativo',           [DashboardController::class, 'cd_resumen_administrativo']);
    Route::get('/cd-tratamientos-proporcion',          [DashboardController::class, 'cd_tratamientos_proporcion']);
    Route::get('/cd-odontogramas-odontologos',         [DashboardController::class, 'cd_odontogramas_odontologos']);
    Route::get('/cd-paciente-doctores',                [DashboardController::class, 'cd_paciente_doctores']);
});



    Route::prefix('reportes')->group(function () {
        Route::get('/ingresos-y-pendientes', [ReportesController::class, 'obtenerIngresosYPendientes']);
        Route::get('/total-citas', [ReportesController::class, 'obtenerTotalCitas']);
        Route::get('/odontologos-activos', [ReportesController::class, 'obtenerOdontologosActivos']);
        Route::get('/citas-por-estado', [ReportesController::class, 'obtenerCitasPorEstado']);
        Route::get('/suma-pagado', [ReportesController::class, 'obtenerSumaPagado']);
    });

});

    
// Rutas públicas de información general
Route::get('/especialidades-list', [EspecialidadController::class, 'index']);
Route::get('/acciones-list', [AccionController::class, 'index']);
