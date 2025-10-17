<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Odontograma extends Model
{
    use HasFactory;

    protected $table = 'odontograma';
    protected $primaryKey = 'idOdontograma';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre',
        'descripcion',
        'observacion',
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
