<?php

namespace App\Http\Controllers;

use App\Models\Odontograma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OdontogramaController extends Controller
{

    public function index()
    {
        $odontogramas = Odontograma::with(['planes', 'sesiones'])->get();
        return response()->json([
            'success' => true,
            'data' => $odontogramas
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'fecha' => 'required|date',
            'observacion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $odontograma = Odontograma::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Odontograma creado correctamente',
            'data' => $odontograma
        ], 201);
    }

    public function show($id)
    {
        try {
            $odontograma = Odontograma::with(['planes.paciente.usuario', 'sesiones'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $odontograma
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Odontograma no encontrado'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $odontograma = Odontograma::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:100',
            'descripcion' => 'nullable|string',
            'fecha' => 'date',
            'observacion' => 'nullable|string'
        ]);

        try {
            $odontograma = Odontograma::findOrFail($id);
            $odontograma->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Odontograma actualizado correctamente',
                'data' => $odontograma
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Odontograma no encontrado'
            ], 404);
        }
    }


    public function destroy($id)
    {
        try {
            $odontograma = Odontograma::findOrFail($id);
            $odontograma->delete();

            return response()->json([
                'success' => true,
                'message' => 'Odontograma eliminado correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'No se pudo eliminar el odontograma'
            ], 500);
        }
    }
}
