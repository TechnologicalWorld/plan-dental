<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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
    // Relaciones con otras tablas pueden QUE PODRAN UTILIZAR EN EL FRONTEND
    public function historiasClinicas()
    {
        return $this->hasMany(HistoriaClinica::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }

    public function planes()
    {
        return $this->hasMany(Plan::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }

    public function sesiones()
    {
        return $this->belongsToMany(Sesion::class, 'asiste', 'idUsuario_Paciente', 'idSesion')
                    ->withPivot('fecha', 'idUsuario_Odontologo');
    }

    public function citas()
    {
        return $this->belongsToMany(Cita::class, 'hace', 'idUsuario_Paciente', 'idCita')
                    ->withPivot('fecha', 'idUsuario_Asistente', 'idUsuario_Odontologo');
    }

    public function odontogramas()
    {
        return $this->belongsToMany(Odontograma::class, 'efectua', 'idUsuario_Paciente', 'idOdontograma')
                    ->withPivot('fecha', 'idUsuario_Odontologo');
    }
    public function asisteRelaciones()
    {
        return $this->hasMany(Asiste::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }

    public function efectuaRelaciones()
    {
        return $this->hasMany(Efectua::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }

    public function haceRelaciones()
    {
        return $this->hasMany(Hace::class, 'idUsuario_Paciente', 'idUsuario_Paciente');
    }
}
