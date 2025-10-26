<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $table = 'cita';
    protected $primaryKey = 'idCita';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'hora',
        'fecha',
        'estado',
        'tipoCita',
        'costo',
        'pagado'
    ];

    protected $casts = [
        'fecha' => 'date',
        'hora' => 'datetime',
        'costo' => 'decimal:2',
        'pagado' => 'boolean',
        'estado' => 'string'
    ];

    // Relaciones
    public function tratamientos()
    {
        return $this->hasMany(Tratamiento::class, 'idCita', 'idCita');
    }

    public function odontologos()
    {
        return $this->belongsToMany(Odontologo::class, 'atiende', 'idCita', 'idUsuario_Odontologo')
                    ->withPivot('fecha');
    }

    public function pacientes()
    {
        return $this->belongsToMany(Paciente::class, 'hace', 'idCita', 'idUsuario_Paciente')
                    ->withPivot('fecha', 'idUsuario_Asistente', 'idUsuario_Odontologo');
    }

    public function asistentes()
    {
        return $this->belongsToMany(Asistente::class, 'hace', 'idCita', 'idUsuario_Asistente')
                    ->withPivot('fecha', 'idUsuario_Paciente', 'idUsuario_Odontologo');
    }
}