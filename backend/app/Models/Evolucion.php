<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evolucion extends Model
{
    use HasFactory;

    protected $table = 'evolucion';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idTratamiento',
        'idPieza',
        'fecha',
        'hora',
        'diagnosticoCIE',
        'procedimientoIndicacion'
    ];

    protected $casts = [
        'fecha' => 'date',
        'hora' => 'datetime:H:i',
    ];

    public function tratamiento()
    {
        return $this->belongsTo(Tratamiento::class, 'idTratamiento', 'idTratamiento');
    }

    public function pieza()
    {
        return $this->belongsTo(PiezaDental::class, 'idPieza', 'idPieza');
    }
    
}
