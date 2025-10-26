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

    //utilizaremos para filtrar si es necesario
    public function sesionesAsistidas()
    {
        return $this->belongsToMany(Sesion::class, 'asiste', 'idUsuario_Paciente', 'idSesion')
                    ->withPivot('fecha', 'idUsuario_Odontologo')
                    ->withTimestamps();
    }

    public function sesionesAtendidas()
    {
        return $this->belongsToMany(Sesion::class, 'asiste', 'idUsuario_Odontologo', 'idSesion')
                    ->withPivot('fecha', 'idUsuario_Paciente')
                    ->withTimestamps();
    }

    public function especialidades()
    {
        return $this->belongsToMany(Especialidad::class, 'tiene', 'idUsuario_Odontologo', 'idEspecialidad');
    }

    public function citasAtendidas()
    {
        return $this->belongsToMany(Cita::class, 'atiende', 'idUsuario_Odontologo', 'idCita')
                    ->withPivot('fecha');
    }

    public function historiasClinicas()
    {
        return $this->hasMany(HistoriaClinica::class, 'idUsuario_Odontologo', 'idUsuario');
    }
    public function asisteRelaciones()
    {
        return $this->hasMany(Asiste::class, 'idUsuario_Paciente', 'idUsuario');
    }

    public function atiendeRelaciones()
    {
        return $this->hasMany(Atiende::class, 'idUsuario_Odontologo', 'idUsuario');
    }

    public function haceRelaciones()
    {
        return $this->hasMany(Hace::class, 'idUsuario_Paciente', 'idUsuario');
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
