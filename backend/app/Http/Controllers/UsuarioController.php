<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    /** Mostrar todos los usuarios*/
    public function index()
    {
        $usuarios = Usuario::all();

        return response()->json([
            'success' => true,
            'message' => 'Lista de usuarios obtenida correctamente',
            'data' => $usuarios
        ], 200);
    }

    /** Crear un nuevo usuario */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ci' => 'required|string|max:50|unique:usuario,ci',
            'nombre' => 'required|string',
            'paterno' => 'required|string',
            'materno' => 'nullable|string',
            'fechaNacimiento' => 'nullable|date',
            'genero' => 'nullable|in:M,F',
            'telefono' => 'nullable|string',
            'contrasena' => 'required|string|min:6',
            'correo' => 'required|email|unique:usuario,correo',
            'direccion' => 'nullable|string',
            'estado' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['contrasena'] = Hash::make($data['contrasena']);

        $usuario = Usuario::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado correctamente',
            'data' => $usuario
        ], 201);
    }

    /** Mostrar un usuario específico*/
    public function show(string $id)
    {
        try {
            $usuario = Usuario::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $usuario
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ], 404);
        }
    }

    /** Actualizar un usuario existente */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'ci' => 'string|max:50|unique:usuario,ci,' . $id . ',idUsuario',
            'nombre' => 'string|nullable',
            'paterno' => 'string|nullable',
            'materno' => 'nullable|string',
            'fechaNacimiento' => 'nullable|date',
            'genero' => 'nullable|in:M,F',
            'telefono' => 'nullable|string',
            'correo' => 'email|unique:usuario,correo,' . $id . ',idUsuario',
            'direccion' => 'nullable|string',
            'estado' => 'nullable|boolean',
            'contrasena' => 'nullable|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $usuario = Usuario::findOrFail($id);
        $data = $request->all();

        if ($request->has('contrasena')) {
            $data['contrasena'] = Hash::make($data['contrasena']);
        }

        $usuario->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado correctamente',
            'data' => $usuario
        ], 200);
    }

    /** Eliminar (o desactivar) un usuario */
    public function destroy(string $id)
    {
        try {
            $usuario = Usuario::findOrFail($id);
            $usuario->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'No se pudo eliminar el usuario'
            ], 500);
        }
    }

    /** Listar usuarios por tipo de rol */
    public function odontologos()
    {
        $odontologos = Usuario::whereHas('odontologo')->get();
        return response()->json(['data' => $odontologos], 200);
    }

    public function pacientes()
    {
        $pacientes = Usuario::whereHas('paciente')->get();
        return response()->json(['data' => $pacientes], 200);
    }

    public function administradores()
    {
        $admins = Usuario::whereHas('administrador')->get();
        return response()->json(['data' => $admins], 200);
    }

    public function asistentes()
    {
        $asistentes = Usuario::whereHas('asistente')->get();
        return response()->json(['data' => $asistentes], 200);
    }
}
