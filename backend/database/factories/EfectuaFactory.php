<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Efectua;
use App\Models\Odontograma;
use App\Models\Odontologo;
use App\Models\Paciente;

class EfectuaFactory extends Factory
{
    protected $model = Efectua::class;

    public function definition()
    {
        return [
            'idOdontograma' => Odontograma::factory(),
            'idOdontologo' => Odontologo::factory(),
            'idPaciente' => Paciente::factory(),
            'fecha' => $this->faker->date(),
        ];
    }
}
