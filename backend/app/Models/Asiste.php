<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asiste extends Model
{
    use HasFactory;

    protected $table = 'asiste';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idSesion',
        'idUsuario_Paciente', 
        'idUsuario_Odontologo', 
        'fecha'
    ];

    protected $casts = [
        'fecha' => 'date'
    ];

    public function sesion() { 
        return $this->belongsTo(Sesion::class, 'idSesion', 'idSesion');
    }
    public function paciente() { 
        return $this->belongsTo(Paciente::class, 'idUsuario_Paciente', 'idUsuario_Paciente'); 
    }
    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo'); 
    }
}
