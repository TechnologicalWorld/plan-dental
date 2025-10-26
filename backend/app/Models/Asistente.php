<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistente extends Model
{
    //
    use HasFactory;
    protected $table = 'asistente';
    protected $primaryKey = 'idUsuario_Asistente';
    protected $keyType = 'int';
    public $incrementing = false;

    protected $fillable = [
        'idUsuario_Asistente',
        'turno',
        'fechaContratacion',
    ];

    protected $casts = [
        'fechaContratacion' => 'date',
        'turno' => 'string',
    ];
    
    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario_Asistente','idUsuario');
    }
    public function citas()
    {
        return $this->belongsToMany(Cita::class, 'hace', 'idUsuario_Asistente', 'idCita')->withPivot('fecha', 'idUsuario_Paciente', 'idUsuario_Odontologo');
    }
}
