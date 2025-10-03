<?php

namespace App\Http\Controllers;

use App\Models\Asistente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AsistenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Asistente::with('usuario')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validator = Validator::make($request->all(), [
            'ci'=>'required|exists:usuario,ci',
            'turno'=>'required|date_format:Y-m-d H:i',
            'fechaContratacion'=>"required|date",
        ]);

        if ($validator->fails()) {
            return response()->json(["error"=>$validator->errors()],422);
        }

        $asistente = Asistente::create($request->all());

        return response()->json($asistente,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        return Asistente::with('usuario')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $asistente = Asistente::findOrFail($id);
        //
        $validator = Validator::make($request->all(), [
            'ci'=>'exists:usuario,ci',
            'turno'=>'date_format:Y-m-d H:i',
            'fechaContratacion'=>"date",
        ]);

        if ($validator->fails()) {
            return response()->json(["error"=>$validator->errors()],422);
        }

        $asistente->update($request->all());

        return response()->json($asistente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $asistente = Asistente::findOrFail($id);
        $asistente->delete();
        return response()->json(null,204);
    }
}
