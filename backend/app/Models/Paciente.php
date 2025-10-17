<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    //
    use HasFactory;
    protected $table = 'paciente';
    protected $primaryKey = 'idUsuario_Paciente';
    protected $keyType = 'int';
    public $incrementing = false;

    protected $fillable = [
        'idUsuario_Paciente',
        'codigoSeguro',
        'lugarNacimiento',
        'domicilio',
        'fechaIngreso'
    ];

    protected $casts = [
        'fechaIngreso' => 'date',
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario_Paciente','idUsuario');
    }
}
