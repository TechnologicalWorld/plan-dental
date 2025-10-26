<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Hace;
use App\Models\Paciente;
use App\Models\Cita;
use App\Models\Asistente;
use App\Models\Odontologo;

class HaceFactory extends Factory
{
    protected $model = Hace::class;

    public function definition()
    {
        return [
            'idUsuario_Paciente' => Paciente::factory(),
            'idCita' => Cita::factory(),
            'idUsuario_Asistente' => Asistente::factory(),
            'idUsuario_Odontologo' => Odontologo::factory(),
            'fecha' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
        ];
    }
}
