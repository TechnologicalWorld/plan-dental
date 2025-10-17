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
    EspecialidadController
};

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('usuarios',UsuarioController::class);
Route::apiResource('pacientes',PacienteController::class);
Route::apiResource('odontologos',OdontologoController::class);
Route::apiResource('asistentes',AsistenteController::class);
Route::apiResource('administradores',AdministradorController::class);

// Acciones y Especialidades
Route::apiResource('acciones', AccionController::class);
Route::apiResource('especialidades', EspecialidadController::class);

// Relaciones
Route::apiResource('tiene', TieneController::class);
Route::apiResource('atiende', AtiendeController::class);
Route::apiResource('asiste', AsisteController::class);
Route::apiResource('hace', HaceController::class);
Route::apiResource('evalua', EvaluaController::class);
Route::apiResource('efectua', EfectuaController::class);

// Citas, Sesiones, Tratamientos
Route::apiResource('citas', CitaController::class);
Route::apiResource('sesiones', SesionController::class);
Route::apiResource('tratamientos', TratamientoController::class);

// Odontogramas y Planes
Route::apiResource('odontogramas', PiezaDentalController::class);
Route::apiResource('planes', PlanController::class);
Route::apiResource('detalledental', DetalleDentalController::class);
Route::apiResource('evoluciones', EvolucionController::class);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
        
    Route::middleware('role:paciente')->get('/paciente-test', function () {
        return response()->json(['message' => 'Eres paciente!']);
    });
});
