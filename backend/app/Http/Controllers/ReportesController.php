<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportesController extends Controller
{
    // Métodos del controlador para generar reportes
    public function obtenerIngresosYPendientes(Request $request)
    {
        $anio = $request->input('anio', null);
        $mes = $request->input('mes', null);

        $resultados = DB::select("CALL obtener_ingresos_y_pendientes(?, ?)", [$anio, $mes]);

        return response()->json($resultados);
    }
    public function obtenerTotalCitas(Request $request)
    {
        $anio = $request->input('anio', null);
        $mes = $request->input('mes', null);

        $resultados = DB::select("CALL obtener_total_citas(?, ?)", [$anio, $mes]);

        return response()->json($resultados);
    }
    public function obtenerOdontologosActivos()
    {
        $resultados = DB::select("CALL obtener_odontologos_activos()");

        return response()->json($resultados);
    }
    public function obtenerCitasPorEstado(Request $request)
    {
        $anio = $request->input('anio', null);
        $mes = $request->input('mes', null);

        $resultados = DB::select("CALL obtener_citas_por_estado(?, ?)", [$anio, $mes]);

        return response()->json($resultados);
    }
    public function obtenerSumaPagado(Request $request)
    {
        $anio = $request->input('anio', null);
        $mes = $request->input('mes', null);

        $resultados = DB::select("CALL obtener_suma_pagado(?, ?)", [$anio, $mes]);

        return response()->json($resultados);
    }

}
