<?php

namespace App\Http\Controllers;

use App\Models\DetalleDental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DetalleDentalController extends Controller
{
    public function index()
    {
        return DetalleDental::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_odontograma' => 'required|exists:odontograma,id',
            'id_pieza_dental' => 'required|exists:pieza_dental,id',
            'diagnostico' => 'nullable|string|max:255',
            'tratamiento' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:50',
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
            'diagnostico' => 'nullable|string|max:255',
            'tratamiento' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $detalle = DetalleDental::findOrFail($id);
        $detalle->update($request->all());

        return response()->json($detalle, 200);
    }

    public function destroy($id)
    {
        $detalle = DetalleDental::findOrFail($id);
        $detalle->delete();

        return response()->json(['message' => 'Detalle dental eliminado correctamente'], 204);
    }
}
