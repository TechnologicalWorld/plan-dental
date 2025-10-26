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
        
        $medicamentos = [
            'Amoxicilina 500mg cada 8 horas por 7 días',
            'Ibuprofeno 400mg cada 8 horas si hay dolor',
            'Enjuague bucal con clorhexidina 2 veces al día',
            'Paracetamol 500mg cada 6 horas si hay dolor',
            'Metronidazol 500mg cada 8 horas por 7 días',
            'Analgésico según necesidad'
        ];

        return [
            'observacion' => $this->faker->optional(0.7)->text(200),
            'medicamentos' => $this->faker->optional(0.6)->randomElement($medicamentos),
            'duracionTotal' => $this->faker->numberBetween(30, 365),
            'duracionEstimada' => $this->faker->numberBetween(30, 365),
            'idUsuario_Paciente' => Paciente::factory(),
            'idOdontograma' => Odontograma::factory(),
        ];
    }
}
