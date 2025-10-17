<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\HistoriaClinica;
use App\Models\Paciente;
use App\Models\Odontologo;

class HistoriaClinicaFactory extends Factory
{
    protected $model = HistoriaClinica::class;

    public function definition()
    {
        return [
            'antecedentesPatologicos' => $this->faker->paragraph(),
            'motivoConsulta' => $this->faker->sentence(),
            'signosVitales' => $this->faker->sentence(),
            'descripcionSignosSintomasDentales' => $this->faker->paragraph(),
            'examenClinicoBucoDental' => $this->faker->paragraph(),
            'observaciones' => $this->faker->sentence(),
            'enfermedadActual' => $this->faker->sentence(),
            'idPaciente' => Paciente::factory(),
            'idOdontologo' => Odontologo::factory(),
        ];
    }
}
