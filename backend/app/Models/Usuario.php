<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;
    protected $table = 'usuario';
    protected $primaryKey = 'idUsuario';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'ci',
        'nombre',
        'paterno',
        'materno',
        'fechaNacimiento',
        'genero',
        'telefono',
        'contrasena',
        'correo',
        'direccion'
    ];
    protected $hidden=[
        'contrasena',
        'remember_token'
    ];

}
