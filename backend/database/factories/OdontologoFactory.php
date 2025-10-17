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
            'idUsuario_Odontologo' => Usuario::factory(),
            'fechaContratacion' => $this->faker->date(),
            'horario' => $this->faker->randomElement(['lunes a miercoles 08:00-16:00',' sabados y feriados 10:00-14:00']),
        ];
    }
}
