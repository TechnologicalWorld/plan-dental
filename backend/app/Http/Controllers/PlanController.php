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
        $planes = Plan::with(['paciente.usuario', 'odontograma'])->get();

        return response()->json([
            'success' => true,
            'data' => $planes
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "observacion" => "nullable|string",
            "medicamentos" => "nullable|string",
            "duracionTotal" => "nullable|int",
            "duracionEstimada" => 'nullable|int',
            "idUsuario_Paciente" => 'required|exists:paciente,idUsuario_Paciente',
            "idOdontograma" => 'required|exists:odontograma,idOdontograma',
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $plan = Plan::create($request->all());
        $plan->load(['paciente.usuario', 'odontograma']);
        return response()->json(['message' => 'Plan creado correctamente', 'data' => $plan], 201);
    }

    public function show($id)
    {
        try {
            $plan = Plan::with(['paciente.usuario', 'odontograma'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $plan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Plan no encontrado'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'observacion' => 'nullable|string',
            'medicamentos' => 'nullable|string',
            'duracionTotal' => 'integer',
            'duracionEstimada' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        try {
            $plan = Plan::findOrFail($id);
            $plan->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Plan actualizado correctamente',
                'data' => $plan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Plan no encontrado',
                'detalle'=>$e
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $plan = Plan::findOrFail($id);
            $plan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Plan eliminado correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'No se pudo eliminar el plan'
            ], 500);
        }
    }
}
