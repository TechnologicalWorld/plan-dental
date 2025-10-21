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
            'idUsuario_Odontologo' => Odontologo::factory(),
            'idUsuario_Paciente' => Paciente::factory(),
            'fecha' => $this->faker->date(),
        ];
    }
}
