<?php

namespace App\Http\Controllers;

use App\Models\Sesion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SesionController extends Controller
{
    public function index()
    {
        return Sesion::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'hora' => 'required|string|max:10',
            'observacion' => 'nullable|string|max:255',
            'fecha' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $sesion = Sesion::create($request->all());
        return response()->json($sesion, 201);
    }

    public function show($id)
    {
        return Sesion::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'hora' => 'string|max:10',
            'observacion' => 'nullable|string|max:255',
            'fecha' => 'date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $sesion = Sesion::findOrFail($id);
        $sesion->update($request->all());

        return response()->json($sesion, 200);
    }

    public function destroy($id)
    {
        $sesion = Sesion::findOrFail($id);
        $sesion->delete();

        return response()->json(['message' => 'Sesión eliminada correctamente'], 204);
    }
}
