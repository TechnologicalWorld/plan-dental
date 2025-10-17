<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Especialidad extends Model
{
use HasFactory;

    protected $table = 'especialidad';
    protected $primaryKey = 'idEspecialidad';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['nombre', 'descripcion'];

    public function odontologos()
    {
        return $this->belongsToMany(Odontologo::class, 'tiene', 'idEspecialidad', 'idOdontologo');
    }
}
