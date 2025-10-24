<?php

namespace App\Http\Controllers;

use App\Models\Evolucion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EvolucionController extends Controller
{
    public function index()
    {
        return response()->json(Evolucion::with(['tratamiento', 'pieza'])->paginate(10));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fecha' => 'required|date',
            'descripcion' => 'required|string|max:255',
            'observacion' => 'nullable|string',
            'idPaciente' => 'required|exists:paciente,idPaciente',
            'idOdontologo' => 'required|exists:odontologo,idOdontologo'
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $evolucion = Evolucion::create($request->all());
        return response()->json(['message' => 'Evolución registrada correctamente', 'data' => $evolucion], 201);
    }

    public function show($id)
    {
        try {
            $evolucion = Evolucion::with(['paciente', 'odontologo'])->findOrFail($id);
            return response()->json($evolucion);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Evolución no encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $evolucion = Evolucion::findOrFail($id);
            $evolucion->update($request->all());
            return response()->json(['message' => 'Evolución actualizada correctamente', 'data' => $evolucion]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Evolución no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $evolucion = Evolucion::findOrFail($id);
            $evolucion->delete();
            return response()->json(['message' => 'Evolución eliminada correctamente']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Evolución no encontrada'], 404);
        }
    }
}
