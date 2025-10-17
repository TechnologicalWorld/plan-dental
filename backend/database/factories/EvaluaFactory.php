<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Evalua;
use App\Models\Sesion;
use App\Models\Odontograma;

class EvaluaFactory extends Factory
{
    protected $model = Evalua::class;

    public function definition()
    {
        return [
            'idSesion' => Sesion::factory(),
            'idOdontograma' => Odontograma::factory(),
            'fecha' => $this->faker->date(),
        ];
    }
}
