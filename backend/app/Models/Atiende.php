<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atiende extends Model
{
    use HasFactory;

    protected $table = 'atiende';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario_Odontologo', 
        'idCita', 
        'fecha'
    ];

    protected $casts = [
        'fecha' => 'date'
    ];

    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }
    public function cita() { 
        return $this->belongsTo(Cita::class, 'idCita', 'idCita'); 
    }
}
