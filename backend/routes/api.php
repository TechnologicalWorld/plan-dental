<?php

use App\Http\Controllers\AdministradorController;
use App\Http\Controllers\AsistenteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OdontologoController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('usuarios',UsuarioController::class);
Route::apiResource('pacientes',PacienteController::class);
Route::apiResource('odontologos',OdontologoController::class);
Route::apiResource('asistentes',AsistenteController::class);
Route::apiResource('administradores',AdministradorController::class);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
        
    Route::middleware('role:paciente')->get('/paciente-test', function () {
        return response()->json(['message' => 'Eres paciente!']);
    });
});
