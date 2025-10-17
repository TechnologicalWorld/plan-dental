<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistente extends Model
{
    //
    use HasFactory;
    protected $table = 'asistente';
    protected $primaryKey = 'idUsuario_Asistente';
    protected $keyType = 'int';
    public $incrementing = false;

    protected $fillable = [
        'idUsuario_Asistente',
        'turno',
        'fechaContratacion',
    ];

    protected $casts = [
        'fechaContratacion' => 'date',
    ];
    
    public function usuario(){
        return $this->belongsTo(Usuario::class,'idUsuario_Asistente','idUsuario');
    }
}
