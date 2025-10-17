<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Atiende;
use App\Models\Odontologo;
use App\Models\Cita;

class AtiendeFactory extends Factory
{
    protected $model = Atiende::class;

    public function definition()
    {
        return [
            'idOdontologo' => Odontologo::factory(),
            'idCita' => Cita::factory(),
            'fecha' => $this->faker->date(),
        ];
    }
}
