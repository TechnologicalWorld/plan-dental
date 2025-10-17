<?php

namespace App\Http\Controllers;

use App\Models\Evalua;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EvaluaController extends Controller
{
    public function index()
    {
        return Evalua::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_sesion' => 'required|exists:sesion,id',
            'ci_odontologo' => 'required|exists:odontologo,ci',
            'observacion' => 'nullable|string|max:255',
            'resultado' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $evalua = Evalua::create($request->all());
        return response()->json($evalua, 201);
    }

    public function show($id)
    {
        return Evalua::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'observacion' => 'nullable|string|max:255',
            'resultado' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $evalua = Evalua::findOrFail($id);
        $evalua->update($request->all());

        return response()->json($evalua, 200);
    }

    public function destroy($id)
    {
        $evalua = Evalua::findOrFail($id);
        $evalua->delete();

        return response()->json(['message' => 'Evaluación eliminada correctamente'], 204);
    }
}
