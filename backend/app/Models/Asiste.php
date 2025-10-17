<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asiste extends Model
{
    use HasFactory;

    protected $table = 'asiste';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idSesion',
        'idPaciente', 
        'idOdontologo', 
        'fecha'
    ];

    protected $casts = ['fecha' => 'date'];

    public function sesion() { 
        return $this->belongsTo(Sesion::class, 'idSesion', 'idSesion');
    }
    public function paciente() { 
        return $this->belongsTo(Paciente::class, 'idPaciente', 'idUsuario_Paciente'); 
    }
    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idOdontologo', 'idUsuario_Odontologo'); 
    }
}
