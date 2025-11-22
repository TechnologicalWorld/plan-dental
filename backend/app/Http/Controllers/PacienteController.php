<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Routing\Controller;

class PacienteController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $query = Paciente::with('usuario');

        if ($request->filled('search')) {
            $query->whereHas('usuario', function ($q) use ($request) {
                $q->where('nombre', 'like', "%{$request->search}%")
                    ->orWhere('paterno', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'codigoSeguro' => 'nullable|string|max:100',
            'lugarNacimiento' => 'nullable|string|max:255',
            'domicilio' => 'nullable|string|max:255',
            'fechaIngreso' => 'nullable|date',
            'idUsuario_Paciente' => 'required|exists:usuario,idUsuario'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $paciente = Paciente::create($request->all());
            return response()->json([
                'message' => 'Paciente registrado correctamente',
                'data' => $paciente
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar paciente', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $paciente = Paciente::with('usuario')->findOrFail($id);
            return response()->json($paciente);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Paciente no encontrado'], 404);
        }
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'codigoSeguro' => 'string|max:50',
            'lugarNacimiento' => 'string|max:200',
            'domicilio' => 'string',
            'fechaIngreso' => 'date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        try {
            $paciente = Paciente::findOrFail($id);
            $paciente->update($request->all());
            return response()->json([
                'message' => 'Paciente actualizado correctamente',
                'data' => $paciente
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Paciente no encontrado'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $paciente = Paciente::findOrFail($id);
            $paciente->delete();
            return response()->json(['message' => 'Paciente eliminado correctamente']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Paciente no encontrado'], 404);
        }
    }

    public function historialMedico(string $id)
    {
        $paciente = Paciente::with(['usuario','historiasClinicas'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'paciente' => $paciente
        ]);
    }
    // citas por paciente
    public function citasPorPaciente(string $id)
    {
        
        $paciente = Paciente::with([
            'usuario',
            'citas' => function ($q) {
                $q->orderBy('fecha', 'desc')
                  ->orderBy('hora', 'desc');
            }
        ])
        ->findOrFail($id);
        return response()->json([
        'success'  => true,
        'paciente' => $paciente->usuario, // datos del usuario del paciente
        'citas'    => $paciente->citas    // aquí vienen las citas + pivot (hace)
        ], 200);
    }
}
