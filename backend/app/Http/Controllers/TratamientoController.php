<?php

namespace App\Http\Controllers;

use App\Models\Tratamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TratamientoController extends Controller
{
    public function index()
    {
        $tratamientos = Tratamiento::with(['cita.pacientes.usuario'])->get();

        return response()->json([
            'success' => true,
            'data' => $tratamientos
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:tratamiento,nombre',
            "precio" => "required|numeric|min:0",
            "idCita" => "required|exists:cita,idCita"
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $tratamiento = Tratamiento::create($request->all());
        return response()->json($tratamiento, 201);
    }

    public function show($id)
    {
        try {
            $tratamiento = Tratamiento::with(['cita.pacientes.usuario', 'piezasDentales'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $tratamiento
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Tratamiento no encontrado'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:tratamiento,nombre',
            "precio" => "required|numeric|min:0",
            "idCita" => "required|exists:cita,idCita",
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $tratamiento = Tratamiento::findOrFail($id);
            $tratamiento->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tratamiento actualizado correctamente',
                'data' => $tratamiento
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Tratamiento no encontrado'
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $tratamiento = Tratamiento::findOrFail($id);
            $tratamiento->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tratamiento eliminado correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'No se pudo eliminar el tratamiento'
            ], 500);
        }
    }
}
