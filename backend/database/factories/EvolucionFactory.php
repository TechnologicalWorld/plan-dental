<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Evolucion;
use App\Models\Tratamiento;
use App\Models\PiezaDental;

class EvolucionFactory extends Factory
{
    protected $model = Evolucion::class;

    public function definition()
    {
        return [
            'idTratamiento' => Tratamiento::factory(),
            'idPieza' => PiezaDental::factory(),
            'fecha' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'diagnosticoCIE' => $this->faker->randomElement(['K02.1', 'K04.0', 'K05.2', 'K07.3', 'K08.1']),
            'procedimientoIndicacion' => $this->faker->sentence(),
        ];
    }
}
