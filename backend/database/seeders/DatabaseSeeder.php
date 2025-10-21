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
use App\Models\Sesion;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
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
            'nombre' => 'Prueba',
            'paterno' => 'Paciente',
            'correo' => 'paciente@clinicadental.com',
            'contrasena' => bcrypt('123456789'),
            'estado' => true,
        ]);

        $asistenteUsuario = Usuario::factory()->create([
            'nombre' => 'Kae',
            'paterno' => 'Apellido',
            'correo' => 'asistente@clinicadental.com',
            'contrasena' => bcrypt('123456789'),
            'estado' => true,
        ]);
        $admin = Administrador::factory()->create([
            'idUsuario_ADM' => $adminUsuario->idUsuario,
        ]);

        $odontologo = Odontologo::factory()->create([
            'idUsuario_Odontologo' => $odontologoUsuario->idUsuario,
        ]);

        $paciente = Paciente::factory()->create([
            'idUsuario_Paciente' => $pacienteUsuario->idUsuario,
        ]);

        $asistente = Asistente::factory()->create([
            'idUsuario_Asistente' => $asistenteUsuario->idUsuario,
        ]);

        $especialidades = Especialidad::factory(3)->create();
        foreach ($especialidades as $esp) {
            Tiene::factory()->create([
                'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
                'idEspecialidad' => $esp->idEspecialidad,
            ]);
        }

        $historia = HistoriaClinica::factory()->create([
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        $cita = Cita::factory()->create([
            'estado' => 'cumplida',
        ]);

        $odontograma = Odontograma::factory()->create([
            'nombre' => 'Odontograma Inicial',
        ]);

        $piezas = PiezaDental::factory(5)->create([
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
        ]);

        foreach ($piezas as $pieza) {
            $acciones = Accion::factory(2)->create();
            foreach ($acciones as $accion) {
                DetalleDental::factory()->create([
                    'idPiezaDental' => $pieza->idPieza,
                    'idAccion' => $accion->idAccion,
                ]);
            }

            Evolucion::factory()->create([
                'idPieza' => $pieza->idPieza,
            ]);
        }

        $plan = Plan::factory()->create([
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idOdontograma' => $odontograma->idOdontograma,
            'observacion' => 'Plan integral de rehabilitación dental',
        ]);

        $sesion = Sesion::factory()->create();
        Asiste::factory()->create([
            'idSesion' => $sesion->idSesion,
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        Atiende::factory()->create([
            'idCita' => $cita->idCita,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        Efectua::factory()->create([
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idOdontograma' => $odontograma->idOdontograma,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        Evalua::factory()->create([
            'idSesion' => $sesion->idSesion,
            'idOdontograma' => $odontograma->idOdontograma,
        ]);

        Hace::factory()->create([
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idCita' => $cita->idCita,
            'idUsuario_Asistente' => $asistente->idUsuario_Asistente,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
        ]);

        $this->command->info('Posi en subir ahora si OKKKKKK');
    }
}