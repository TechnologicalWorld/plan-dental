<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plan';
    protected $primaryKey = 'idPlan';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'observacion',
        'medicamentos',
        'duracionTotal',
        'duracionEstimada',
        'idUsuario_Paciente',
        'idOdontograma'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }

    public function odontograma()
    {
        return $this->belongsTo(Odontograma::class, 'idOdontograma', 'idOdontograma');
    }
}
