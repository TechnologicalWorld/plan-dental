<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Plan;
use App\Models\Paciente;
use App\Models\Odontograma;

class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition()
    {
        return [
            'observacion' => $this->faker->sentence(),
            'medicamentos' => $this->faker->words(3, true),
            'duracionTotal' => $this->faker->numberBetween(1, 60),
            'duracionEstimada' => $this->faker->numberBetween(1, 60),
            'idPaciente' => Paciente::factory(),
            'idOdontograma' => Odontograma::factory(),
        ];
    }
}
