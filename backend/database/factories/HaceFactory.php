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
            'idPaciente' => Paciente::factory(),
            'idCita' => Cita::factory(),
            'idAsistente' => Asistente::factory(),
            'idOdontologo' => Odontologo::factory(),
            'fecha' => $this->faker->date(),
        ];
    }
}
