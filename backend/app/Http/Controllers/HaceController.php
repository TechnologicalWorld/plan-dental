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
            'ci_odontologo' => 'required|exists:odontologo,ci',
            'id_plan' => 'required|exists:plan,id',
            'fecha' => 'required|date',
            'observacion' => 'nullable|string|max:255',
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
            'fecha' => 'date',
            'observacion' => 'nullable|string|max:255',
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
