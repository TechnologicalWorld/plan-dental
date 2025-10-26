<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tiene extends Model
{
    use HasFactory;

    protected $table = 'tiene';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idEspecialidad', 
        'idUsuario_Odontologo'
    ];

    public function especialidad() { 
        return $this->belongsTo(Especialidad::class, 'idEspecialidad', 'idEspecialidad'); 
    }
    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo'); 
    }
}
