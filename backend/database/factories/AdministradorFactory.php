<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Administrador;
use App\Models\Usuario;

class AdministradorFactory extends Factory
{
    protected $model = Administrador::class;

    public function definition()
    {
        return [
            'idUsuario_ADM' => Usuario::factory()->administrador(),
        ];
    }
}
