<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Odontograma extends Model
{
    use HasFactory;

    protected $table = 'odontograma';
    protected $primaryKey = 'idOdontograma';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha',
        'observacion'
    ];

    protected $casts = [
        'fecha' => 'date',
    ];  
   
    public function planes()
    {
        return $this->hasMany(Plan::class, 'idOdontograma', 'idOdontograma');
    }

    public function sesiones()
    {
        return $this->belongsToMany(Sesion::class, 'evalua', 'idOdontograma', 'idSesion')
                    ->withPivot('fecha');
    }

    public function pacientes()
    {
        return $this->belongsToMany(Paciente::class, 'efectua', 'idOdontograma', 'idUsuario_Paciente')
                    ->withPivot('fecha', 'idUsuario_Odontologo');
    }

    public function odontologos()
    {
        return $this->belongsToMany(Odontologo::class, 'efectua', 'idOdontograma', 'idUsuario_Odontologo')
                    ->withPivot('fecha', 'idUsuario_Paciente');
    }
    public function evaluaRelaciones()
    {
        return $this->hasMany(Evalua::class, 'idOdontograma', 'idOdontograma');
    }

    public function efectuaRelaciones()
    {
        return $this->hasMany(Efectua::class, 'idOdontograma', 'idOdontograma');
    }

    public function piezasDentales(){
        return $this->hasMany(PiezaDental::class, 'idOdontograma', 'idOdontograma');
    }
}
