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
        return [
            'nombre' => $this->faker->word,
            'descripcion' => $this->faker->sentence,
            'fecha' => $this->faker->date()
        ];
    }
}
