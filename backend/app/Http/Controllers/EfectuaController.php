<?php

namespace App\Http\Controllers;

use App\Models\Efectua;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EfectuaController extends Controller
{
    public function index()
    {
        return Efectua::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idOdontograma' => 'required|exists:odontograma,idOdontograma',
            'idUsuario_Odontologo'=>'required|exists:odontologo,idUsuario_Odontologo',
            'idUsuario_Paciente'=>'required|exists:paciente,idUsuario_Paciente',
            'fecha'=>'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $efectua = Efectua::create($request->all());
        return response()->json($efectua, 201);
    }

    public function show($id)
    {
        return Efectua::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'hora_inicio' => 'string|max:10',
            'hora_fin' => 'nullable|string|max:10',
            'observacion' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $efectua = Efectua::findOrFail($id);
        $efectua->update($request->all());

        return response()->json($efectua, 200);
    }

    public function destroy($id)
    {
        $efectua = Efectua::findOrFail($id);
        $efectua->delete();

        return response()->json(['message' => 'Registro eliminado correctamente'], 204);
    }
}
