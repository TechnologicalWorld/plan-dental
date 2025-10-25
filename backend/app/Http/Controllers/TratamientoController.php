<?php

namespace App\Http\Controllers;

use App\Models\Tratamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TratamientoController extends Controller
{
    public function index()
    {
        return Tratamiento::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "precio" => "required|numeric|min:0",
            "idCita" => "required|exists:cita,idCita",
            'nombre' => 'required|string|max:100|unique:tratamiento,nombre',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $tratamiento = Tratamiento::create($request->all());
        return response()->json($tratamiento, 201);
    }

    public function show($id)
    {
        return Tratamiento::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "precio" => "required|numeric|min:0",
            "idCita" => "required|exists:cita,idCita",
            'nombre' => 'required|string|max:100|unique:tratamiento,nombre',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $tratamiento = Tratamiento::findOrFail($id);
        $tratamiento->update($request->all());

        return response()->json($tratamiento, 200);
    }

    public function destroy($id)
    {
        $tratamiento = Tratamiento::findOrFail($id);
        $tratamiento->delete();

        return response()->json(['message' => 'Tratamiento eliminado correctamente'], 204);
    }
}
