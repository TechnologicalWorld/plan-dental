<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CitaController extends Controller
{
    public function index()
    {
        return Cita::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'hora' => 'required|date_format:H:i',
            'fecha' => 'required|date',
            'estado' => 'required|in:pendiente,confirmada,completada,cancelada',
            'tipoCita' => 'required|string|max:100',
            'costo' => 'required|numeric|min:0',
            'pagado' => 'boolean',
            'idUsuario_Paciente' => 'required|exists:paciente,idUsuario_Paciente',
            'idUsuario_Odontologo' => 'required|exists:odontologo,idUsuario_Odontologo'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $cita = Cita::create($request->all());
        return response()->json($cita, 201);
        
        $cita->pacientes()->attach($request->idUsuario_Paciente);
        $cita->odontologos()->attach($request->idUsuario_Odontologo);

        $cita->load(['pacientes.usuario', 'odontologos.usuario']);

        return response()->json([
            'success' => true,
            'message' => 'Cita creada correctamente',
            'data' => $cita
        ], 201);
    }

    /** Mostrar una cita específica */
    public function show($id)
    {
        try {
            $cita = Cita::with(['pacientes.usuario', 'odontologos.usuario', 'tratamientos'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $cita
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Cita no encontrada'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'fecha' => 'date',
            'hora' => 'string|max:10',
            'estado' => 'nullable|string|max:50',
            'observacion' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $cita = Cita::findOrFail($id);
            $cita->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cita actualizada correctamente',
                'data' => $cita
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Cita no encontrada'
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $cita = Cita::findOrFail($id);
            $cita->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cita eliminada correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'No se pudo eliminar la cita'
            ], 500);
        }
    }
}
