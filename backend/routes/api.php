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
    HistoriaClinicaController
};

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas de autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Rutas de usuarios y roles
    Route::apiResource('usuarios', UsuarioController::class);
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
    
    // Odontólogos
    Route::post('/odontologos/{id}/asignar-especialidades', [OdontologoController::class, 'asignarEspecialidades']);
    Route::get('/odontologos/{id}/agenda', [OdontologoController::class, 'agenda']);
    
    // Pacientes
    Route::get('/pacientes/{id}/historial-medico', [PacienteController::class, 'historialMedico']);
    Route::get('/pacientes/{id}/piezas-dentales', [PiezaDentalController::class, 'porPaciente']);
    
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
});

// Rutas públicas de información general
Route::get('/especialidades-list', [EspecialidadController::class, 'index']);
Route::get('/acciones-list', [AccionController::class, 'index']);

