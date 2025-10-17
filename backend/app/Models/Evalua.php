<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evalua extends Model
{
    use HasFactory;

    protected $table = 'evalua';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idSesion',
        'idOdontograma',
        'fecha'
    ];

    protected $casts = ['fecha' => 'date'];

    public function sesion()
    {
        return $this->belongsTo(Sesion::class, 'idSesion', 'idSesion');
    }

    public function odontograma()
    {
        return $this->belongsTo(Odontograma::class, 'idOdontograma', 'idOdontograma');
    }
}
