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
            "idTratamiento" => 'exists:tratamiento,idTratamiento',
            "idPieza" => 'exists:pieza_dental,idPieza',
            "fecha" => "nullable|date",
            "diagnosticoCIE" => "nullable|string",
            "procedimientoIndicacion" => "nullable|string",
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $evolucion = Evolucion::create($request->all());
        return response()->json(['message' => 'Evolución registrada correctamente', 'data' => $evolucion], 201);
    }

    public function show($id)
    {
        try {
            $evolucion = Evolucion::with(['tratamiento', 'pieza'])->findOrFail($id);
            return response()->json($evolucion);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Evolución no encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $evolucion = Evolucion::findOrFail($id);
            $validator = Validator::make($request->all(), [
                "idTratamiento" => 'exists:tratamiento,idTratamiento',
                "idPieza" => 'exists:pieza_dental,idPieza',
                "fecha" => "nullable|date",
                "diagnosticoCIE" => "nullable|string",
                "procedimientoIndicacion" => "nullable|string",
            ]);

            if ($validator->fails())
                return response()->json(['errors' => $validator->errors()], 422);

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
