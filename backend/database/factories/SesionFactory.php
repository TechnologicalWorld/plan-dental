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
        $tiposSesion = [
            'Consulta inicial',
            'Limpieza dental',
            'Tratamiento de caries',
            'Ortodoncia - ajuste',
            'Extracción dental',
            'Blanqueamiento',
            'Control post-tratamiento',
            'Revisión periódica',
            'Urgencia dental',
            'Colocación de implante'
        ];

        return [
            'nombre' => $this->faker->randomElement($tiposSesion),
            'descripcion' => $this->faker->optional()->sentence(),
            'hora' => $this->faker->time('H:i'),
            'observacion' => $this->faker->optional()->sentence(),
            'fecha' => $this->faker->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
        ];
    }
}
