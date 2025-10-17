<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tiene extends Model
{
    use HasFactory;

    protected $table = 'tiene';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idEspecialidad', 
        'idOdontologo'
    ];

    public function especialidad() { 
        return $this->belongsTo(Especialidad::class, 'idEspecialidad', 'idEspecialidad'); 
    }
    public function odontologo() { 
        return $this->belongsTo(Odontologo::class, 'idOdontologo', 'idUsuario_Odontologo'); 
    }
}
