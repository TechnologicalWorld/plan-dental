<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hace extends Model
{
    use HasFactory;

    protected $table = 'hace';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario_Paciente', 
        'idCita', 
        'idUsuario_Asistente', 
        'idUsuario_Odontologo', 
        'fecha',
        
    ];

    protected $casts = [
        'fecha' => 'date'
    ];

    public function paciente() { 
        return $this->belongsTo(Paciente::class, 'idUsuario_Paciente', 'idUsuario_Paciente'); 
    }
    public function cita() { 
        return $this->belongsTo(Cita::class, 'idCita', 'idCita'); 
    }
    public function asistente() { 
        return $this->belongsTo(Asistente::class, 'idUsuario_Asistente', 'idUsuario_Asistente'); 
    }
    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo'); 
    }
}
