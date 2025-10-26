<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Odontograma;
use App\Models\Paciente;
use App\Models\Odontologo;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Odontograma>
 */
class OdontogramaFactory extends Factory
{
    protected $model = Odontograma::class;

    public function definition(): array
    {
        $tiposOdontograma = [
            'Odontograma inicial',
            'Odontograma de control',
            'Odontograma post-tratamiento',
            'Odontograma pre-operatorio',
            'Odontograma de seguimiento',
            'Odontograma ortodóntico'
        ];

        return [
            'nombre' => $this->faker->randomElement($tiposOdontograma),
            'descripcion' => $this->faker->optional()->sentence(),
            'fecha' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'observacion' => $this->faker->optional()->sentence(),
        ];
    }
}
