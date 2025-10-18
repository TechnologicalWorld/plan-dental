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
            'ci_paciente' => 'required|exists:paciente,ci',
            'id_plan' => 'required|exists:plan,id',
            'fecha_asignacion' => 'required|date',
            'estado' => 'nullable|string|max:50',
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
            'fecha_asignacion' => 'date',
            'estado' => 'nullable|string|max:50',
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
