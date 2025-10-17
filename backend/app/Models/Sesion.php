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
}
