<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Asistente;
use App\Models\Usuario;

class AsistenteFactory extends Factory
{
    protected $model = Asistente::class;

    public function definition()
    {
        return [
            'idUsuario_Asistente' => Usuario::factory()->asistente(),
            'turno' => $this->faker->randomElement(['mañana', 'tarde', 'noche']),
            'fechaContratacion' => $this->faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
        ];
    }
}