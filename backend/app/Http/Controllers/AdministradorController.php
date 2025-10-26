<?php

namespace App\Http\Controllers;

use App\Models\Administrador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AdministradorController extends Controller
{
    public function index(Request $request)
    {
        $administradores = Administrador::with('usuario')->get();

        return response()->json([
            'success' => true,
            'data' => $administradores
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idUsuario_ADM' => 'required|exists:usuario,idUsuario'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $admin = Administrador::create($request->all());
            return response()->json([
                'message' => 'Administrador registrado correctamente',
                'data' => $admin
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar administrador', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $admin = Administrador::with('usuario')->findOrFail($id);
            return response()->json($admin);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Administrador no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $admin = Administrador::findOrFail($id);
            $admin->update($request->all());
            return response()->json(['message' => 'Administrador actualizado correctamente', 'data' => $admin]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Administrador no encontrado'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $admin = Administrador::findOrFail($id);
            $admin->delete();
            return response()->json(['message' => 'Administrador eliminado correctamente']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Administrador no encontrado'], 404);
        }
    }
}
