<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PiezaDental extends Model
{
    /** @use HasFactory<\Database\Factories\PiezaDentalFactory> */
    use HasFactory;

    protected $table = 'pieza_dental';
    protected $primaryKey = 'idPieza';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'posicion',
        'nombre',
        'tipo',
        'estado',
        'idOdontograma'
    ];

    public function acciones()
    {
        return $this->belongsToMany(Accion::class, 'detalle_dental', 'idPiezaDental', 'idAccion')->withPivot('descripcion', 'fecha', 'cuadrante');
    }

    public function tratamientos()
    {
        return $this->belongsToMany(Tratamiento::class, 'evolucion', 'idPieza', 'idTratamiento')->withPivot('fecha', 'diagnosticoCIE', 'procedimientoIndicacion');
    }

    public function odotogramas()
    {
        return $this->belongsTo(Odontograma::class, 'idOdontograma', 'idOdontograma');
    }
}
