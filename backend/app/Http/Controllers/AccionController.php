<?php

namespace App\Http\Controllers;

use App\Models\Accion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccionController extends Controller
{
    public function index()
    {
        return Accion::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $accion = Accion::create($request->all());
        return response()->json($accion, 201);
    }

    public function show($id)
    {
        return Accion::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:100',
            'descripcion' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $accion = Accion::findOrFail($id);
        $accion->update($request->all());

        return response()->json($accion, 200);
    }

    public function destroy($id)
    {
        $accion = Accion::findOrFail($id);
        $accion->delete();

        return response()->json(['message' => 'Acción eliminada correctamente'], 204);
    }
}
