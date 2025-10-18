<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    use HasFactory;
    protected $table = 'administrador';
    protected $primaryKey = 'idUsuario_ADM';
    protected $keyType = 'int';
    public $incrementing = false;

    protected $fillable = [
        'idUsuario_ADM'
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario_ADM','idUsuario');
    }
}
