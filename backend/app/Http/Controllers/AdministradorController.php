<?php

namespace App\Http\Controllers;

use App\Models\Administrador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdministradorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Administrador::with('usuario')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),
        ['ci'=>'required|exists:usuario,ci']);

        if ($validator->fails()) {
            return response()->json(["error"=>$validator->errors()],422);
        }
        $administrador = Administrador::create($request->all());
        return response()->json($administrador,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        return Administrador::with('usuario')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $administrador = Administrador::findOrFail($id);
        $validator = Validator::make($request->all(),
        ['ci'=>'required|exists:usuario,ci']);

        if ($validator->fails()) {
            return response()->json(["error"=>$validator->errors()],422);
        }

        $administrador->update($request->all());
        return response()->json($administrador);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $administrador = Administrador::findOrFail($id);
        $administrador->delete();
        return response()->json(null,204);
    }
}
