<?php

namespace App\Http\Controllers;

use App\Models\DetalleDental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DetalleDentalController extends Controller
{

    public function index()
    {
        $detalles = DetalleDental::with(['accion', 'pieza'])->get();

        return response()->json([
            'success' => true,
            'data' => $detalles
        ], 200);
    }
    

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idAccion' => 'required|exists:accion,idAccion',
            'idPiezaDental' => 'required|exists:pieza_dental,idPieza',
            'descripcion' => 'nullable|string|max:255',
            'fecha' => 'required|string|max:255',
            'cuadrante' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $detalle = DetalleDental::create($request->all());
        return response()->json($detalle, 201);
    }

    public function show($id)
    {
        return DetalleDental::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'idAccion' => 'exists:accion,idAccion',
            'idPiezaDental' => 'exists:pieza_dental,idPieza',
            'descripcion' => 'string|max:255',
            'fecha' => 'string|max:255',
            'cuadrante' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $detalle = DetalleDental::findOrFail($id);
            $detalle->update($request->all());
            $detalle->load(['accion', 'piezaDental']);

            return response()->json([
                'success' => true,
                'message' => 'Detalle dental actualizado correctamente',
                'data' => $detalle
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Detalle dental no encontrado'
            ], 404);
        }
    }

    public function destroy($id)
    {
        $detalle = DetalleDental::findOrFail($id);
        $detalle->delete();

        return response()->json(['message' => 'Detalle dental eliminado correctamente'], 204);
    }
}
