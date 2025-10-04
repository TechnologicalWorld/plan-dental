<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Odontologo extends Model
{
    //
    protected $table = 'odontologo';
    protected $primaryKey = 'idUsuario';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario',
        'fechaContratacion',
        'horario',
    ];
    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario','idUsuario');
    }
}
