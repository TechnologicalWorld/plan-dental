<?php

namespace App\Http\Controllers;

use App\Models\Odontologo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OdontologoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Odontologo::with('usuario')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ci' => 'required|exists:usuario,ci',
            'fechaContratacion' => 'date|nullable',
            'horario' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $odontologo = Odontologo::create($request->all());
        return response()->json($odontologo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        return Odontologo::with('usuario')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $odontologo = Odontologo::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'ci' => 'required|exists:usuario,ci',
            'fechaContratacion' => 'date|nullable',
            'horario' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 244);
        }

        $odontologo->update(request()->all());
        return response()->json($odontologo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $odontologo = Odontologo::findOrFail($id);
        $odontologo->delete();
        return response()->json(null, 204);
    }
}
