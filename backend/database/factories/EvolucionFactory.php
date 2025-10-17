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
            'fecha' => $this->faker->date(),
            'hora' => $this->faker->time('H:i:s'),
            'diagnosticoCIE' => strtoupper($this->faker->bothify('A##')),
            'procedimientoIndicacion' => $this->faker->sentence(),
        ];
    }
}
