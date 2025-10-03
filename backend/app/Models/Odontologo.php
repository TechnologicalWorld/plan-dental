<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Odontologo extends Model
{
    //
    protected $table = 'odontologo';
    protected $primaryKey = 'ci';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ci',
        'fechaContratacion',
        'horario',
    ];
    public function usuario(){
        return $this->belongsTo(Usuario::class,'ci','ci');
    }
}
