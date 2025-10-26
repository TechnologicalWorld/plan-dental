<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleDental extends Model
{
    use HasFactory;

    protected $table = 'detalle_dental';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idAccion',
        'idPiezaDental',
        'descripcion',
        'cuadrante',
        'fecha'
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
