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
        return [
            'idAccion' => Accion::factory(),
            'idPiezaDental' => PiezaDental::factory(),
            'descripcion' => $this->faker->sentence(),
            'fecha' => $this->faker->date(),
            'cuadrante' => $this->faker->randomElement(['I','II','III','IV', 'V']),
        ];
    }
}
