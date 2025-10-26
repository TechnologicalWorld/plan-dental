<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Accion;

class AccionFactory extends Factory
{
    protected $model = Accion::class;

    public function definition()
    {
        $acciones = [
            ['nombre' => 'Caries', 'color' => '#FF6B6B'],
            ['nombre' => 'Obturación', 'color' => '#4ECDC4'],
            ['nombre' => 'Extracción', 'color' => '#45B7D1'],
            ['nombre' => 'Corona', 'color' => '#96CEB4'],
            ['nombre' => 'Endodoncia', 'color' => '#FFEAA7'],
            ['nombre' => 'Limpieza', 'color' => '#DDA0DD'],
            ['nombre' => 'Implante', 'color' => '#98D8C8'],
            ['nombre' => 'Ortodoncia', 'color' => '#F7DC6F']
        ];

        $accion = $this->faker->randomElement($acciones);

        return [
            'nombre' => $accion['nombre'],
            'color' => $accion['color'],
        ];
    }
}
