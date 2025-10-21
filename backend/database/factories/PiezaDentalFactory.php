<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PiezaDental;
use App\Models\Paciente;

class PiezaDentalFactory extends Factory
{
    protected $model = PiezaDental::class;

    public function definition()
    {
        return [
            'pocision' => $this->faker->randomElement(['11','12','21','22','31','32']), 
            'nombre' => $this->faker->word(),
            'tipo' => $this->faker->randomElement(['Incisivo','Canino','Molar','Premolar']),
            'estado' => $this->faker->randomElement(['sano','cariado','restaurado']),
            'idUsuario_Paciente' => Paciente::factory(),
        ];
    }
}
