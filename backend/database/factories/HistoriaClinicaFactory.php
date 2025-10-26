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
        $motivosConsulta = [
            'Dolor dental persistente',
            'Caries visible',
            'Sensibilidad al frío/calor',
            'Sangrado de encías',
            'Mal aliento',
            'Dientes flojos',
            'Problema estético',
            'Revisión rutinaria',
            'Traumatismo dental',
            'Prótesis dental incómoda'
        ];

        $antecedentes = [
            'Diabetes tipo 2',
            'Hipertensión arterial',
            'Alergia a penicilina',
            'Asma bronquial',
            'Ninguno significante',
            'Problemas cardíacos',
            'Embarazo',
            'Hepatitis B',
            'Ningún antecedente patológico'
        ];

        return [
            'antecedentesPatologicos' => $this->faker->optional(0.6)->randomElement($antecedentes),
            'motivoConsulta' => $this->faker->randomElement($motivosConsulta),
            'signosVitales' => $this->faker->optional(0.5)->text(100),
            'descripcionSignosSintomasDentales' => $this->faker->optional(0.8)->text(200),
            'examenClinicoBucoDental' => $this->faker->optional(0.7)->text(300),
            'observaciones' => $this->faker->optional(0.5)->text(200),
            'enfermedadActual' => $this->faker->optional(0.6)->text(150),
            'idUsuario_Paciente' => Paciente::factory(),
            'idUsuario_Odontologo' => Odontologo::factory(),
        ];
    }
}
