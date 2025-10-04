<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    //
    protected $table = 'paciente';
    protected $primaryKey = 'idUsuario';
    protected $keyType = 'int';
    public $incrementing = false;

    protected $fillable = [
        'idUsuario',
        'codigoSeguro',
        'lugarNacimiento',
        'domicilio',
        'fechaIngreso',
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario','idUsuario');
    }
}
