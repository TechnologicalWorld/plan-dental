<?php

namespace App\Http\Controllers;

use App\Models\Especialidad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EspecialidadController extends Controller
{
    public function index()
    {
        return response()->json(Especialidad::paginate(10));
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

    public function show($id)
    {
        try {
            return response()->json(Especialidad::findOrFail($id));
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Especialidad no encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $especialidad = Especialidad::findOrFail($id);
            $especialidad->update($request->all());
            return response()->json(['message' => 'Especialidad actualizada correctamente', 'data' => $especialidad]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Especialidad no encontrada'], 404);
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
}
