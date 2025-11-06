<?php

namespace App\Http\Controllers;

use App\Models\Especialidad;
use App\Models\Odontologo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EspecialidadController extends Controller
{
    public function index()
    {
        $especialidades = Especialidad::all();

        return response()->json([
            'success' => true,
            'data' => $especialidades
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:especialidad,nombre',
            'descripcion' => 'nullable|string|max:255'
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $especialidad = Especialidad::create($request->all());
        return response()->json(['message' => 'Especialidad creada correctamente', 'data' => $especialidad], 201);
    }

    public function show(string $id)
    {
        try {
            $especialidad = Especialidad::with('odontologos.usuario')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $especialidad
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Especialidad no encontrada'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:100|unique:especialidad,nombre,' . $id . ',idEspecialidad',
            'descripcion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $especialidad = Especialidad::findOrFail($id);
            $especialidad->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Especialidad actualizada correctamente',
                'data' => $especialidad
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Especialidad no encontrada'
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $especialidad = Especialidad::findOrFail($id);
            $especialidad->delete();
            return response()->json(['message' => 'Especialidad eliminada correctamente']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Especialidad no encontrada'], 404);
        }
    }

    public function odontologos($id){
        $especialidad = Especialidad::findOrFail($id);
        if (!$especialidad) {
            return response()->json(['error' => 'Especialidad no encontrada'], 404);
        }

        $odontologos = $especialidad->odontologos;

        return response()->json(['data'=>$odontologos]);
    }
}
