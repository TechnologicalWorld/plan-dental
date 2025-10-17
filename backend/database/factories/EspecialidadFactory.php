<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Especialidad;

class EspecialidadFactory extends Factory
{
    protected $model = Especialidad::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->word(),
            'descripcion' => $this->faker->sentence(),
        ];
    }
}
