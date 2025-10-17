<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    /** @use HasFactory<\Database\Factories\TratamientoFactory> */
    use HasFactory;
    protected $table = 'tratamiento';
    protected $primaryKey = 'id_tratamiento';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'nombre',
        'descripcion',
        'costo',
        'duracion',
        'idOdontologo'
    ];
    public function odontologo()
    {
        return $this->belongsTo(Odontologo::class, 'idOdontologo', 'idUsuario_Odontologo');
    }
}
