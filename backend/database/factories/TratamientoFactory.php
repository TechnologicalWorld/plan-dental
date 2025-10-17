<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tratamiento;
use App\Models\Odontologo;

class TratamientoFactory extends Factory
{
    protected $model = Tratamiento::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->word(),
            'descripcion' => $this->faker->sentence(),
            'costo' => $this->faker->randomFloat(2, 50, 500),
            'duracion' => $this->faker->numberBetween(1, 10) . ' días',
            'idOdontologo' => Odontologo::factory(),
        ];
    }
}
