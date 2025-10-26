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
        'idUsuario_Paciente',
        'idUsuario_Odontologo'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }

    public function odontologo()
    {
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }
}
