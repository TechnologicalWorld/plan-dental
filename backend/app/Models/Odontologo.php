<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Odontologo extends Model
{
    use HasFactory;
    protected $table = 'odontologo';
    protected $primaryKey = 'idUsuario_Odontologo';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario_Odontologo',
        'fechaContratacion',
        'horario',
    ];

    protected $casts = [
        'fechaContratacion' => 'date',
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario_Odontologo','idUsuario');
    }
    public function especialidades(){
        return $this->belongsTo(Especialidad::class,'tiene', 'idOdontologo', 'idEspecialidad');
    }
}
