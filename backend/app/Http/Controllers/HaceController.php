<?php

namespace App\Http\Controllers;

use App\Models\Hace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HaceController extends Controller
{
    public function index()
    {
        return Hace::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idUsuario_Paciente' => 'required|exists:paciente,idUsuario_Paciente',
            'idCita' => 'required|exists:cita,idCita',
            'idUsuario_Asistente'=>'required|exists:asistente,idUsuario_Asistente',
            'fecha' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $hace = Hace::create($request->all());
        return response()->json($hace, 201);
    }

    public function show($id)
    {
        return Hace::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'idUsuario_Paciente' => 'exists:paciente,idUsuario_Paciente',
            'idCita' => 'exists:cita,idCita',
            'idUsuario_Asistente'=>'exists:asistente,idUsuario_Asistente',
            'fecha' => 'date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $hace = Hace::findOrFail($id);
        $hace->update($request->all());

        return response()->json($hace, 200);
    }

    public function destroy($id)
    {
        $hace = Hace::findOrFail($id);
        $hace->delete();

        return response()->json(['message' => 'Registro eliminado correctamente'], 204);
    }
}
