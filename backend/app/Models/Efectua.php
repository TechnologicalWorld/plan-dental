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
        'idUsuario_Odontologo',
        'idUsuario_Paciente',
        'fecha'
    ];

    protected $casts = ['fecha' => 'date'];

    public function odontograma() { 
        return $this->belongsTo(Odontograma::class, 'idOdontograma', 'idOdontograma'); 
    }
    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo'); 
    }
    public function paciente() { 
        return $this->belongsTo(Paciente::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }
}
