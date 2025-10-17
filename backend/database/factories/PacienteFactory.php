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
            'idUsuario_Paciente' => Usuario::factory(),
            'codigoSeguro' => $this->faker->bothify('DENT-####'),
            'lugarNacimiento' => $this->faker->city,
            'domicilio' => $this->faker->address,
            'fechaIngreso' => $this->faker->date(),
        ];
    }
}
