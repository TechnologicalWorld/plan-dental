<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Usuario;

class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    public function definition()
    {
        return [
            'ci' => $this->faker->unique()->numerify('########'),
            'nombre' => $this->faker->firstName,
            'paterno' => $this->faker->lastName,
            'materno' => $this->faker->lastName,
            'fechaNacimiento' => $this->faker->date(),
            'genero' => $this->faker->randomElement(['M','F']),
            'telefono' => $this->faker->phoneNumber,
            'contrasena' => bcrypt('password'),
            'correo' => $this->faker->unique()->safeEmail,
            'direccion' => $this->faker->address,
            'estado' => $this->faker->boolean(90),
        ];
    }
}
