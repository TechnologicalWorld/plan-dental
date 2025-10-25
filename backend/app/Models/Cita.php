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
        'fecha',
        'hora',
        'tipoCita',
        'estado',
        'pagado',
        'costo'
    ];
    
    protected $casts = [
        'fecha' => 'date',
        'hora' => 'datetime:H:i',
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
