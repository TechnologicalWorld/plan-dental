<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // ======================= ENDPOINTS =======================

    public function citasPorMesAnio(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable', 
        ]);

        $anio = $req->filled('anio') ? (int)$req->query('anio') : null;
        $mes  = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string)$req->query('mes'));
            if ($mes === null) {
                return response()->json(['error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'], 422);
            }
        }

        try {
            $rows = $this->callSp('citas_por_mes_anio', [$anio, $mes]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null,
            ], 500);
        }
    }

    public function citasPorDiaSemanaMes(Request $req)
    {
        $req->validate([
            'anio' => 'required|integer|min:1900|max:2100',
            'mes'  => 'required', 
        ]);

        $anio = (int) $req->query('anio');
        $mesInput = (string) $req->query('mes');

        $mes = $this->normalizeSpanishMonth($mesInput);
        if ($mes === null) {
            return response()->json([
                'error' => "Mes no reconocido. Usa 1..12 o nombres/abreviaturas en español (ej: 11, 'nov', 'noviembre')."
            ], 422);
        }

        try {
            $rows = $this->callSp('citas_por_dia_semana_mes', [$mes, $anio]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al ejecutar el procedimiento almacenado.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function ingresosPorOdontoMes(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable', 
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;
        $mes  = null;

        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español (ene, feb, marzo, setiembre, etc.)'
                ], 422);
            }
        }

        try {
            $rows = $this->callSp('ingresos_por_odonto_mes', [$anio, $mes]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar ingresos_por_odonto_mes.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function resumenCitasPorOdonto(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        try {
            $rows = $this->callSp('resumen_citas_por_odonto', [$anio, $mes]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar resumen_citas_por_odonto.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function resumenCitasDias(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',            
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;
        $idu  = $req->filled('idUsuario') ? (int) $req->query('idUsuario') : null;

        $mes  = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        try {
            $rows = $this->callSp('resumen_citas_dias', [$anio, $mes, $idu]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar resumen_citas_dias.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function reporteCitasEstadoOdontologo(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable',
        ]);

        $anio = $req->filled('anio') ? (int)$req->query('anio') : null;
        $mes  = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string)$req->query('mes'));
            if ($mes === null) {
                return response()->json(['error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'], 422);
            }
        }

        try {
            $rows = $this->callSp('sp_reporte_citas_por_estado_odontologo', [$anio, $mes]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar sp_reporte_citas_por_estado_odontologo.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function gananciaCitasPorOdontologo(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable',
        ]);

        $anio = $req->filled('anio') ? (int)$req->query('anio') : null;
        $mes  = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string)$req->query('mes'));
            if ($mes === null) {
                return response()->json(['error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'], 422);
            }
        }

        try {
            $rows = $this->callSp('sp_ganancia_citas_por_odontologo', [$anio, $mes]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar sp_ganancia_citas_por_odontologo.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function gananciaTratamientosPorOdontologo(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable',
        ]);

        $anio = $req->filled('anio') ? (int)$req->query('anio') : null;
        $mes  = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string)$req->query('mes'));
            if ($mes === null) {
                return response()->json(['error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'], 422);
            }
        }

        try {
            $rows = $this->callSp('sp_ganancia_tratamientos_por_odontologo', [$anio, $mes]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar sp_ganancia_tratamientos_por_odontologo.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function gananciaPorTratamiento(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable',
        ]);

        $anio = $req->filled('anio') ? (int)$req->query('anio') : null;
        $mes  = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string)$req->query('mes'));
            if ($mes === null) {
                return response()->json(['error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'], 422);
            }
        }

        try {
            $rows = $this->callSp('sp_ganancia_por_tratamiento', [$anio, $mes]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar sp_ganancia_por_tratamiento.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    private function callSp(string $spName, array $args = []): array
    {
        $placeholders = implode(',', array_fill(0, count($args), '?'));
        $sql = "CALL {$spName}({$placeholders})";

        $pdo  = DB::getPdo();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($args);

        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];

        while ($stmt->nextRowset()) 

        $stmt->closeCursor();
        return $rows;
    }

    private function monthToInt(string $in): ?int
    {
        $m = mb_strtolower(trim($in), 'UTF-8');
        if (preg_match('/^(0?[1-9]|1[0-2])$/', $m)) return (int) $m;

        $map = [
            'ene'=>1,'enero'=>1,
            'feb'=>2,'febrero'=>2,
            'mar'=>3,'marzo'=>3,
            'abr'=>4,'abril'=>4,
            'may'=>5,'mayo'=>5,
            'jun'=>6,'junio'=>6,
            'jul'=>7,'julio'=>7,
            'ago'=>8,'agosto'=>8,
            'sep'=>9,'sept'=>9,'set'=>9,'septiembre'=>9,'setiembre'=>9,
            'oct'=>10,'octubre'=>10,
            'nov'=>11,'noviembre'=>11,
            'dic'=>12,'diciembre'=>12,
        ];
        return $map[$m] ?? null;
    }

    private function normalizeSpanishMonth(string $mes): ?string
    {
        $s = strtolower(trim($mes));
        if (ctype_digit($s)) {
            $n = (int)$s;
            $mapNum = [
                1=>'enero', 2=>'febrero', 3=>'marzo', 4=>'abril',
                5=>'mayo',  6=>'junio',   7=>'julio', 8=>'agosto',
                9=>'septiembre', 10=>'octubre', 11=>'noviembre', 12=>'diciembre'
            ];
            return $mapNum[$n] ?? null;
        }
        $aceptados = [
            'ene','enero','feb','febrero','mar','marzo','abr','abril','may','mayo',
            'jun','junio','jul','julio','ago','agosto','sep','sept','septiembre','setiembre',
            'oct','octubre','nov','noviembre','dic','diciembre'
        ];
        return in_array($s, $aceptados, true) ? $s : null;
    }
    public function grafCitasPorPaciente(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        $idUsuario = $req->filled('idUsuario')
            ? (int) $req->query('idUsuario')
            : null;

        try {
            $rows = $this->callSp('graf_citas_por_paciente', [$anio, $mes, $idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar graf_citas_por_paciente.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function grafTratamientosRealizados(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        $idUsuario = $req->filled('idUsuario')
            ? (int) $req->query('idUsuario')
            : null;

        try {
            $rows = $this->callSp('graf_tratamientos_realizados', [$anio, $mes, $idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar graf_tratamientos_realizados.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function grafIngresosMensualesPorOdontologo(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        $idUsuario = $req->filled('idUsuario')
            ? (int) $req->query('idUsuario')
            : null;

        try {
            $rows = $this->callSp('graf_ingresos_mensuales_por_odontologo', [$anio, $mes, $idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar graf_ingresos_mensuales_por_odontologo.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function dashboardNroOdontogramasPaciente(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        $idUsuario = $req->filled('idUsuario')
            ? (int) $req->query('idUsuario')
            : null;

        try {
            $rows = $this->callSp('dashboard_nro_odontogramas_paciente', [$anio, $mes, $idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_nro_odontogramas_paciente.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function dashboardTotalCitasOdontologo(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        $idUsuario = $req->filled('idUsuario')
            ? (int) $req->query('idUsuario')
            : null;

        try {
            $rows = $this->callSp('dashboard_total_citas_odontologo', [$anio, $mes, $idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_total_citas_odontologo.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function dashboardTotalIngresosOdontologo(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        $idUsuario = $req->filled('idUsuario')
            ? (int) $req->query('idUsuario')
            : null;

        try {
            $rows = $this->callSp('dashboard_total_ingresos_odontologo', [$anio, $mes, $idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_total_ingresos_odontologo.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function dashboardUltimoPlanPaciente(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',
            'idUsuario' => 'nullable|integer|min:1',
        ]);

        $anio = $req->filled('anio') ? (int) $req->query('anio') : null;

        $mes = null;
        if ($req->filled('mes')) {
            $mes = $this->monthToInt((string) $req->query('mes'));
            if ($mes === null) {
                return response()->json([
                    'error' => 'Mes no reconocido: usa 1..12 o nombres/abreviaturas en español'
                ], 422);
            }
        }

        $idUsuario = $req->filled('idUsuario')
            ? (int) $req->query('idUsuario')
            : null;

        try {
            $rows = $this->callSp('dashboard_ultimo_plan_paciente', [$anio, $mes, $idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_ultimo_plan_paciente.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }
    
public function pacientePiezasPorEstado(Request $req)
{
    $req->validate([
        'idUsuario' => 'required|integer|min:1',
    ]);

    $idUsuario = (int) $req->query('idUsuario');

    try {
        $rows = $this->callSp('dashboard_piezas_por_estado_paciente', [$idUsuario]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al ejecutar dashboard_piezas_por_estado_paciente.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

    public function pacienteUltimoPlan(Request $req)
    {
        $req->validate([
            'idUsuario' => 'required|integer|min:1',
        ]);

        $idUsuario = (int) $req->query('idUsuario');

        try {
            $rows = $this->callSp('g_dashboard_ultimo_plan_paciente', [$idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_ultimo_plan_paciente.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function pacienteHistoriaClinica(Request $req)
    {
        $req->validate([
            'idUsuario' => 'required|integer|min:1',
        ]);

        $idUsuario = (int) $req->query('idUsuario');

        try {
            $rows = $this->callSp('dashboard_historia_clinica_paciente', [$idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_historia_clinica_paciente.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function pacienteUltimaCita(Request $req)
    {
        $req->validate([
            'idUsuario' => 'required|integer|min:1',
        ]);

        $idUsuario = (int) $req->query('idUsuario');

        try {
            $rows = $this->callSp('dashboard_ultima_cita_paciente', [$idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_ultima_cita_paciente.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    public function pacienteDoctores(Request $req)
    {
        $req->validate([
            'idUsuario' => 'required|integer|min:1',
        ]);

        $idUsuario = (int) $req->query('idUsuario');

        try {
            $rows = $this->callSp('dashboard_doctores_paciente', [$idUsuario]);
            return response()->json($rows, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Error al ejecutar dashboard_doctores_paciente.',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }

    // Funciones para procedimientos almacenados
/**
 * Helper para obtener año y mes desde la query (?anio=&mes=)
 */
private function getAnioMes(Request $request): array
{
    $anio = $request->query('anio');
    $mes  = $request->query('mes');

    return [
        $anio !== null && $anio !== '' ? (int)$anio : null,
        $mes  !== null && $mes  !== '' ? (int)$mes  : null,
    ];
}

/**
 * Obtener ingresos por odontólogo por mes
 */
public function cd_ingresos_por_odonto_mes(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL ingresos_por_odonto_mes(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener ingresos por odontólogo.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

/**
 * Resumen de citas por días de la semana
 */
public function cd_resumen_citas_dias(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $idUsuario = $request->query('idUsuario');
        $idUsuario = $idUsuario !== null && $idUsuario !== '' ? (int)$idUsuario : null;

        $rows = DB::select('CALL resumen_citas_dias(?, ?, ?)', [$anio, $mes, $idUsuario]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener resumen de citas por días.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

/**
 * Resumen de citas por odontólogo
 */
public function cd_resumen_citas_por_odonto(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL resumen_citas_por_odonto(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener resumen de citas por odontólogo.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

/**
 * Ganancia de citas por odontólogo
 */
public function cd_ganancia_citas_por_odontologo(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_ganancia_citas_por_odontologo(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener ganancia de citas por odontólogo.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

/**
 * Ganancia por tratamiento
 */
public function cd_ganancia_por_tratamiento(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_ganancia_por_tratamiento(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener ganancia por tratamiento.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

/**
 * Ganancia de tratamientos por odontólogo
 */
public function cd_ganancia_tratamientos_por_odontologo(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_ganancia_tratamientos_por_odontologo(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener ganancia de tratamientos por odontólogo.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_reporte_citas_por_estado_odontologo(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_reporte_citas_por_estado_odontologo(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener reporte de citas por estado.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_vaciar_bd(Request $request)
{
    try {
        $dbname = $request->query('dbname');

        DB::select('CALL vaciar_bd(?)', [$dbname]);
        return response()->json([
            'message' => 'Base de datos vaciada correctamente.',
        ], 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al vaciar la base de datos.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_obtener_ingresos_y_pendientes(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL obtener_ingresos_y_pendientes(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener ingresos y pendientes.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_obtener_total_citas(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL obtener_total_citas(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener total de citas.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_obtener_odontologos_activos()
{
    try {
        $rows = DB::select('CALL obtener_odontologos_activos()');
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener odontólogos activos.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_obtener_citas_por_estado(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL obtener_citas_por_estado(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener citas por estado.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_obtener_suma_pagado(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL obtener_suma_pagado(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener suma de pagos.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_odontologos_citas_proporcion(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_odontologos_citas_proporcion(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener proporción de citas por odontólogo.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_facturacion_diaria(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_facturacion_diaria(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener facturación diaria.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_estados_cita_proporcion(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_estados_cita_proporcion(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener proporción de estados de cita.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_resumen_administrativo(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_resumen_administrativo(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener resumen administrativo.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_tratamientos_proporcion(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_tratamientos_proporcion(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener proporción de tratamientos.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_odontogramas_odontologos(Request $request)
{
    try {
        [$anio, $mes] = $this->getAnioMes($request);

        $rows = DB::select('CALL sp_odontogramas_odontologos(?, ?)', [$anio, $mes]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener odontogramas por odontólogos.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}

public function cd_paciente_doctores(Request $request)
{
    try {
        $idUsuario = $request->query('idUsuario');
        $idUsuario = $idUsuario !== null && $idUsuario !== '' ? (int)$idUsuario : null;

        $rows = DB::select('CALL dashboard_doctores_paciente(?)', [$idUsuario]);
        return response()->json($rows, 200);
    } catch (\Throwable $e) {
        return response()->json([
            'error'   => 'Error al obtener doctores del paciente.',
            'detalle' => $e->getMessage(),
        ], 500);
    }
}
}
