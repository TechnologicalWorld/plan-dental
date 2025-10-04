<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistente extends Model
{
    //
    protected $table = 'asistente';
    protected $primaryKey = 'idUsuario';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'idUsuario',
        'turno',
        'fechaContratacion',
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario','idUsuario');
    }
}
