<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //
    public function login(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'correo' => 'required|email',
                'contrasena' => 'required',
                'device_name' => 'required'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validacion',
                'errors' => $validator->errors()
            ], 422);
        }

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario || !Hash::check($request->contrasena, $usuario->contrasena)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas',
                'errors' => [
                    'correo' => ['Las credenciales son incorrectas']
                ]
            ], 401);
        }

        if (!$usuario->estado) {
            return response()->json([
                'success' => false,
                'message' => 'Cuenta inactiva',
                'errors' => [
                    'correo' => ['Tu cuenta está inactiva']
                ]
            ], 403);
        }

        $token = $usuario->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $token,
            'usuario' => $usuario->load(['odontologo', 'paciente', 'administrador', 'asistente']),
            'roles' => $usuario->getRoles()
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesion cerrada correctamente']);
    }

    public function user(Request $request)
    {
        $usuario = $request->user()->load(['odontologo', 'paciente', 'administrador', 'asistente']);
        return response()->json([
            'usuario' => $usuario,
            'roles' => $usuario->getRoles(),
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ci' => 'required|string|max:50|unique:usuario,ci',
            'nombre' => 'required|string',
            'paterno' => 'required|string',
            'materno' => 'nullable|string',
            'fechaNacimiento' => 'date|nullable',
            'genero' => 'in:M,F',
            'telefono' => 'nullable|string',
            'contrasena' => 'string|required',
            'correo' => "required|email|unique:usuario,correo",
            'direccion' => 'nullable|string',
            'codigoSeguro' => 'nullable|string',
            'lugarNacimiento' => 'nullable|string',
            'domicilio' => 'nullable|string',
            'fechaIngreso' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(["error" => $validator->errors()], 422);
        }

        $request['contrasena'] = Hash::make($request['contrasena']);
        $request['estado'] = 1;
        
        $usuario = Usuario::create(
            $request->all()
        );
        $request['idUsuario_Paciente'] = $usuario->idUsuario;

        
        $usuario->paciente()->create(
            $request->all()
        );

        $token = $usuario->createToken('react-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'usuario' => $usuario->load('paciente'),
            'roles' => $usuario->getRoles(),
        ], 201);
    }
}
