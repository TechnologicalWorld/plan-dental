<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tiene;
use App\Models\Especialidad;
use App\Models\Odontologo;

class TieneFactory extends Factory
{
    protected $model = Tiene::class;

    public function definition()
    {
        return [
            'idEspecialidad' => Especialidad::factory(),
            'idUsuario_Odontologo' => Odontologo::factory(),
        ];
    }
}
