<?php

namespace App\Http\Controllers;

use App\Models\Asistente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AsistenteController extends Controller
{
    public function index(Request $request)
    {
        $asistentes = Asistente::with('usuario')->get();

        return response()->json([
            'success' => true,
            'data' => $asistentes
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'turno' => 'required|string|max:50',
            'fechaContratacion' => 'required|date',
            'idUsuario_Asistente' => 'required|exists:usuario,idUsuario'
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        try {
            $asistente = Asistente::create($request->all());
            return response()->json(['message' => 'Asistente registrado correctamente', 'data' => $asistente], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar asistente', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $asistente = Asistente::with('usuario')->findOrFail($id);
            return response()->json($asistente);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Asistente no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $asistente = Asistente::findOrFail($id);
            $asistente->update($request->all());
            return response()->json(['message' => 'Asistente actualizado correctamente', 'data' => $asistente]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Asistente no encontrado'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $asistente = Asistente::findOrFail($id);
            $asistente->delete();
            return response()->json(['message' => 'Asistente eliminado correctamente']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Asistente no encontrado'], 404);
        }
    }
}
