<?php

namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HistoriaClinicaController extends Controller
{
    public function index()
    {
        $historias = HistoriaClinica::with(['paciente.usuario', 'odontologo.usuario'])->get();

        return response()->json([
            'success' => true,
            'data' => $historias
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'antecendentesPatologicos' => 'nullable|string',
            'motivoConsulta' => 'required|string',
            'signosVitales' => 'nullable|string',
            'descripcionSignosSintomasDentales' => 'nullable|string',
            'examenClinicoBucoDental' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'enfermedadActual' => 'nullable|string',
            'idUsuario_Paciente' => 'required|exists:paciente,idUsuario_Paciente',
            'idUsuario_Odontologo' => 'required|exists:odontologo,idUsuario_Odontologo'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $historia = HistoriaClinica::create($request->all());
        $historia->load(['paciente.usuario', 'odontologo.usuario']);

        return response()->json([
            'success' => true,
            'message' => 'Historia clínica creada correctamente',
            'data' => $historia
        ], 201);
    }


    public function show($id)
    {
        try {
            $historia = HistoriaClinica::with(['paciente.usuario', 'odontologo.usuario'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $historia
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Historia clinica no encontrada',
                'detalles' => $e
            ], 404);
        }
    }

    /** Actualizar una historia clínica */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'antecendentesPatologicos' => 'nullable|string',
            'motivoConsulta' => 'string',
            'signosVitales' => 'nullable|string',
            'descripcionSignosSintomasDentales' => 'nullable|string',
            'examenClinicoBucoDental' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'enfermedadActual' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $historia = HistoriaClinica::findOrFail($id);
            $historia->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Historia clínica actualizada correctamente',
                'data' => $historia
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Historia clínica no encontrada'
            ], 404);
        }
    }

    /** Eliminar una historia clínica */
    public function destroy(string $id)
    {
        try {
            $historia = HistoriaClinica::findOrFail($id);
            $historia->delete();

            return response()->json([
                'success' => true,
                'message' => 'Historia clínica eliminada correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'No se pudo eliminar la historia clínica'
            ], 500);
        }
    }

    public function porPaciente(string $id){
        $paciente = Paciente::with(['usuario','historiasClinicas'])->findOrFail($id);
        return response()->json([
            'success'=>true,
            'paciente'=>$paciente
        ]);
    }
}