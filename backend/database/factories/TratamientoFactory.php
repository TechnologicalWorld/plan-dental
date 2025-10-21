<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tratamiento;
use App\Models\Odontologo;
use App\Models\Cita;

class TratamientoFactory extends Factory
{
    protected $model = Tratamiento::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->word(),
            'precio' => $this->faker->randomFloat(2, 50, 500),
            'idCita' => Cita::factory(),
        ];
    }
}
