<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // ======================= ENDPOINTS =======================

    // GET /dashboard/citas-por-mes-anio?anio=&mes=
    public function citasPorMesAnio(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable', // acepta texto o número
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

    // GET /dashboard/citas-por-dia-semana-mes?mes=&anio=
    public function citasPorDiaSemanaMes(Request $req)
    {
        $req->validate([
            'anio' => 'required|integer|min:1900|max:2100',
            'mes'  => 'required', // número o texto; se normaliza a español
        ]);

        $anio = (int) $req->query('anio');
        $mesInput = (string) $req->query('mes');

        // Normaliza a texto español (lo requiere el SP)
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

    // GET /dashboard/ingresos-odonto?anio=&mes=
    public function ingresosPorOdontoMes(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable', // texto o número
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

    // GET /dashboard/resumen-citas-odonto?anio=&mes=
    public function resumenCitasPorOdonto(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable', // número o texto (ene, feb, octubre, 10, etc.)
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

    // GET /dashboard/citas-dias?anio=&mes=&idUsuario=
    public function resumenCitasDias(Request $req)
    {
        $req->validate([
            'anio'      => 'nullable|integer|min:1900|max:2100',
            'mes'       => 'nullable',            // número o texto (ene, feb, 10, octubre…)
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

    // GET /dashboard/citas-estado-odontologo?anio=&mes=
    public function reporteCitasEstadoOdontologo(Request $req)
    {
        $req->validate([
            'anio' => 'nullable|integer|min:1900|max:2100',
            'mes'  => 'nullable', // 1..12 o nombre/abreviatura en español
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

    // GET /dashboard/ganancia-citas-odontologo?anio=&mes=
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

    // GET /dashboard/ganancia-tratamientos-odontologo?anio=&mes=
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

    // GET /dashboard/ganancia-por-tratamiento?anio=&mes=
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

    // ======================= HELPERS =======================

    /**
     * Ejecuta un procedimiento almacenado sin caché.
     * Drena posibles result sets adicionales para evitar "Commands out of sync".
     */
    private function callSp(string $spName, array $args = []): array
    {
        $placeholders = implode(',', array_fill(0, count($args), '?'));
        $sql = "CALL {$spName}({$placeholders})";

        $pdo  = DB::getPdo();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($args);

        // Primer resultset
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];

        // Drenar posibles resultsets adicionales
        while ($stmt->nextRowset()) { /* no-op: solo drenar */ }

        $stmt->closeCursor();
        return $rows;
    }

    // Convierte 1..12 o nombres/abreviaturas de mes en español -> número 1..12
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

    // Devuelve nombre de mes en español (lo usa el SP de día-semana)
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
}
