<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    protected $table = 'administrador';
    protected $primaryKey = 'idUsuario';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'idUsuario'
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario','idUsuario');
    }
}
