<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleDental extends Model
{
    use HasFactory;

    protected $table = 'detalle_dental';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idAccion',
        'idPiezaDental',
        'descripcion',
        'fecha',
        'cuadrante'
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function accion()
    {
        return $this->belongsTo(Accion::class, 'idAccion', 'idAccion');
    }

    public function pieza()
    {
        return $this->belongsTo(PiezaDental::class, 'idPiezaDental', 'idPieza');
    }
}
