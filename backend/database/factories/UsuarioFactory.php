<?php

namespace Database\Factories;
use Illuminate\Support\Facades\Hash;
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
            'nombre' => $this->faker->firstName(),
            'paterno' => $this->faker->lastName(),
            'materno' => $this->faker->lastName(),
            'fechaNacimiento' => $this->faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'genero' => $this->faker->randomElement(['M', 'F', 'Otro']),
            'telefono' => $this->faker->numerify('7########'),
            'contrasena' => Hash::make('password123'),
            'correo' => $this->faker->unique()->safeEmail(),
            'direccion' => $this->faker->address(), 
            'estado' => $this->faker->boolean(80),
        ];
    }

    public function administrador()
    {
        return $this->afterCreating(function (Usuario $usuario) {
            $usuario->administrador()->create();
        });
    }

    public function paciente()
    {
        return $this->afterCreating(function (Usuario $usuario) {
            $usuario->paciente()->create([
                'codigoSeguro' => $this->faker->numerify('SEG-#######'),
                'lugarNacimiento' => $this->faker->city(),
                'domicilio' => $this->faker->address(),
                'fechaIngreso' => $this->faker->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            ]);
        });
    }

    public function odontologo()
    {
        return $this->afterCreating(function (Usuario $usuario) {
            $usuario->odontologo()->create([
                'fechaContratacion' => $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
                'horario' => $this->faker->randomElement(['Lunes a Viernes 8:00-16:00', 'Lunes a Sábado 9:00-17:00', 'Turno mañana 8:00-14:00']),
            ]);
        });
    }

    public function asistente()
    {
        return $this->afterCreating(function (Usuario $usuario) {
            $usuario->asistente()->create([
                'turno' => $this->faker->randomElement(['mañana', 'tarde', 'noche']),
                'fechaContratacion' => $this->faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
            ]);
        });
    }
}
