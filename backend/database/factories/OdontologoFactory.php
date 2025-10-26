<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Odontologo;
use App\Models\Usuario;

class OdontologoFactory extends Factory
{
    protected $model = Odontologo::class;

    public function definition()
    {
        return [
            'idUsuario_Odontologo' => Usuario::factory()->odontologo(),
            'fechaContratacion' => $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'horario' => $this->faker->randomElement(['Lunes a Viernes 8:00-16:00', 'Lunes a Sábado 9:00-17:00', 'Turno mañana 8:00-14:00']),
        ];
    }
}
