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
use App\Models\Efectua;
use App\Models\Evalua;
use App\Models\Tiene;
use App\Models\Sesion;
use App\Models\Tratamiento;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuarios específicos con roles
        $adminUsuario = Usuario::factory()->create([
            'nombre' => 'Admin',
            'paterno' => 'Principal',
            'materno' => 'Sistema',
            'ci' => '1234567',
            'fechaNacimiento' => '1980-01-01',
            'genero' => 'M',
            'telefono' => '77777777',
            'correo' => 'admin@clinicadental.com',
            'contrasena' => Hash::make('admin123'),
            'direccion' => 'Av. Principal #123',
            'estado' => true,
        ]);

        $odontologoUsuario = Usuario::factory()->create([
            'nombre' => 'Joe',
            'paterno' => 'Tancara',
            'materno' => 'Mendez',
            'ci' => '7654321',
            'fechaNacimiento' => '1985-05-15',
            'genero' => 'M',
            'telefono' => '77777778',
            'correo' => 'odontologo@clinicadental.com',
            'contrasena' => Hash::make('123456789'),
            'direccion' => 'Av. Odontologos #456',
            'estado' => true,
        ]);

        

        $pacienteUsuario = Usuario::factory()->create([
            'nombre' => 'Prueba',
            'paterno' => 'Paciente',
            'materno' => 'Test',
            'ci' => '1122334',
            'fechaNacimiento' => '1990-08-20',
            'genero' => 'F',
            'telefono' => '77777779',
            'correo' => 'paciente@clinicadental.com',
            'contrasena' => Hash::make('123456789'),
            'direccion' => 'Calle Pacientes #789',
            'estado' => true,
        ]);

        $asistenteUsuario = Usuario::factory()->create([
            'nombre' => 'Kae',
            'paterno' => 'Apellido',
            'materno' => 'Asistente',
            'ci' => '4433221',
            'fechaNacimiento' => '1992-03-10',
            'genero' => 'F',
            'telefono' => '77777780',
            'correo' => 'asistente@clinicadental.com',
            'contrasena' => Hash::make('123456789'),
            'direccion' => 'Av. Asistentes #321',
            'estado' => true,
        ]);

        // Crear registros de roles
        $admin = Administrador::factory()->create([
            'idUsuario_ADM' => $adminUsuario->idUsuario,
        ]);

        $odontologo = Odontologo::factory()->create([
            'idUsuario_Odontologo' => $odontologoUsuario->idUsuario,
            'fechaContratacion' => '2020-01-15',
            'horario' => 'Lunes a Viernes 8:00-16:00',
        ]);

        $paciente = Paciente::factory()->create([
            'idUsuario_Paciente' => $pacienteUsuario->idUsuario,
            'codigoSeguro' => 'SEG-001234',
            'lugarNacimiento' => 'La Paz, Bolivia',
            'domicilio' => 'Calle Pacientes #789, Zona Central',
            'fechaIngreso' => '2023-01-10',
        ]);

        $asistente = Asistente::factory()->create([
            'idUsuario_Asistente' => $asistenteUsuario->idUsuario,
            'turno' => 'mañana',
            'fechaContratacion' => '2022-06-01',
        ]);

        // Crear especialidades
        $especialidades = Especialidad::factory()->createMany([
            ['nombre' => 'Ortodoncia', 'descripcion' => 'Especialidad en corrección de dientes y mandíbulas'],
            ['nombre' => 'Endodoncia', 'descripcion' => 'Especialidad en tratamiento de conductos'],
            ['nombre' => 'Periodoncia', 'descripcion' => 'Especialidad en encías y tejidos de soporte'],
        ]);

        // Asignar especialidades al odontólogo
        foreach ($especialidades as $esp) {
            Tiene::firstOrCreate([
                'idEspecialidad' => $esp->idEspecialidad,
                'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
            ]);
        }

        // Crear historia clínica
        $historia = HistoriaClinica::factory()->create([
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
            'motivoConsulta' => 'Dolor en muela posterior derecha',
            'antecedentesPatologicos' => 'Ninguno significante',
            'signosVitales' => 'TA: 120/80, FC: 72, Temp: 36.5°C',
            'descripcionSignosSintomasDentales' => 'Dolor agudo al masticar en el lado derecho',
            'examenClinicoBucoDental' => 'Caries profunda en molar 46, encías sanas',
            'observaciones' => 'Paciente requiere tratamiento de conducto',
            'enfermedadActual' => 'Caries dental complicada',
        ]);

        // Crear cita
        $cita = Cita::create([
            'hora' => '10:00',
            'fecha' => now()->addDays(5)->format('Y-m-d'),
            'estado' => 'confirmada',
            'tipoCita' => 'Consulta y tratamiento',
            'costo' => 150.00,
            'pagado' => true,
        ]);

        // Crear tratamiento para la cita
        $tratamiento = Tratamiento::factory()->create([
            'idCita' => $cita->idCita,
            'nombre' => 'Obturación composite',
            'precio' => 120.00,
        ]);

        // Crear odontograma
        $odontograma = Odontograma::factory()->create([
            'nombre' => 'Odontograma Inicial',
            'descripcion' => 'Evaluación inicial del estado dental',
            'fecha' => now()->format('Y-m-d'),
            'observacion' => 'Paciente con múltiples caries',
        ]);

        // Crear piezas dentales específicas (usando create en lugar de factory para evitar el campo incorrecto)
        $piezas = [
            PiezaDental::create(['idOdontograma'=>$odontograma->idOdontograma,'posicion' => '16', 'nombre' => 'Primer Molar Superior Derecho', 'tipo' => 'Molar', 'estado' => 'cariado']),
            PiezaDental::create(['idOdontograma'=>$odontograma->idOdontograma,'posicion' => '26', 'nombre' => 'Primer Molar Superior Izquierdo', 'tipo' => 'Molar', 'estado' => 'sano']),
            PiezaDental::create(['idOdontograma'=>$odontograma->idOdontograma,'posicion' => '36', 'nombre' => 'Primer Molar Inferior Izquierdo', 'tipo' => 'Molar', 'estado' => 'sano']),
            PiezaDental::create(['idOdontograma'=>$odontograma->idOdontograma,'posicion' => '46', 'nombre' => 'Primer Molar Inferior Derecho', 'tipo' => 'Molar', 'estado' => 'cariado']),
        ];

        // Crear acciones dentales
        $acciones = Accion::factory()->createMany([
            ['nombre' => 'Caries', 'color' => '#FF6B6B'],
            ['nombre' => 'Obturación', 'color' => '#4ECDC4'],
            ['nombre' => 'Extracción', 'color' => '#45B7D1'],
            ['nombre' => 'Limpieza', 'color' => '#96CEB4'],
        ]);

        // Crear relaciones detalle dental
        DetalleDental::firstOrCreate([
            'idPiezaDental' => $piezas[0]->idPieza,
            'idAccion' => $acciones[0]->idAccion,
        ], [
            'descripcion' => 'Caries profunda en cara oclusal',
            'cuadrante' => 'Superior Derecho',
            'fecha' => now()->format('Y-m-d'),
        ]);

        DetalleDental::firstOrCreate([
            'idPiezaDental' => $piezas[3]->idPieza,
            'idAccion' => $acciones[0]->idAccion,
        ], [
            'descripcion' => 'Caries moderada en cara distal',
            'cuadrante' => 'Inferior Derecho',
            'fecha' => now()->format('Y-m-d'),
        ]);

        // Crear evoluciones (tratamiento - pieza dental)
        Evolucion::firstOrCreate([
            'idTratamiento' => $tratamiento->idTratamiento,
            'idPieza' => $piezas[0]->idPieza,
        ], [
            'diagnosticoCIE' => 'K02.1',
            'procedimientoIndicacion' => 'Obturación con composite en cara oclusal',
            'fecha' => now()->format('Y-m-d'),
        ]);

        // Crear plan de tratamiento
        $plan = Plan::factory()->create([
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idOdontograma' => $odontograma->idOdontograma,
            'observacion' => 'Plan integral de rehabilitación dental',
            'medicamentos' => 'Amoxicilina 500mg cada 8 horas por 7 días',
            'duracionTotal' => 90,
            'duracionEstimada' => 60,
        ]);

        // Crear sesión
        $sesion = Sesion::factory()->create([
            'nombre' => 'Sesión de tratamiento inicial',
            'descripcion' => 'Primera sesión de evaluación y planificación',
            'hora' => '09:00',
            'fecha' => now()->addDays(3)->format('Y-m-d'),
            'observacion' => 'Paciente colaborador y puntual',
        ]);

        // Asistencia a sesión
        Asiste::firstOrCreate([
            'idSesion' => $sesion->idSesion,
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
        ], [
            'fecha' => $sesion->fecha,
        ]);

        // Efectuación de odontograma
        Efectua::firstOrCreate([
            'idOdontograma' => $odontograma->idOdontograma,
            'idUsuario_Paciente' => $paciente->idUsuario_Paciente,
            'idUsuario_Odontologo' => $odontologo->idUsuario_Odontologo,
        ], [
            'fecha' => now()->format('Y-m-d'),
        ]);

        // Evaluación de sesión-odontograma
        Evalua::firstOrCreate([
            'idSesion' => $sesion->idSesion,
            'idOdontograma' => $odontograma->idOdontograma,
        ], [
            'fecha' => $sesion->fecha,
        ]);

        $this->command->info('BD OKKK');
        $this->command->info('Admin: admin@clinicadental.com / admin123');
        $this->command->info('Odontólogo: odontologo@clinicadental.com / 123456789');
        $this->command->info('Paciente: paciente@clinicadental.com / 123456789');
        $this->command->info('Asistente: asistente@clinicadental.com / 123456789');
    }
}