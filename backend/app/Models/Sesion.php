<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sesion extends Model
{
    use HasFactory;

    protected $table = 'sesion';
    protected $primaryKey = 'idSesion';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'nombre',
        'descripcion',
        'hora',
        'observacion',
        'fecha'
    ];
    protected $casts = [
        'fecha' => 'date',
        'hora' => 'datetime:H:i',
    ];
    public function pacientes()
    {
        return $this->belongsToMany(Paciente::class, 'asiste', 'idSesion', 'idUsuario_Paciente')
                    ->withPivot('fecha', 'idUsuario_Odontologo');
    }
    public function odontologos()
    {
        return $this->belongsToMany(Odontologo::class, 'asiste', 'idSesion', 'idUsuario_Odontologo')
                    ->withPivot('fecha', 'idUsuario_Paciente');
    }
    public function odontogramas()
    {
        return $this->belongsToMany(Odontograma::class, 'evalua', 'idSesion', 'idOdontograma')
                    ->withPivot('fecha', 'idUsuario_Odontologo');
    }
    
    public function asisteRelaciones()
    {
        return $this->hasMany(Asiste::class, 'idSesion', 'idSesion');
    }

    public function evaluaRelaciones()
    {
        return $this->hasMany(Evalua::class, 'idSesion', 'idSesion');
    }
}
