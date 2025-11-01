<?php

namespace App\Http\Controllers;

use App\Models\PiezaDental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PiezaDentalController extends Controller
{
    public function index()
    {
        return PiezaDental::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'ubicacion' => 'nullable|string|max:50',
            'estado' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $pieza = PiezaDental::create($request->all());
        return response()->json($pieza, 201);
    }

    public function show($id)
    {
        return PiezaDental::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'ubicacion' => 'nullable|string|max:50',
            'estado' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $pieza = PiezaDental::findOrFail($id);
        $pieza->update($request->all());

        return response()->json($pieza, 200);
    }

    public function destroy($id)
    {
        $pieza = PiezaDental::findOrFail($id);
        $pieza->delete();

        return response()->json(['message' => 'Pieza dental eliminada correctamente'], 204);
    }

    public function porPaciente(string $id){
        
    }
}
