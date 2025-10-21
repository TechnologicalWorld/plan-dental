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
        'pocision',
        'nombre',
        'tipo',
        'estado',
        'idUsuario_Paciente'
    ];
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }
    public function detalle(){
        return $this->hasMany(DetalleDental::class, 'idPiezaDental', 'idPieza');
    }
    public function evoluciones()
    {
        return $this->hasMany(Evolucion::class, 'idPieza', 'idPieza');
    }
}
