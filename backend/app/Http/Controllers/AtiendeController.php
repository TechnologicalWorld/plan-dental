<?php

namespace App\Http\Controllers;

use App\Models\Atiende;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class AtiendeController extends Controller
{
    public function index()
    {
        return Atiende::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idUsuario_Odontologo' => 'required|exists:odontologo,idUsuario_Odontologo',
            'idCita' => 'required|exists:cita,idCita',
            'fecha' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $atiende = Atiende::create($request->all());
        return response()->json($atiende, 201);
    }

    public function show($id)
    {
        return Atiende::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'idUsuario_Odontologo' => 'exists:odontologo,idUsuario_Odontologo',
            'idCita' => 'exists:cita,idCita',
            'fecha' => 'date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $atiende = Atiende::findOrFail($id);
        $atiende->update($request->all());

        return response()->json($atiende, 200);
    }

    public function destroy($id)
    {
        $atiende = Atiende::findOrFail($id);
        $atiende->delete();

        return response()->json(['message' => 'Registro eliminado correctamente'], 204);
    }
}
