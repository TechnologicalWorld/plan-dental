<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Cita;
use App\Models\Paciente;
use App\Models\Odontologo;

class CitaFactory extends Factory
{
    protected $model = Cita::class;

    public function definition()
    {
        return [
            'fecha' => $this->faker->date(),
            'hora' => $this->faker->time('H:i:s'),
            'motivo' => $this->faker->sentence(),
            'estado' => $this->faker->randomElement(['pendiente', 'realizada', 'cancelada']),
            'idPaciente' => Paciente::factory(),
            'idOdontologo' => Odontologo::factory(),
        ];
    }
}
