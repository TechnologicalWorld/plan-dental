<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Accion;

class AccionFactory extends Factory
{
    protected $model = Accion::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->word(),
            'color' => $this->faker->hexColor(),

            
        ];
    }
}
