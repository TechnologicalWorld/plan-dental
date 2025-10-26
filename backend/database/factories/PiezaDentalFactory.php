<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PiezaDental;
use App\Models\Paciente;

class PiezaDentalFactory extends Factory
{
    protected $model = PiezaDental::class;

    public function definition()
    {
        $tipos = ['Incisivo', 'Canino', 'Premolar', 'Molar'];
        $posiciones = ['11', '12', '13', '14', '15', '16', '17', '18', 
                      '21', '22', '23', '24', '25', '26', '27', '28',
                      '31', '32', '33', '34', '35', '36', '37', '38',
                      '41', '42', '43', '44', '45', '46', '47', '48'];

        return [
            'posicion' => $this->faker->randomElement($posiciones),
            'nombre' => $this->faker->randomElement(['Incisivo central', 'Incisivo lateral', 'Canino', 'Primer premolar', 'Segundo premolar', 'Primer molar', 'Segundo molar', 'Tercer molar']),
            'tipo' => $this->faker->randomElement($tipos),
            'estado' => $this->faker->randomElement(['sano', 'cariado', 'restaurado', 'extraido', 'tratamiento']),
        ];
    }
}
