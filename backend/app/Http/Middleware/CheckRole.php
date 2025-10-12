<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $usuario = $request->user();

        foreach ($roles as $role) {
            $roleMethodMap = [
                'paciente' => 'isPaciente',
                'odontologo'=>'isOdontologo',
                'asistente'=>'isAsistente',
                'administrador'=>'isAdministrador'
            ];
            $method = $roleMethodMap[$role]??'is' . ucfirst($role);
            if (method_exists($usuario, $method) && $usuario->$method()) {
                return $next($request);
            }
        }

        return response()->json(['error' => 'No autorizado para esta accion'], 403);
    }
}
