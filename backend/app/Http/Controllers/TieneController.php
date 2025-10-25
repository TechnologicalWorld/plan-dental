<?php

namespace App\Http\Controllers;

use App\Models\Tiene;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class TieneController extends Controller
{
    public function index()
    {
        return Tiene::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "idEspecialidad" => 'required|exists:especialidad,idEspecialidad',
            "idUsuario_Odontologo" => 'required|exists:odontologo,idUsuario_Odontologo',

        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $tiene = Tiene::create($request->all());
        return response()->json($tiene, 201);
    }

    public function show($id)
    {
        return Tiene::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "idEspecialidad" => 'required|exists:especialidad,idEspecialidad',
            "idUsuario_Odontologo" => 'required|exists:odontologo,idUsuario_Odontologo',

        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $tiene = Tiene::findOrFail($id);
        $tiene->update($request->all());

        return response()->json($tiene, 200);
    }

    public function destroy($id)
    {
        $tiene = Tiene::findOrFail($id);
        $tiene->delete();

        return response()->json(['message' => 'Registro eliminado correctamente'], 204);
    }
}
