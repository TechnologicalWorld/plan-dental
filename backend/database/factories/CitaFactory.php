<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Cita;
use App\Models\Paciente;
use App\Models\Asistente;
use App\Models\Odontologo;

class CitaFactory extends Factory
{
    protected $model = Cita::class;

    public function definition()
    {
        $tiposCita = [
            'Consulta general',
            'Limpieza dental',
            'Extracción',
            'Ortodoncia',
            'Blanqueamiento',
            'Endodoncia',
            'Implante dental',
            'Revisión',
            'Urgencia'
        ];

        return [
            'hora' => $this->faker->time('H:i'),
            'fecha' => $this->faker->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'estado' => $this->faker->randomElement(['pendiente', 'confirmada', 'completada', 'cancelada']),
            'tipoCita' => $this->faker->randomElement($tiposCita),
            'costo' => $this->faker->randomFloat(2, 50, 500),
            'pagado' => $this->faker->boolean(70),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Cita $cita) {
            // Asignar paciente y odontólogo aleatorios
            $paciente = Paciente::inRandomOrder()->first() ?? Paciente::factory()->create();
            $odontologo = Odontologo::inRandomOrder()->first() ?? Odontologo::factory()->create();
            $asistente = Asistente::inRandomOrder()->first();

            if ($paciente && $odontologo) {
                // Relación hace
                $cita->pacientes()->attach($paciente->idUsuario_Paciente, [
                    'fecha' => $cita->fecha,
                    'idUsuario_Asistente' => $asistente ? $asistente->idUsuario_Asistente : null,
                    'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo
                ]);

                // Relación atiende
                $cita->odontologos()->attach($odontologo->idUsuario_Odontologo, [
                    'fecha' => $cita->fecha
                ]);

                // Relación con asistente si existe
                if ($asistente) {
                    $cita->asistentes()->attach($asistente->idUsuario_Asistente, [
                        'fecha' => $cita->fecha,
                        'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
                        'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo
                    ]);
                }
            }
        });
    }

}
