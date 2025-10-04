<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Paciente::with('usuario')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validator = Validator::make($request->all(), [
            'idUsuario'=>'required|exists:usuario,idUsuario',
            'codigoSeguro'=>'nullable|string',
            'lugarNacimiento'=>'nullable|string',
            'domicilio'=>'nullable|string',
            'fechaIngreso'=>'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],422);
        }

        $paciente = Paciente::create($request->all());
        return response($paciente,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        return Paciente::with('usuario')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $paciente = Paciente::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'idUsuario'=>'exists:usuario,idUsuario',
            'codigoSeguro'=>'nullable|string',
            'lugarNacimiento'=>'nullable|string',
            'domicilio'=>'nullable|string',
            'fechaIngreso'=>'date',
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()],422);
        }
        
        $paciente->update($request->all());
        return response()->json($paciente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $paciente = Paciente::findOrFail($id);
        $paciente->delete();
        return response()->json([],204);
    }
}
