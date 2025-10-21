<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Cita;
use App\Models\Paciente;
use App\Models\Odontologo;

class CitaFactory extends Factory
{
    protected $model = Cita::class;

    public function definition()
    {
        return [
            'hora' => $this->faker->time('H:i:s'),
            'fecha' => $this->faker->date(),
            'estado' => $this->faker->randomElement(['cancelada', 'cumplida', 'pospuesta']),
            'tipoCita' => $this->faker->randomElement(['consulta', 'limpieza', 'extracción', 'tratamiento']),
            'costo' => $this->faker->randomFloat(2, 50, 500),
            'pagado' => $this->faker->randomFloat(2, 0, 500),
            
        ];
    }
}
