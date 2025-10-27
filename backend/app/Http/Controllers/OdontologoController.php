<?php

namespace App\Http\Controllers;

use App\Models\Odontologo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Routing\Controller;

class OdontologoController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 20);
        $query = Odontologo::with(['usuario', 'especialidades']);
        /** Kae esto solo es para filtros para las tablas */
        if ($request->filled('search')) {
            $query->whereHas('usuario', function ($q) use ($request) {
                $q->where('nombre', 'like', "%{$request->search}%")
                    ->orWhere('paterno', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->paginate($perPage));
    }

    /** Crea un nuevo odontologo*/
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fechaContratacion' => 'required|date',
            'horario' => 'required|string|max:100',
            'idEspecialidad' => 'required|exists:especialidad,idEspecialidad',
            'idUsuario_Odontologo' => 'required|exists:usuario,idUsuario',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $odontologo = Odontologo::create($request->all());
            return response()->json([
                'message' => 'Odontologo registrado exitosamente',
                'data' => $odontologo
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar odontologo', 'details' => $e->getMessage()], 500);
        }
    }

    /** Muestra un odontologo específico */
    public function show($id)
    {
        try {
            $odontologo = Odontologo::with(['usuario', 'especialidades'])->findOrFail($id);
            return response()->json($odontologo);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Odontologo no encontrado'], 404);
        }
    }

    /** Actualiza un odontologo existente */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'fechaContratacion' => 'nullable|date',
            'horario' => 'nullable|string|max:100',
            'idEspecialidad' => 'nullable|exists:especialidad,idEspecialidad',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $odontologo = Odontologo::findOrFail($id);
            $odontologo->update($request->all());

            return response()->json([
                'message' => 'Odontologo actualizado correctamente',
                'data' => $odontologo
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Odontologo no encontrado'], 404);
        }
    }

    /** Elimina un odontologo */
    public function destroy($id)
    {
        try {
            $odontologo = Odontologo::findOrFail($id);
            $odontologo->delete();

            return response()->json(['message' => 'Odontologo eliminado correctamente'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Odontologo no encontrado'], 404);
        }
    }

    public function asignarEspecialidades(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'especialidades' => 'required|array|min:1',
            'especialidades.*' => 'integer|exists:especialidad,idEspecialidad'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $odontologo = Odontologo::findOrFail($id);

        if (!$odontologo) {
            return response()->json(['error' => 'Odontologo no encontrado']);
        }

        $odontologo->especialidades()->syncWithoutDetaching($request->especialidades);

        return response()->json([
            'message' => 'Especialidades asignadas correctamente a odontologo',
            'data' => $odontologo->load('especialidades')
        ]);
    }
}
