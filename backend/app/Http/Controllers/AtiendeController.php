<?php

namespace App\Http\Controllers;

use App\Models\Atiendes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AtiendesController extends Controller
{
    public function index()
    {
        return Atiendes::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ci_odontologo' => 'required|string|exists:odontologo,ci',
            'ci_paciente' => 'required|string|exists:paciente,ci',
            'fecha' => 'required|date',
            'hora' => 'required|string|max:10',
            'motivo' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $atiende = Atiendes::create($request->all());
        return response()->json($atiende, 201);
    }

    public function show($id)
    {
        return Atiendes::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ci_odontologo' => 'string|exists:odontologo,ci',
            'ci_paciente' => 'string|exists:paciente,ci',
            'fecha' => 'date',
            'hora' => 'string|max:10',
            'motivo' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $atiende = Atiendes::findOrFail($id);
        $atiende->update($request->all());

        return response()->json($atiende, 200);
    }

    public function destroy($id)
    {
        $atiende = Atiendes::findOrFail($id);
        $atiende->delete();

        return response()->json(['message' => 'Registro eliminado correctamente'], 204);
    }
}
