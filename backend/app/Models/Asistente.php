<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistente extends Model
{
    //
    protected $table = 'asistente';
    protected $primaryKey = 'ci';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'ci',
        'turno',
        'fechaContratacion',
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'ci','ci');
    }
}
