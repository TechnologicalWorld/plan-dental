<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Odontologo extends Model
{
    use HasFactory;
    protected $table = 'odontologo';
    protected $primaryKey = 'idUsuario_Odontologo';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario_Odontologo',
        'fechaContratacion',
        'horario',
    ];

    protected $casts = [
        'fechaContratacion' => 'date',
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario_Odontologo','idUsuario');
    }
    public function especialidades(){
        return $this->belongsTo(Especialidad::class,'tiene', 'idUsuario_Odontologo', 'idEspecialidad');
    }
    public function historiasClinicas()
    {
        return $this->hasMany(HistoriaClinica::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }

    public function sesiones()
    {
        return $this->belongsToMany(Sesion::class, 'asiste', 'idUsuario_Odontologo', 'idSesion')
                    ->withPivot('fecha', 'idUsuario_Paciente');
    }

    public function citas()
    {
        return $this->belongsToMany(Cita::class, 'atiende', 'idUsuario_Odontologo', 'idCita')
                    ->withPivot('fecha');
    }

    public function odontogramas()
    {
        return $this->belongsToMany(Odontograma::class, 'efectua', 'idUsuario_Odontologo', 'idOdontograma')
                    ->withPivot('fecha', 'idUsuario_Paciente');
    }

    public function evaluaciones()
    {
        return $this->belongsToMany(Sesion::class, 'evalua', 'idUsuario_Odontologo', 'idSesion')
                    ->withPivot('fecha', 'idOdontograma');
    }
    public function asisteRelaciones()
    {
        return $this->hasMany(Asiste::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }

    public function tieneRelaciones()
    {
        return $this->hasMany(Tiene::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }

    public function efectuaRelaciones()
    {
        return $this->hasMany(Efectua::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }

    public function atiendeRelaciones()
    {
        return $this->hasMany(Atiende::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }

}
