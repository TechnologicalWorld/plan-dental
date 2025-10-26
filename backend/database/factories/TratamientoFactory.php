<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tratamiento;
use App\Models\Odontologo;
use App\Models\Cita;

class TratamientoFactory extends Factory
{
    protected $model = Tratamiento::class;

    public function definition()
    {
        $tratamientos = [
            ['nombre' => 'Limpieza dental profesional', 'precio_min' => 100, 'precio_max' => 200],
            ['nombre' => 'Extracción simple', 'precio_min' => 150, 'precio_max' => 300],
            ['nombre' => 'Obturación composite', 'precio_min' => 200, 'precio_max' => 400],
            ['nombre' => 'Blanqueamiento dental', 'precio_min' => 300, 'precio_max' => 600],
            ['nombre' => 'Endodoncia unirradicular', 'precio_min' => 400, 'precio_max' => 800],
            ['nombre' => 'Corona cerámica', 'precio_min' => 600, 'precio_max' => 1200],
            ['nombre' => 'Implante dental', 'precio_min' => 800, 'precio_max' => 2000],
            ['nombre' => 'Ortodoncia brackets metálicos', 'precio_min' => 1000, 'precio_max' => 3000]
        ];

        $tratamiento = $this->faker->randomElement($tratamientos);

        return [
            'nombre' => $tratamiento['nombre'],
            'precio' => $this->faker->randomFloat(2, $tratamiento['precio_min'], $tratamiento['precio_max']),
            'idCita' => Cita::factory(),
        ];
    }
}
