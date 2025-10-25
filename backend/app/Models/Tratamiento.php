<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    /** @use HasFactory<\Database\Factories\TratamientoFactory> */
    use HasFactory;
    protected $table = 'tratamiento';
    protected $primaryKey = 'idTratamiento';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'nombre',
        'precio',
        'idCita',
    ];
    public function odontologo()
    {
        return $this->belongsTo(Odontologo::class, 'idUsuario_Odontologo', 'idUsuario_Odontologo');
    }
}
