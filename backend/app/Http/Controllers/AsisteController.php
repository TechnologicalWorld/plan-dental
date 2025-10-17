<?php

namespace App\Http\Controllers;

use App\Models\Asiste;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AsisteController extends Controller
{
    public function index()
    {
        return Asiste::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ci_asistente' => 'required|exists:asistente,ci',
            'id_sesion' => 'required|exists:sesion,id',
            'turno' => 'nullable|string|max:20',
            'fecha' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $asiste = Asiste::create($request->all());
        return response()->json($asiste, 201);
    }

    public function show($id)
    {
        return Asiste::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'turno' => 'nullable|string|max:20',
            'fecha' => 'date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $asiste = Asiste::findOrFail($id);
        $asiste->update($request->all());

        return response()->json($asiste, 200);
    }

    public function destroy($id)
    {
        $asiste = Asiste::findOrFail($id);
        $asiste->delete();

        return response()->json(['message' => 'Asistencia eliminada correctamente'], 204);
    }
}
