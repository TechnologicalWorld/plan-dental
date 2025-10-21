<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Asiste;
use App\Models\Sesion;
use App\Models\Paciente;
use App\Models\Odontologo;

class AsisteFactory extends Factory
{
    protected $model = Asiste::class;

    public function definition()
    {
        return [
            'idSesion' => Sesion::factory(),
            'idUsuario_Paciente' => Paciente::factory(),
            'idUsuario_Odontologo' => Odontologo::factory(),
            'fecha' => $this->faker->date(),
        ];
    }
}
