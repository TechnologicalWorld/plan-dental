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
            'idUsuario_Asistente' => Usuario::factory(),
            'turno' => $this->faker->randomElement(['Mañana', 'Tarde']),
            'fechaContratacion' => $this->faker->date(),
        ];
    }
}