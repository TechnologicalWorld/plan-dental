<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\DetalleDental;
use App\Models\Accion;
use App\Models\PiezaDental;

class DetalleDentalFactory extends Factory
{
    protected $model = DetalleDental::class;

    public function definition()
    {
        $cuadrantes = ['Superior Derecho', 'Superior Izquierdo', 'Inferior Derecho', 'Inferior Izquierdo'];

        return [
            'idAccion' => Accion::factory(),
            'idPiezaDental' => PiezaDental::factory(),
            'descripcion' => $this->faker->optional()->sentence(),
            'cuadrante' => $this->faker->randomElement($cuadrantes),
            'fecha' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d')
        ];
    }
}
