<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    protected $table = 'administrador';
    protected $primaryKey = 'ci';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'ci'
    ];

    public function usuario(){
        return $this->belongsTo(Usuario::class,'ci','ci');
    }
}
