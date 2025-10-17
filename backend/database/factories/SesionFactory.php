<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Sesion;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sesion>
 */
class SesionFactory extends Factory
{

    protected $model = Sesion::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->word,
            'descripcion' => $this->faker->sentence,
            'hora' => $this->faker->time('H:i:s'),
            'observacion' => $this->faker->sentence,
            'fecha' => $this->faker->date(),
        ];
    }
}
