<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Especialidad;

class EspecialidadFactory extends Factory
{
    protected $model = Especialidad::class;

    public function definition()
    {
        $especialidades = [
            'Ortodoncia',
            'Endodoncia',
            'Periodoncia',
            'Odontopediatría',
            'Cirugía Oral',
            'Implantes Dentales',
            'Estética Dental',
            'Rehabilitación Oral'
        ];

        return [
            'nombre' => $this->faker->unique()->randomElement($especialidades),
            'descripcion' => $this->faker->optional()->sentence(),
        ];
    }
}
