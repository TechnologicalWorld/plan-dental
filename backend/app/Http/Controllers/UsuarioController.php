<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Usuario::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ci'=>'required|string|max:50|unique:usuario,ci',
            'nombre'=>'required|string',
            'paterno'=>'required|string',
            'materno'=>'nullable|string',
            'fechaNacimiento'=>'date|nullable',
            'genero'=>'in:M,F',
            'telefono'=>'nullable|string',
            'contrasena'=>'string|required',
            'correo'=>"required|email|unique:usuario,correo",
            'direccion'=>'nullable|string',
            'estado'=>'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],422);
        }
        $request['contrasena'] = Hash::make($request['contrasena']);
        $usuario = Usuario::create($request->all());
        return response()->json($usuario,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        return Usuario::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $validator = Validator::make($request->all(), [
            'ci'=>'string|max:50|unique:usuario,ci',
            'nombre'=>'string',
            'paterno'=>'string',
            'materno'=>'nullable|string',
            'fechaNacimiento'=>'date|nullable',
            'genero'=>'in:M,F',
            'telefono'=>'nullable|string',
            'correo'=>"email|unique:usuario,correo",
            'direccion'=>'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],422);
        }
        $usuario = Usuario::findOrFail($id);
        $usuario->update($request->all());
        return response()->json($usuario,201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();
        return response()->json(['message'=>'Usuario eliminado correctamente'],204);
    }
}
