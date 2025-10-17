<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Paciente;
use App\Models\Odontologo;
use App\Models\Administrador;
use App\Models\Asistente;
use App\Models\Especialidad;
use App\Models\HistoriaClinica;
use App\Models\Cita;
use App\Models\Odontograma;
use App\Models\PiezaDental;
use App\Models\Accion;
use App\Models\DetalleDental;
use App\Models\Evolucion;
use App\Models\Plan;
use App\Models\Asiste;
use App\Models\Atiende;
use App\Models\Efectua;
use App\Models\Evalua;
use App\Models\Hace;
use App\Models\Tiene;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 🔹 Crear usuarios base
        $adminUsuario = Usuario::factory()->create([
            'nombre' => 'Admin',
            'paterno' => 'Principal',
            'correo' => 'admin@clinicadental.com',
            'contrasena' => bcrypt('admin123'),
            'estado' => true,
        ]);

        $odontologoUsuario = Usuario::factory()->create([
            'nombre' => 'Joe',
            'paterno' => 'Tancara',
            'correo' => 'odontologo@clinicadental.com',
            'contrasena' => bcrypt('123456789'),
            'estado' => true,
        ]);

        $pacienteUsuario = Usuario::factory()->create([
            'nombre' => 'prueba',
            'paterno' => 'prueba2',
            'correo' => 'paciente@clinicadental.com',
            'contrasena' => bcrypt('123456789'),
            'estado' => true,
        ]);

        $asistenteUsuario = Usuario::factory()->create([
            'nombre' => 'Kae',
            'paterno' => 'K de apellido',
            'correo' => 'asistente@clinicadental.com',
            'contrasena' => bcrypt('123456789'),
            'estado' => true,
        ]);

        // Crear roles derivados
        $admin = Administrador::factory()->create(['idUsuario_ADM' => $adminUsuario->idUsuario]);
        $odontologo = Odontologo::factory()->create(['idUsuario_Odontologo' => $odontologoUsuario->idUsuario]);
        $paciente = Paciente::factory()->create(['idUsuario_Paciente' => $pacienteUsuario->idUsuario]);
        $asistente = Asistente::factory()->create(['idUsuario_Asistente' => $asistenteUsuario->idUsuario]);

        // Crear especialidades y asignarlas al odontólogo
        $especialidades = Especialidad::factory(3)->create();
        foreach ($especialidades as $esp) {
            Tiene::factory()->create([
                'idOdontologo' => $odontologo->idUsuario_Odontologo,
                'idEspecialidad' => $esp->idEspecialidad,
            ]);
        }

        // Crear historias clínicas
        $historia = HistoriaClinica::factory()->create([
            'idPaciente' => $paciente->idUsuario_Paciente,
            'idOdontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        // Crear citas
        $cita = Cita::factory()->create([
            'idPaciente' => $paciente->idUsuario_Paciente,
            'idOdontologo' => $odontologo->idUsuario_Odontologo,
            'estado' => 'cumplida',
        ]);

        // Crear odontogramas
        $odontograma = Odontograma::factory()->create([
            'idPaciente' => $paciente->idUsuario_Paciente,
            'idOdontologo' => $odontologo->idUsuario_Odontologo,
            'nombre' => 'Odontograma Inicial',
        ]);

        // Crear piezas dentales con detalles
        $piezas = PiezaDental::factory(5)->create(['idPaciente' => $paciente->idUsuario_Paciente]);
        foreach ($piezas as $pieza) {
            $acciones = Accion::factory(2)->create();
            foreach ($acciones as $accion) {
                DetalleDental::factory()->create([
                    'idPiezaDental' => $pieza->idPiezaDental,
                    'idAccion' => $accion->idAccion,
                ]);
            }

            Evolucion::factory()->create([
                'idPiezaDental' => $pieza->idPiezaDental,
                'idOdontologo' => $odontologo->idUsuario_Odontologo,
            ]);
        }

        //Crear plan de tratamiento
        $plan = Plan::factory()->create([
            'idPaciente' => $paciente->idUsuario_Paciente,
            'idOdontograma' => $odontograma->idOdontograma,
            'descripcion' => 'Plan integral de rehabilitación dental',
        ]);

        //Registrar asistencias, atenciones y acciones
        Asiste::factory()->create([
            'idPaciente' => $paciente->idUsuario_Paciente,
            'idOdontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        Atiende::factory()->create([
            'idCita' => $cita->idCita,
            'idOdontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        Efectua::factory()->create([
            'idPaciente' => $paciente->idUsuario_Paciente,
            'idOdontograma' => $odontograma->idOdontograma,
        ]);

        Evalua::factory()->create([
            'idSesion' => 1,
            'idOdontograma' => $odontograma->idOdontograma,
        ]);

        Hace::factory()->create([
            'idPaciente' => $paciente->idUsuario_Paciente,
            'idCita' => $cita->idCita,
            'idAsistente' => $asistente->idUsuario_Asistente,
            'idOdontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        $this->command->info('Datos de ejemplo OK de Clínica Dental');
    }
}
