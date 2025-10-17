<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Autenticable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Autenticable
{
    use HasFactory, HasApiTokens;
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
        'estado',
        'direccion'
    ];
    protected $hidden = [
        'contrasena',
        'remember_token'
    ];
    public function getAuthPassword()
    {
        return $this->contrasena;
    }
    public function odontologo()
    {
        return $this->hasOne(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario');
    }

    public function paciente()
    {
        return $this->hasOne(Paciente::class, 'idUsuario_Paciente', 'idUsuario');
    }

    public function administrador()
    {
        return $this->hasOne(Administrador::class, 'idUsuario_ADM', 'idUsuario');
    }

    public function asistente()
    {
        return $this->hasOne(Asistente::class, 'idUsuario_Asistente', 'idUsuario');
    }

    public function isOdontologo()
    {
        return $this->odontologo !== null;
    }

    public function isPaciente()
    {
        return $this->paciente !== null;
    }

    public function isAdministrador()
    {
        return $this->administrador !== null;
    }

    public function isAsistente()
    {
        return $this->asistente !== null;
    }

    protected $casts = [
    'fechaNacimiento' => 'date',
    'estado' => 'boolean',
    ];

    public function getRoles()
    {
        $roles = [];
        if ($this->isAdministrador()) $roles[] = 'administrador';
        if ($this->isPaciente()) $roles[] = 'paciente';
        if ($this->isOdontologo()) $roles[] = 'odontologo';
        if ($this->isAsistente()) $roles[] = 'asistente';
        return $roles;
    }
}
