<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PlanController extends Controller
{
    public function index()
    {
        return response()->json(Plan::paginate(10));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'costo' => 'required|numeric|min:0'
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $plan = Plan::create($request->all());
        return response()->json(['message' => 'Plan creado correctamente', 'data' => $plan], 201);
    }

    public function show($id)
    {
        try {
            return response()->json(Plan::findOrFail($id));
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Plan no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $plan = Plan::findOrFail($id);
            $plan->update($request->all());
            return response()->json(['message' => 'Plan actualizado correctamente', 'data' => $plan]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Plan no encontrado'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $plan = Plan::findOrFail($id);
            $plan->delete();
            return response()->json(['message' => 'Plan eliminado correctamente']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Plan no encontrado'], 404);
        }
    }
}
