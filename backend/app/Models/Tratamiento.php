<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    /** @use HasFactory<\Database\Factories\TratamientoFactory> */
    use HasFactory;
    protected $table = 'tratamiento';
    protected $primaryKey = 'idTratamiento';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'nombre',
        'precio',
        'idCita'
    ];
    protected $casts = [
        'precio' => 'decimal:2'
    ];

    public function odontologo()
    {
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }
    public function cita()
    {
        return $this->belongsTo(Cita::class, 'idCita', 'idCita');
    }
    public function piezasDentales()
    {
        return $this->belongsToMany(PiezaDental::class, 'evolucion', 'idTratamiento', 'idPieza')->withPivot('fecha', 'diagnosticoCIE', 'procedimientoIndicacion');
    }
    public function evolucionRelaciones()
    {
        return $this->hasMany(Evolucion::class, 'idTratamiento', 'idTratamiento');
    }
}
