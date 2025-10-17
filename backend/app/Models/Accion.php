<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accion extends Model
{
    /** @use HasFactory<\Database\Factories\AccionFactory> */
    use HasFactory;

    protected $table = 'accion';
    protected $primaryKey = 'idAccion';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['nombre', 'color'];

    public function detalles()
    {
        return $this->hasMany(DetalleDental::class, 'idAccion', 'idAccion');
    }

}

