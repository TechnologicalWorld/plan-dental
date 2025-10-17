<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Efectua extends Model
{
    use HasFactory;

    protected $table = 'efectua';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idOdontograma',
        'idOdontologo',
        'idPaciente',
        'fecha'
    ];

    protected $casts = ['fecha' => 'date'];

    public function odontograma() { 
        return $this->belongsTo(Odontograma::class, 'idOdontograma', 'idOdontograma'); 
    }
    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idOdontologo', 'idUsuario_Odontologo'); 
    }
    public function paciente() { 
        return $this->belongsTo(Paciente::class, 'idPaciente', 'idUsuario_Paciente');
    }
}
