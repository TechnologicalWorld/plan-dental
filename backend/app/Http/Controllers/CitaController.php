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
            'ci_paciente' => 'required|exists:paciente,ci',
            'fecha' => 'required|date',
            'hora' => 'required|string|max:10',
            'estado' => 'nullable|string|max:50',
            'observacion' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $cita = Cita::create($request->all());
        return response()->json($cita, 201);
    }

    public function show($id)
    {
        return Cita::findOrFail($id);
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

        $cita = Cita::findOrFail($id);
        $cita->update($request->all());

        return response()->json($cita, 200);
    }

    public function destroy($id)
    {
        $cita = Cita::findOrFail($id);
        $cita->delete();

        return response()->json(['message' => 'Cita eliminada correctamente'], 204);
    }
}
