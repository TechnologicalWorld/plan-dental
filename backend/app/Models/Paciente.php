<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    //
    protected $table = 'paciente';
    protected $primaryKey = 'ci';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'ci',
        'codigoSeguro',
        'lugarNacimiento',
        'domicilio',
        'fechaIngreso',
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'ci','ci');
    }
}
