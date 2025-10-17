<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriaClinica extends Model
{

    use HasFactory;

    protected $table = 'historia_clinica';
    protected $primaryKey = 'id_historia_clinica';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'antecedentesPatologicos',
        'motivoConsulta',
        'signosVitales',
        'descripcionSignosSintomasDentales',
        'examenClinicoBucoDental',
        'observaciones',
        'enfermedadActual',
        'idPaciente',
        'idOdontologo'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'idPaciente', 'idUsuario_Paciente');
    }
    public function odontologo()
    {
        return $this->belongsTo(Odontologo::class, 'idOdontologo', 'idUsuario_Odontologo');
    }
}
