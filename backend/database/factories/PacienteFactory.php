<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Paciente;
use App\Models\Usuario;

class PacienteFactory extends Factory
{
    protected $model = Paciente::class;

    public function definition()
    {
        return [
            'idUsuario_Paciente' => Usuario::factory()->paciente(),
            'codigoSeguro' => $this->faker->numerify('DENT-#######'),
            'lugarNacimiento' => $this->faker->city(),
            'domicilio' => $this->faker->address(),
            'fechaIngreso' => $this->faker->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
        ];
    }
}
