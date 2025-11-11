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
use App\Models\Hace;
use App\Models\Atiende;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==================== USUARIOS ====================
        $usuarios = [
            // Pacientes
            ['idUsuario' => 1, 'ci' => '7845123', 'nombre' => 'María', 'paterno' => 'González', 'materno' => 'Pérez', 'fechaNacimiento' => '1985-03-15', 'genero' => 'F', 'telefono' => '71234567', 'correo' => 'maria.gonzalez@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Av. Arce #1234', 'estado' => true],
            ['idUsuario' => 2, 'ci' => '6532189', 'nombre' => 'Carlos', 'paterno' => 'Mamani', 'materno' => 'Quispe', 'fechaNacimiento' => '1990-07-22', 'genero' => 'M', 'telefono' => '72345678', 'correo' => 'carlos.mamani@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Calle Sucre #567', 'estado' => true],
            ['idUsuario' => 3, 'ci' => '8965432', 'nombre' => 'Ana', 'paterno' => 'Rodríguez', 'materno' => 'López', 'fechaNacimiento' => '1988-11-08', 'genero' => 'F', 'telefono' => '73456789', 'correo' => 'ana.rodriguez@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Zona Sopocachi #890', 'estado' => true],
            ['idUsuario' => 4, 'ci' => '5478912', 'nombre' => 'Roberto', 'paterno' => 'Flores', 'materno' => 'Castro', 'fechaNacimiento' => '1995-01-30', 'genero' => 'M', 'telefono' => '74567890', 'correo' => 'roberto.flores@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Av. 6 de Agosto #234', 'estado' => true],
            ['idUsuario' => 5, 'ci' => '9876543', 'nombre' => 'Laura', 'paterno' => 'Condori', 'materno' => 'Apaza', 'fechaNacimiento' => '1992-05-18', 'genero' => 'F', 'telefono' => '75678901', 'correo' => 'laura.condori@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Villa Fátima #456', 'estado' => true],
            
            // Odontólogos
            ['idUsuario' => 6, 'ci' => '3214569', 'nombre' => 'Juan', 'paterno' => 'Torrez', 'materno' => 'Vargas', 'fechaNacimiento' => '1987-09-25', 'genero' => 'M', 'telefono' => '76789012', 'correo' => 'juan.torrez@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Calacoto #789', 'estado' => true],
            ['idUsuario' => 7, 'ci' => '7412589', 'nombre' => 'Patricia', 'paterno' => 'Quisbert', 'materno' => 'Nina', 'fechaNacimiento' => '1993-12-14', 'genero' => 'F', 'telefono' => '77890123', 'correo' => 'patricia.quisbert@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Miraflores #321', 'estado' => true],
            ['idUsuario' => 8, 'ci' => '8523697', 'nombre' => 'Diego', 'paterno' => 'Limachi', 'materno' => 'Choque', 'fechaNacimiento' => '1991-04-07', 'genero' => 'M', 'telefono' => '78901234', 'correo' => 'diego.limachi@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'San Miguel #654', 'estado' => true],
            
            // Administradores
            ['idUsuario' => 9, 'ci' => '4561237', 'nombre' => 'Sofía', 'paterno' => 'Poma', 'materno' => 'Sanchez', 'fechaNacimiento' => '1996-08-20', 'genero' => 'F', 'telefono' => '79012345', 'correo' => 'sofia.poma@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Obrajes #987', 'estado' => true],
            
            // Asistentes
            ['idUsuario' => 10, 'ci' => '6547893', 'nombre' => 'Miguel', 'paterno' => 'Alarcon', 'materno' => 'Rojas', 'fechaNacimiento' => '1989-02-11', 'genero' => 'M', 'telefono' => '70123456', 'correo' => 'miguel.alarcon@email.com', 'contrasena' => Hash::make('password123'), 'direccion' => 'Achumani #147', 'estado' => true],
            
            // Usuarios del sistema
            ['idUsuario' => 12, 'ci' => '1234567', 'nombre' => 'Admin', 'paterno' => 'Principal', 'materno' => 'Sistema', 'fechaNacimiento' => '1980-01-01', 'genero' => 'M', 'telefono' => '77777777', 'correo' => 'admin@clinicadental.com', 'contrasena' => Hash::make('admin123'), 'direccion' => 'Av. Principal #123', 'estado' => true],
            ['idUsuario' => 13, 'ci' => '7654321', 'nombre' => 'Joe', 'paterno' => 'Tancara', 'materno' => 'Mendez', 'fechaNacimiento' => '1985-05-15', 'genero' => 'M', 'telefono' => '77777778', 'correo' => 'odontologo@clinicadental.com', 'contrasena' => Hash::make('123456789'), 'direccion' => 'Av. Odontologos #456', 'estado' => true],
            ['idUsuario' => 14, 'ci' => '1122334', 'nombre' => 'Prueba', 'paterno' => 'Paciente', 'materno' => 'Test', 'fechaNacimiento' => '1990-08-20', 'genero' => 'F', 'telefono' => '77777779', 'correo' => 'paciente@clinicadental.com', 'contrasena' => Hash::make('123456789'), 'direccion' => 'Calle Pacientes #789', 'estado' => true],
            ['idUsuario' => 15, 'ci' => '4433221', 'nombre' => 'Kae', 'paterno' => 'Apellido', 'materno' => 'Asistente', 'fechaNacimiento' => '1992-03-10', 'genero' => 'F', 'telefono' => '77777780', 'correo' => 'asistente@clinicadental.com', 'contrasena' => Hash::make('123456789'), 'direccion' => 'Av. Asistentes #321', 'estado' => true],
        ];

        foreach ($usuarios as $usuario) {
            Usuario::create($usuario);
        }

        // ==================== ROLES ====================
        // Administradores
        Administrador::create(['idUsuario_ADM' => 9]);
        Administrador::create(['idUsuario_ADM' => 12]);

        // Odontólogos
        $odontologos = [
            ['idUsuario_Odontologo' => 6, 'fechaContratacion' => '2020-01-10', 'horario' => 'Lunes a Viernes 8:00-16:00'],
            ['idUsuario_Odontologo' => 7, 'fechaContratacion' => '2021-06-15', 'horario' => 'Lunes a Viernes 14:00-20:00'],
            ['idUsuario_Odontologo' => 8, 'fechaContratacion' => '2022-03-20', 'horario' => 'Lunes a Sábado 8:00-14:00'],
            ['idUsuario_Odontologo' => 13, 'fechaContratacion' => '2020-01-15', 'horario' => 'Lunes a Viernes 8:00-16:00'],
        ];
        foreach ($odontologos as $odontologo) {
            Odontologo::create($odontologo);
        }

        // Asistentes
        Asistente::create(['idUsuario_Asistente' => 10, 'turno' => 'Mañana', 'fechaContratacion' => '2023-02-01']);
        Asistente::create(['idUsuario_Asistente' => 15, 'turno' => 'mañana', 'fechaContratacion' => '2022-06-01']);

        // Pacientes
        $pacientes = [
            ['idUsuario_Paciente' => 1, 'codigoSeguro' => 'SEG-001-2024', 'lugarNacimiento' => 'La Paz', 'domicilio' => 'Av. Arce #1234', 'fechaIngreso' => '2024-01-15'],
            ['idUsuario_Paciente' => 2, 'codigoSeguro' => 'SEG-002-2024', 'lugarNacimiento' => 'El Alto', 'domicilio' => 'Calle Sucre #567', 'fechaIngreso' => '2024-02-20'],
            ['idUsuario_Paciente' => 3, 'codigoSeguro' => 'SEG-003-2024', 'lugarNacimiento' => 'La Paz', 'domicilio' => 'Zona Sopocachi #890', 'fechaIngreso' => '2024-03-10'],
            ['idUsuario_Paciente' => 4, 'codigoSeguro' => 'SEG-004-2024', 'lugarNacimiento' => 'Oruro', 'domicilio' => 'Av. 6 de Agosto #234', 'fechaIngreso' => '2024-04-05'],
            ['idUsuario_Paciente' => 5, 'codigoSeguro' => 'SEG-005-2024', 'lugarNacimiento' => 'Cochabamba', 'domicilio' => 'Villa Fátima #456', 'fechaIngreso' => '2024-05-12'],
            ['idUsuario_Paciente' => 14, 'codigoSeguro' => 'SEG-001234', 'lugarNacimiento' => 'La Paz, Bolivia', 'domicilio' => 'Calle Pacientes #789, Zona Central', 'fechaIngreso' => '2023-01-10'],
        ];
        foreach ($pacientes as $paciente) {
            Paciente::create($paciente);
        }

        // ==================== ESPECIALIDADES ====================
        $especialidades = [
            ['idEspecialidad' => 1, 'nombre' => 'Ortodoncia', 'descripcion' => 'Corrección de la posición de dientes y huesos maxilares'],
            ['idEspecialidad' => 2, 'nombre' => 'Endodoncia', 'descripcion' => 'Tratamiento de conductos radiculares'],
            ['idEspecialidad' => 3, 'nombre' => 'Periodoncia', 'descripcion' => 'Tratamiento de enfermedades de encías y estructuras de soporte'],
            ['idEspecialidad' => 4, 'nombre' => 'Odontopediatría', 'descripcion' => 'Atención dental especializada en niños'],
            ['idEspecialidad' => 5, 'nombre' => 'Cirugía Oral', 'descripcion' => 'Procedimientos quirúrgicos en la cavidad oral'],
            ['idEspecialidad' => 6, 'nombre' => 'Implantología', 'descripcion' => 'Colocación de implantes dentales'],
            ['idEspecialidad' => 7, 'nombre' => 'Estética Dental', 'descripcion' => 'Procedimientos para mejorar la apariencia dental'],
            ['idEspecialidad' => 8, 'nombre' => 'Prostodoncia', 'descripcion' => 'Rehabilitación con prótesis dentales'],
        ];
        foreach ($especialidades as $especialidad) {
            Especialidad::create($especialidad);
        }

        // ==================== RELACIÓN TIENE (Especialidad - Odontólogo) ====================
        $tiene = [
            ['idEspecialidad' => 1, 'idUsuario_Odontologo' => 6],
            ['idEspecialidad' => 2, 'idUsuario_Odontologo' => 7],
            ['idEspecialidad' => 3, 'idUsuario_Odontologo' => 7],
            ['idEspecialidad' => 5, 'idUsuario_Odontologo' => 8],
            ['idEspecialidad' => 6, 'idUsuario_Odontologo' => 8],
            ['idEspecialidad' => 7, 'idUsuario_Odontologo' => 6],
            ['idEspecialidad' => 1, 'idUsuario_Odontologo' => 13],
            ['idEspecialidad' => 2, 'idUsuario_Odontologo' => 13],
            ['idEspecialidad' => 3, 'idUsuario_Odontologo' => 13],
        ];
        foreach ($tiene as $relacion) {
            Tiene::create($relacion);
        }

        // ==================== ACCIONES ====================
        $acciones = [
            ['idAccion' => 1, 'nombre' => 'Caries', 'color' => '#FF0000'],
            ['idAccion' => 2, 'nombre' => 'Obturación', 'color' => '#0000FF'],
            ['idAccion' => 3, 'nombre' => 'Corona', 'color' => '#FFD700'],
            ['idAccion' => 4, 'nombre' => 'Extracción', 'color' => '#000000'],
            ['idAccion' => 5, 'nombre' => 'Endodoncia', 'color' => '#800080'],
            ['idAccion' => 6, 'nombre' => 'Implante', 'color' => '#00FF00'],
            ['idAccion' => 7, 'nombre' => 'Limpieza', 'color' => '#87CEEB'],
            ['idAccion' => 8, 'nombre' => 'Sellador', 'color' => '#FFA500'],
        ];
        foreach ($acciones as $accion) {
            Accion::create($accion);
        }

        // ==================== CITAS ====================
        $citas = [
            ['idCita' => 1, 'hora' => '09:00:00', 'fecha' => '2024-10-01', 'estado' => 'completada', 'tipoCita' => 'Consulta', 'costo' => 150.00, 'pagado' => 150.00],
            ['idCita' => 2, 'hora' => '10:30:00', 'fecha' => '2024-10-02', 'estado' => 'completada', 'tipoCita' => 'Limpieza', 'costo' => 200.00, 'pagado' => 200.00],
            ['idCita' => 3, 'hora' => '14:00:00', 'fecha' => '2024-10-05', 'estado' => 'completada', 'tipoCita' => 'Endodoncia', 'costo' => 800.00, 'pagado' => 400.00],
            ['idCita' => 4, 'hora' => '15:30:00', 'fecha' => '2024-10-08', 'estado' => 'completada', 'tipoCita' => 'Extracción', 'costo' => 300.00, 'pagado' => 300.00],
            ['idCita' => 5, 'hora' => '09:00:00', 'fecha' => '2024-10-12', 'estado' => 'completada', 'tipoCita' => 'Ortodoncia', 'costo' => 1500.00, 'pagado' => 1500.00],
            ['idCita' => 6, 'hora' => '11:00:00', 'fecha' => '2024-10-15', 'estado' => 'confirmada', 'tipoCita' => 'Blanqueamiento', 'costo' => 600.00, 'pagado' => 0.00],
            ['idCita' => 7, 'hora' => '16:00:00', 'fecha' => '2024-10-18', 'estado' => 'confirmada', 'tipoCita' => 'Implante', 'costo' => 3000.00, 'pagado' => 0.00],
            ['idCita' => 8, 'hora' => '10:00:00', 'fecha' => '2024-10-20', 'estado' => 'pendiente', 'tipoCita' => 'Consulta', 'costo' => 150.00, 'pagado' => 0.00],
            ['idCita' => 9, 'hora' => '10:00:00', 'fecha' => '2025-11-14', 'estado' => 'confirmada', 'tipoCita' => 'Consulta y tratamiento', 'costo' => 150.00, 'pagado' => 1.00],
        ];
        foreach ($citas as $cita) {
            Cita::create($cita);
        }

        // ==================== TRATAMIENTOS ====================
        $tratamientos = [
            ['idTratamiento' => 1, 'nombre' => 'Consulta y revisión general', 'precio' => 150.00, 'idCita' => 1],
            ['idTratamiento' => 2, 'nombre' => 'Limpieza dental completa', 'precio' => 200.00, 'idCita' => 2],
            ['idTratamiento' => 3, 'nombre' => 'Endodoncia molar', 'precio' => 800.00, 'idCita' => 3],
            ['idTratamiento' => 4, 'nombre' => 'Extracción quirúrgica muela del juicio', 'precio' => 300.00, 'idCita' => 4],
            ['idTratamiento' => 5, 'nombre' => 'Colocación de brackets metálicos', 'precio' => 1500.00, 'idCita' => 5],
            ['idTratamiento' => 6, 'nombre' => 'Blanqueamiento dental LED', 'precio' => 600.00, 'idCita' => 6],
            ['idTratamiento' => 7, 'nombre' => 'Implante dental unitario', 'precio' => 3000.00, 'idCita' => 7],
            ['idTratamiento' => 8, 'nombre' => 'Consulta de seguimiento', 'precio' => 150.00, 'idCita' => 8],
            ['idTratamiento' => 9, 'nombre' => 'Obturación composite', 'precio' => 120.00, 'idCita' => 9],
        ];
        foreach ($tratamientos as $tratamiento) {
            Tratamiento::create($tratamiento);
        }

        // ==================== HACE (Paciente - Cita - Asistente - Odontólogo) ====================
        $hace = [
            ['idUsuario_Paciente' => 1, 'idCita' => 1, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 6, 'fecha' => '2024-10-01'],
            ['idUsuario_Paciente' => 2, 'idCita' => 2, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 7, 'fecha' => '2024-10-02'],
            ['idUsuario_Paciente' => 3, 'idCita' => 3, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 7, 'fecha' => '2024-10-05'],
            ['idUsuario_Paciente' => 4, 'idCita' => 4, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 8, 'fecha' => '2024-10-08'],
            ['idUsuario_Paciente' => 5, 'idCita' => 5, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 6, 'fecha' => '2024-10-12'],
            ['idUsuario_Paciente' => 1, 'idCita' => 6, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 6, 'fecha' => '2024-10-15'],
            ['idUsuario_Paciente' => 2, 'idCita' => 7, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 8, 'fecha' => '2024-10-18'],
            ['idUsuario_Paciente' => 3, 'idCita' => 8, 'idUsuario_Asistente' => 10, 'idUsuario_Odontologo' => 7, 'fecha' => '2024-10-20'],
        ];
        foreach ($hace as $relacion) {
            Hace::create($relacion);
        }

        // ==================== ATIENDE (Odontólogo - Cita) ====================
        $atiende = [
            ['idUsuario_Odontologo' => 6, 'idCita' => 1, 'fecha' => '2024-10-01'],
            ['idUsuario_Odontologo' => 7, 'idCita' => 2, 'fecha' => '2024-10-02'],
            ['idUsuario_Odontologo' => 7, 'idCita' => 3, 'fecha' => '2024-10-05'],
            ['idUsuario_Odontologo' => 8, 'idCita' => 4, 'fecha' => '2024-10-08'],
            ['idUsuario_Odontologo' => 6, 'idCita' => 5, 'fecha' => '2024-10-12'],
        ];
        foreach ($atiende as $relacion) {
            Atiende::create($relacion);
        }

        // ==================== ODONTOGRAMAS ====================
        $odontogramas = [
            ['idOdontograma' => 1, 'nombre' => 'Odontograma inicial - María González', 'descripcion' => 'Evaluación inicial del paciente', 'fecha' => '2024-10-01', 'observacion' => 'Estado dental bueno'],
            ['idOdontograma' => 2, 'nombre' => 'Odontograma inicial - Carlos Mamani', 'descripcion' => 'Evaluación inicial del paciente', 'fecha' => '2024-10-02', 'observacion' => 'Requiere limpieza profunda'],
            ['idOdontograma' => 3, 'nombre' => 'Odontograma inicial - Ana Rodríguez', 'descripcion' => 'Evaluación inicial del paciente', 'fecha' => '2024-10-05', 'observacion' => 'Caries en pieza 46'],
            ['idOdontograma' => 4, 'nombre' => 'Odontograma inicial - Roberto Flores', 'descripcion' => 'Evaluación inicial del paciente', 'fecha' => '2024-10-08', 'observacion' => 'Muela del juicio problemática'],
            ['idOdontograma' => 5, 'nombre' => 'Odontograma inicial - Laura Condori', 'descripcion' => 'Evaluación inicial del paciente', 'fecha' => '2024-10-12', 'observacion' => 'Apiñamiento dental severo'],
            ['idOdontograma' => 6, 'nombre' => 'Odontograma seguimiento - María González', 'descripcion' => 'Control a los 3 meses', 'fecha' => '2024-11-01', 'observacion' => 'Mantenimiento preventivo'],
            ['idOdontograma' => 7, 'nombre' => 'Odontograma seguimiento - Carlos Mamani', 'descripcion' => 'Post limpieza', 'fecha' => '2024-10-16', 'observacion' => 'Mejoría notable en encías'],
            ['idOdontograma' => 8, 'nombre' => 'Odontograma seguimiento - Ana Rodríguez', 'descripcion' => 'Post endodoncia', 'fecha' => '2024-10-19', 'observacion' => 'Tratamiento exitoso'],
            ['idOdontograma' => 9, 'nombre' => 'Odontograma Inicial', 'descripcion' => 'Evaluación inicial del estado dental', 'fecha' => '2025-11-09', 'observacion' => 'Paciente con múltiples caries'],
        ];
        foreach ($odontogramas as $odontograma) {
            Odontograma::create($odontograma);
        }

        // ==================== EFECTUA (Odontograma - Odontólogo - Paciente) ====================
        $efectua = [
            ['idOdontograma' => 1, 'idUsuario_Odontologo' => 6, 'idUsuario_Paciente' => 1, 'fecha' => '2024-10-01'],
            ['idOdontograma' => 2, 'idUsuario_Odontologo' => 7, 'idUsuario_Paciente' => 2, 'fecha' => '2024-10-02'],
            ['idOdontograma' => 3, 'idUsuario_Odontologo' => 7, 'idUsuario_Paciente' => 3, 'fecha' => '2024-10-05'],
            ['idOdontograma' => 4, 'idUsuario_Odontologo' => 8, 'idUsuario_Paciente' => 4, 'fecha' => '2024-10-08'],
            ['idOdontograma' => 5, 'idUsuario_Odontologo' => 6, 'idUsuario_Paciente' => 5, 'fecha' => '2024-10-12'],
            ['idOdontograma' => 6, 'idUsuario_Odontologo' => 6, 'idUsuario_Paciente' => 1, 'fecha' => '2024-11-01'],
            ['idOdontograma' => 7, 'idUsuario_Odontologo' => 7, 'idUsuario_Paciente' => 2, 'fecha' => '2024-10-16'],
            ['idOdontograma' => 8, 'idUsuario_Odontologo' => 7, 'idUsuario_Paciente' => 3, 'fecha' => '2024-10-19'],
            ['idOdontograma' => 9, 'idUsuario_Odontologo' => 13, 'idUsuario_Paciente' => 14, 'fecha' => '2025-11-09'],
        ];
        foreach ($efectua as $relacion) {
            Efectua::create($relacion);
        }

        // ==================== PIEZAS DENTALES ====================
        $piezas = [
            ['idPieza' => 1, 'posicion' => '11', 'nombre' => 'Incisivo central superior derecho', 'tipo' => 'Permanente', 'estado' => 'Sano', 'idOdontograma' => 1],
            ['idPieza' => 2, 'posicion' => '21', 'nombre' => 'Incisivo central superior izquierdo', 'tipo' => 'Permanente', 'estado' => 'Sano', 'idOdontograma' => 1],
            ['idPieza' => 3, 'posicion' => '16', 'nombre' => 'Primer molar superior derecho', 'tipo' => 'Permanente', 'estado' => 'Obturado', 'idOdontograma' => 1],
            ['idPieza' => 4, 'posicion' => '26', 'nombre' => 'Primer molar superior izquierdo', 'tipo' => 'Permanente', 'estado' => 'Sano', 'idOdontograma' => 1],
            ['idPieza' => 5, 'posicion' => '11', 'nombre' => 'Incisivo central superior derecho', 'tipo' => 'Permanente', 'estado' => 'Sano', 'idOdontograma' => 2],
            ['idPieza' => 6, 'posicion' => '36', 'nombre' => 'Primer molar inferior izquierdo', 'tipo' => 'Permanente', 'estado' => 'Caries', 'idOdontograma' => 2],
            ['idPieza' => 7, 'posicion' => '46', 'nombre' => 'Primer molar inferior derecho', 'tipo' => 'Permanente', 'estado' => 'Caries', 'idOdontograma' => 2],
            ['idPieza' => 8, 'posicion' => '18', 'nombre' => 'Tercer molar superior derecho', 'tipo' => 'Permanente', 'estado' => 'Sano', 'idOdontograma' => 2],
            ['idPieza' => 9, 'posicion' => '46', 'nombre' => 'Primer molar inferior derecho', 'tipo' => 'Permanente', 'estado' => 'Caries profunda', 'idOdontograma' => 3],
            ['idPieza' => 10, 'posicion' => '36', 'nombre' => 'Primer molar inferior izquierdo', 'tipo' => 'Permanente', 'estado' => 'Obturado', 'idOdontograma' => 3],
            ['idPieza' => 11, 'posicion' => '38', 'nombre' => 'Tercer molar inferior izquierdo', 'tipo' => 'Permanente', 'estado' => 'Extraído', 'idOdontograma' => 4],
            ['idPieza' => 12, 'posicion' => '48', 'nombre' => 'Tercer molar inferior derecho', 'tipo' => 'Permanente', 'estado' => 'Sano', 'idOdontograma' => 4],
            ['idPieza' => 13, 'posicion' => '11', 'nombre' => 'Incisivo central superior derecho', 'tipo' => 'Permanente', 'estado' => 'Apiñado', 'idOdontograma' => 5],
            ['idPieza' => 14, 'posicion' => '21', 'nombre' => 'Incisivo central superior izquierdo', 'tipo' => 'Permanente', 'estado' => 'Apiñado', 'idOdontograma' => 5],
            ['idPieza' => 15, 'posicion' => '16', 'nombre' => 'Primer Molar Superior Derecho', 'tipo' => 'Molar', 'estado' => 'cariado', 'idOdontograma' => 9],
            ['idPieza' => 16, 'posicion' => '26', 'nombre' => 'Primer Molar Superior Izquierdo', 'tipo' => 'Molar', 'estado' => 'sano', 'idOdontograma' => 9],
            ['idPieza' => 17, 'posicion' => '36', 'nombre' => 'Primer Molar Inferior Izquierdo', 'tipo' => 'Molar', 'estado' => 'sano', 'idOdontograma' => 9],
            ['idPieza' => 18, 'posicion' => '46', 'nombre' => 'Primer Molar Inferior Derecho', 'tipo' => 'Molar', 'estado' => 'cariado', 'idOdontograma' => 9],
        ];
        foreach ($piezas as $pieza) {
            PiezaDental::create($pieza);
        }

        // ==================== SESIONES ====================
        $sesiones = [
            ['idSesion' => 1, 'nombre' => 'Consulta inicial María González', 'descripcion' => 'Primera evaluación dental', 'hora' => '09:00:00', 'observacion' => 'Paciente colaborador', 'fecha' => '2024-10-01'],
            ['idSesion' => 2, 'nombre' => 'Limpieza Carlos Mamani', 'descripcion' => 'Limpieza dental profunda', 'hora' => '10:30:00', 'observacion' => 'Mejorar técnica de cepillado', 'fecha' => '2024-10-02'],
            ['idSesion' => 3, 'nombre' => 'Endodoncia Ana Rodríguez - Sesión 1', 'descripcion' => 'Apertura cameral y conductometría', 'hora' => '14:00:00', 'observacion' => 'Anestesia efectiva', 'fecha' => '2024-10-05'],
            ['idSesion' => 4, 'nombre' => 'Extracción Roberto Flores', 'descripcion' => 'Extracción muela del juicio', 'hora' => '15:30:00', 'observacion' => 'Procedimiento sin complicaciones', 'fecha' => '2024-10-08'],
            ['idSesion' => 5, 'nombre' => 'Ortodoncia Laura Condori', 'descripcion' => 'Colocación de aparatología', 'hora' => '09:00:00', 'observacion' => 'Paciente tolera bien el procedimiento', 'fecha' => '2024-10-12'],
            ['idSesion' => 6, 'nombre' => 'Consulta seguimiento María González', 'descripcion' => 'Control a los 3 meses', 'hora' => '11:00:00', 'observacion' => 'Estado dental estable', 'fecha' => '2024-11-01'],
            ['idSesion' => 7, 'nombre' => 'Control Carlos Mamani', 'descripcion' => 'Evaluación post-limpieza', 'hora' => '16:00:00', 'observacion' => 'Mejoría significativa', 'fecha' => '2024-10-16'],
            ['idSesion' => 8, 'nombre' => 'Endodoncia Ana Rodríguez - Sesión 2', 'descripcion' => 'Obturación de conductos', 'hora' => '10:00:00', 'observacion' => 'Tratamiento completado satisfactoriamente', 'fecha' => '2024-10-19'],
            ['idSesion' => 9, 'nombre' => 'Sesión de tratamiento inicial', 'descripcion' => 'Primera sesión de evaluación y planificación', 'hora' => '09:00:00', 'observacion' => 'Paciente colaborador y puntual', 'fecha' => '2025-11-12'],
        ];
        foreach ($sesiones as $sesion) {
            Sesion::create($sesion);
        }

        // ==================== ASISTE (Sesión - Paciente - Odontólogo) ====================
        $asiste = [
            ['idSesion' => 1, 'idUsuario_Paciente' => 1, 'idUsuario_Odontologo' => 6, 'fecha' => '2024-10-01'],
            ['idSesion' => 2, 'idUsuario_Paciente' => 2, 'idUsuario_Odontologo' => 7, 'fecha' => '2024-10-02'],
            ['idSesion' => 3, 'idUsuario_Paciente' => 3, 'idUsuario_Odontologo' => 7, 'fecha' => '2024-10-05'],
            ['idSesion' => 4, 'idUsuario_Paciente' => 4, 'idUsuario_Odontologo' => 8, 'fecha' => '2024-10-08'],
            ['idSesion' => 5, 'idUsuario_Paciente' => 5, 'idUsuario_Odontologo' => 6, 'fecha' => '2024-10-12'],
            ['idSesion' => 6, 'idUsuario_Paciente' => 1, 'idUsuario_Odontologo' => 6, 'fecha' => '2024-11-01'],
            ['idSesion' => 7, 'idUsuario_Paciente' => 2, 'idUsuario_Odontologo' => 7, 'fecha' => '2024-10-16'],
            ['idSesion' => 8, 'idUsuario_Paciente' => 3, 'idUsuario_Odontologo' => 7, 'fecha' => '2024-10-19'],
            ['idSesion' => 9, 'idUsuario_Paciente' => 14, 'idUsuario_Odontologo' => 13, 'fecha' => '2025-11-12'],
        ];
        foreach ($asiste as $relacion) {
            Asiste::create($relacion);
        }

        // ==================== EVALUA (Sesión - Odontograma) ====================
        $evalua = [
            ['idSesion' => 1, 'idOdontograma' => 1, 'fecha' => '2024-10-01'],
            ['idSesion' => 2, 'idOdontograma' => 2, 'fecha' => '2024-10-02'],
            ['idSesion' => 3, 'idOdontograma' => 3, 'fecha' => '2024-10-05'],
            ['idSesion' => 4, 'idOdontograma' => 4, 'fecha' => '2024-10-08'],
            ['idSesion' => 5, 'idOdontograma' => 5, 'fecha' => '2024-10-12'],
            ['idSesion' => 6, 'idOdontograma' => 6, 'fecha' => '2024-11-01'],
            ['idSesion' => 7, 'idOdontograma' => 7, 'fecha' => '2024-10-16'],
            ['idSesion' => 8, 'idOdontograma' => 8, 'fecha' => '2024-10-19'],
            ['idSesion' => 9, 'idOdontograma' => 9, 'fecha' => '2025-11-12'],
        ];
        foreach ($evalua as $relacion) {
            Evalua::create($relacion);
        }

        // ==================== HISTORIAS CLÍNICAS ====================
        $historias = [
            [
                'idHistoriaClinica' => 1,
                'antecedentesPatologicos' => 'Ninguno',
                'motivoConsulta' => 'Revisión general',
                'signosVitales' => 'PA: 120/80, FC: 72, Temp: 36.5°C',
                'descripcionSignosSintomasDentales' => 'Sin molestias aparentes',
                'examenClinicoBucoDental' => 'Cavidad oral en buen estado general',
                'observaciones' => 'Control preventivo',
                'enfermedadActual' => 'Ninguna',
                'idUsuario_Paciente' => 1,
                'idUsuario_Odontologo' => 6,
            ],
            [
                'idHistoriaClinica' => 2,
                'antecedentesPatologicos' => 'Hipertensión controlada',
                'motivoConsulta' => 'Limpieza dental',
                'signosVitales' => 'PA: 130/85, FC: 78, Temp: 36.6°C',
                'descripcionSignosSintomasDentales' => 'Acumulación de sarro',
                'examenClinicoBucoDental' => 'Presencia de cálculo dental moderado',
                'observaciones' => 'Se realizó tartrectomía',
                'enfermedadActual' => 'Gingivitis leve',
                'idUsuario_Paciente' => 2,
                'idUsuario_Odontologo' => 7,
            ],
            [
                'idHistoriaClinica' => 3,
                'antecedentesPatologicos' => 'Diabetes tipo 2',
                'motivoConsulta' => 'Dolor en molar inferior derecho',
                'signosVitales' => 'PA: 125/80, FC: 75, Temp: 36.8°C',
                'descripcionSignosSintomasDentales' => 'Dolor pulsátil intenso',
                'examenClinicoBucoDental' => 'Caries profunda en pieza 46',
                'observaciones' => 'Requiere endodoncia',
                'enfermedadActual' => 'Pulpitis aguda',
                'idUsuario_Paciente' => 3,
                'idUsuario_Odontologo' => 7,
            ],
            [
                'idHistoriaClinica' => 4,
                'antecedentesPatologicos' => 'Ninguno',
                'motivoConsulta' => 'Extracción de muela del juicio',
                'signosVitales' => 'PA: 118/75, FC: 70, Temp: 36.4°C',
                'descripcionSignosSintomasDentales' => 'Dolor e inflamación',
                'examenClinicoBucoDental' => 'Pieza 38 parcialmente erupcionada',
                'observaciones' => 'Extracción quirúrgica exitosa',
                'enfermedadActual' => 'Pericoronaritis',
                'idUsuario_Paciente' => 4,
                'idUsuario_Odontologo' => 8,
            ],
            [
                'idHistoriaClinica' => 5,
                'antecedentesPatologicos' => 'Alergia a penicilina',
                'motivoConsulta' => 'Corrección de mordida',
                'signosVitales' => 'PA: 120/78, FC: 73, Temp: 36.5°C',
                'descripcionSignosSintomasDentales' => 'Apiñamiento dental',
                'examenClinicoBucoDental' => 'Maloclusión clase II',
                'observaciones' => 'Inicio de tratamiento ortodóntico',
                'enfermedadActual' => 'Maloclusión',
                'idUsuario_Paciente' => 5,
                'idUsuario_Odontologo' => 6,
            ],
            [
                'idHistoriaClinica' => 6,
                'antecedentesPatologicos' => 'Ninguno',
                'motivoConsulta' => 'Control de rutina',
                'signosVitales' => 'PA: 118/76, FC: 71, Temp: 36.5°C',
                'descripcionSignosSintomasDentales' => 'Sin sintomatología',
                'examenClinicoBucoDental' => 'Estado dental estable',
                'observaciones' => 'Mantenimiento adecuado',
                'enfermedadActual' => 'Ninguna',
                'idUsuario_Paciente' => 1,
                'idUsuario_Odontologo' => 6,
            ],
            [
                'idHistoriaClinica' => 7,
                'antecedentesPatologicos' => 'Hipertensión controlada',
                'motivoConsulta' => 'Seguimiento post-limpieza',
                'signosVitales' => 'PA: 128/82, FC: 76, Temp: 36.6°C',
                'descripcionSignosSintomasDentales' => 'Mejoría en encías',
                'examenClinicoBucoDental' => 'Reducción significativa de inflamación',
                'observaciones' => 'Continuar con higiene',
                'enfermedadActual' => 'Recuperación favorable',
                'idUsuario_Paciente' => 2,
                'idUsuario_Odontologo' => 7,
            ],
            [
                'idHistoriaClinica' => 8,
                'antecedentesPatologicos' => 'Diabetes tipo 2',
                'motivoConsulta' => 'Revisión post-endodoncia',
                'signosVitales' => 'PA: 124/79, FC: 74, Temp: 36.7°C',
                'descripcionSignosSintomasDentales' => 'Sin dolor',
                'examenClinicoBucoDental' => 'Tratamiento endodóntico exitoso',
                'observaciones' => 'Programar colocación de corona',
                'enfermedadActual' => 'Asintomático',
                'idUsuario_Paciente' => 3,
                'idUsuario_Odontologo' => 7,
            ],
            [
                'idHistoriaClinica' => 9,
                'antecedentesPatologicos' => 'Ninguno significante',
                'motivoConsulta' => 'Dolor en muela posterior derecha',
                'signosVitales' => 'TA: 120/80, FC: 72, Temp: 36.5°C',
                'descripcionSignosSintomasDentales' => 'Dolor agudo al masticar en el lado derecho',
                'examenClinicoBucoDental' => 'Caries profunda en molar 46, encías sanas',
                'observaciones' => 'Paciente requiere tratamiento de conducto',
                'enfermedadActual' => 'Caries dental complicada',
                'idUsuario_Paciente' => 14,
                'idUsuario_Odontologo' => 13,
            ],
        ];
        foreach ($historias as $historia) {
            HistoriaClinica::create($historia);
        }

        // ==================== PLANES DE TRATAMIENTO ====================
        $planes = [
            ['idPlan' => 1, 'observacion' => 'Controles cada 6 meses', 'medicamentos' => 'Ninguno', 'duracionTotal' => 0, 'duracionEstimada' => 0, 'idUsuario_Paciente' => 1, 'idOdontograma' => 1],
            ['idPlan' => 2, 'observacion' => 'Mejorar técnica de cepillado', 'medicamentos' => 'Enjuague bucal con clorhexidina 0.12%', 'duracionTotal' => 15, 'duracionEstimada' => 15, 'idUsuario_Paciente' => 2, 'idOdontograma' => 2],
            ['idPlan' => 3, 'observacion' => 'Completar endodoncia y colocar corona', 'medicamentos' => 'Ibuprofeno 400mg c/8h por 3 días', 'duracionTotal' => 30, 'duracionEstimada' => 21, 'idUsuario_Paciente' => 3, 'idOdontograma' => 3],
            ['idPlan' => 4, 'observacion' => 'Cuidados post-extracción', 'medicamentos' => 'Amoxicilina 500mg c/8h por 7 días, Ibuprofeno 400mg', 'duracionTotal' => 7, 'duracionEstimada' => 7, 'idUsuario_Paciente' => 4, 'idOdontograma' => 4],
            ['idPlan' => 5, 'observacion' => 'Tratamiento ortodóntico 18-24 meses', 'medicamentos' => 'Analgésicos según necesidad', 'duracionTotal' => 730, 'duracionEstimada' => 640, 'idUsuario_Paciente' => 5, 'idOdontograma' => 5],
            ['idPlan' => 6, 'observacion' => 'Mantenimiento preventivo', 'medicamentos' => 'Pasta dental con flúor', 'duracionTotal' => 180, 'duracionEstimada' => 180, 'idUsuario_Paciente' => 1, 'idOdontograma' => 6],
            ['idPlan' => 7, 'observacion' => 'Control periodontal', 'medicamentos' => 'Enjuague bucal diario', 'duracionTotal' => 30, 'duracionEstimada' => 30, 'idUsuario_Paciente' => 2, 'idOdontograma' => 7],
            ['idPlan' => 8, 'observacion' => 'Seguimiento endodoncia', 'medicamentos' => 'Ninguno', 'duracionTotal' => 90, 'duracionEstimada' => 90, 'idUsuario_Paciente' => 3, 'idOdontograma' => 8],
            ['idPlan' => 9, 'observacion' => 'Plan integral de rehabilitación dental', 'medicamentos' => 'Amoxicilina 500mg cada 8 horas por 7 días', 'duracionTotal' => 90, 'duracionEstimada' => 60, 'idUsuario_Paciente' => 14, 'idOdontograma' => 9],
        ];
        foreach ($planes as $plan) {
            Plan::create($plan);
        }

        // ==================== DETALLE DENTAL ====================
        $detalles = [
            ['idAccion' => 7, 'idPiezaDental' => 1, 'descripcion' => 'Limpieza y profilaxis', 'cuadrante' => '1', 'fecha' => '2024-10-01'],
            ['idAccion' => 7, 'idPiezaDental' => 2, 'descripcion' => 'Limpieza y profilaxis', 'cuadrante' => '2', 'fecha' => '2024-10-01'],
            ['idAccion' => 2, 'idPiezaDental' => 3, 'descripcion' => 'Obturación con resina compuesta', 'cuadrante' => '1', 'fecha' => '2024-09-15'],
            ['idAccion' => 1, 'idPiezaDental' => 6, 'descripcion' => 'Caries oclusal moderada', 'cuadrante' => '3', 'fecha' => '2024-10-02'],
            ['idAccion' => 1, 'idPiezaDental' => 7, 'descripcion' => 'Caries distal leve', 'cuadrante' => '4', 'fecha' => '2024-10-02'],
            ['idAccion' => 5, 'idPiezaDental' => 9, 'descripcion' => 'Caries profunda con afectación pulpar', 'cuadrante' => '4', 'fecha' => '2024-10-05'],
            ['idAccion' => 2, 'idPiezaDental' => 10, 'descripcion' => 'Obturación con amalgama', 'cuadrante' => '3', 'fecha' => '2024-09-20'],
            ['idAccion' => 4, 'idPiezaDental' => 11, 'descripcion' => 'Extracción quirúrgica', 'cuadrante' => '3', 'fecha' => '2024-10-08'],
            ['idAccion' => 1, 'idPiezaDental' => 15, 'descripcion' => 'Caries profunda en cara oclusal', 'cuadrante' => 'Superior Derecho', 'fecha' => '2025-11-09'],
            ['idAccion' => 1, 'idPiezaDental' => 18, 'descripcion' => 'Caries moderada en cara distal', 'cuadrante' => 'Inferior Derecho', 'fecha' => '2025-11-09'],
        ];
        foreach ($detalles as $detalle) {
            DetalleDental::create($detalle);
        }

        // ==================== EVOLUCIONES ====================
        $evoluciones = [
            ['idTratamiento' => 1, 'idPieza' => 1, 'fecha' => '2024-10-01', 'diagnosticoCIE' => 'Z01.2', 'procedimientoIndicacion' => 'Control preventivo semestral'],
            ['idTratamiento' => 1, 'idPieza' => 3, 'fecha' => '2024-10-01', 'diagnosticoCIE' => 'K02.1', 'procedimientoIndicacion' => 'Mantener higiene, control en 6 meses'],
            ['idTratamiento' => 2, 'idPieza' => 6, 'fecha' => '2024-10-02', 'diagnosticoCIE' => 'K02.0', 'procedimientoIndicacion' => 'Tartrectomía y profilaxis'],
            ['idTratamiento' => 2, 'idPieza' => 7, 'fecha' => '2024-10-02', 'diagnosticoCIE' => 'K02.0', 'procedimientoIndicacion' => 'Tartrectomía y profilaxis'],
            ['idTratamiento' => 3, 'idPieza' => 9, 'fecha' => '2024-10-05', 'diagnosticoCIE' => 'K04.0', 'procedimientoIndicacion' => 'Endodoncia conducto radicular, colocar corona'],
            ['idTratamiento' => 4, 'idPieza' => 11, 'fecha' => '2024-10-08', 'diagnosticoCIE' => 'K01.1', 'procedimientoIndicacion' => 'Extracción quirúrgica completada, control en 7 días'],
            ['idTratamiento' => 5, 'idPieza' => 13, 'fecha' => '2024-10-12', 'diagnosticoCIE' => 'M26.0', 'procedimientoIndicacion' => 'Inicio tratamiento ortodóntico, control mensual'],
            ['idTratamiento' => 5, 'idPieza' => 14, 'fecha' => '2024-10-12', 'diagnosticoCIE' => 'M26.0', 'procedimientoIndicacion' => 'Inicio tratamiento ortodóntico, control mensual'],
            ['idTratamiento' => 9, 'idPieza' => 15, 'fecha' => '2025-11-09', 'diagnosticoCIE' => 'K02.1', 'procedimientoIndicacion' => 'Obturación con composite en cara oclusal'],
        ];
        foreach ($evoluciones as $evolucion) {
            Evolucion::create($evolucion);
        }

        // ==================== MENSAJES FINALES ====================
        $this->command->info('');
        $this->command->info('✅ Base de datos poblada exitosamente!');
        $this->command->info('');
        $this->command->info('📊 Resumen de datos creados:');
        $this->command->info('   - 15 Usuarios');
        $this->command->info('   - 6 Pacientes');
        $this->command->info('   - 4 Odontólogos');
        $this->command->info('   - 2 Administradores');
        $this->command->info('   - 2 Asistentes');
        $this->command->info('   - 8 Especialidades');
        $this->command->info('   - 8 Acciones');
        $this->command->info('   - 9 Citas');
        $this->command->info('   - 9 Tratamientos');
        $this->command->info('   - 9 Odontogramas');
        $this->command->info('   - 18 Piezas Dentales');
        $this->command->info('   - 9 Sesiones');
        $this->command->info('   - 9 Historias Clínicas');
        $this->command->info('   - 9 Planes de Tratamiento');
        $this->command->info('   - 10 Detalles Dentales');
        $this->command->info('   - 9 Evoluciones');
        $this->command->info('');
        $this->command->info('🔑 Credenciales de acceso:');
        $this->command->info('   Admin: admin@clinicadental.com / admin123');
        $this->command->info('   Odontólogo: odontologo@clinicadental.com / 123456789');
        $this->command->info('   Paciente: paciente@clinicadental.com / 123456789');
        $this->command->info('   Asistente: asistente@clinicadental.com / 123456789');
        $this->command->info('   Otros usuarios: password123');
        $this->command->info('');
        
    // ==================== PROCEDIMIENTOS ALMACENADOS Y FUNCIONES ====================
        $this->command->info('📦 Creando procedimientos almacenados y funciones...');
        
        // Función: nombre_dia_es
        DB::unprepared("DROP FUNCTION IF EXISTS `nombre_dia_es`");
        DB::unprepared("
            CREATE FUNCTION `nombre_dia_es` (`f` DATE) 
            RETURNS VARCHAR(10) CHARSET utf8mb4 COLLATE utf8mb4_general_ci 
            DETERMINISTIC 
            RETURN ELT(
                WEEKDAY(f) + 1,
                'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'
            )
        ");

        // Procedimiento: citas_por_dia_semana_mes
        DB::unprepared("DROP PROCEDURE IF EXISTS `citas_por_dia_semana_mes`");
        DB::unprepared("

            CREATE PROCEDURE citas_por_dia_semana_mes(
            IN p_mes  VARCHAR(20),
            IN p_anio INT
            )
            READS SQL DATA
            BEGIN
            DECLARE v_mes_norm VARCHAR(20);
            DECLARE v_mes INT;

            /* Normaliza el mes a minúsculas y sin espacios */
            SET v_mes_norm = LOWER(TRIM(p_mes));

            /* Soporta nombres, abreviaturas y números como texto */
            SET v_mes = CASE v_mes_norm
                WHEN '1' THEN 1  WHEN '01' THEN 1  WHEN 'ene' THEN 1  WHEN 'enero' THEN 1
                WHEN '2' THEN 2  WHEN '02' THEN 2  WHEN 'feb' THEN 2  WHEN 'febrero' THEN 2
                WHEN '3' THEN 3  WHEN '03' THEN 3  WHEN 'mar' THEN 3  WHEN 'marzo' THEN 3
                WHEN '4' THEN 4  WHEN '04' THEN 4  WHEN 'abr' THEN 4  WHEN 'abril' THEN 4
                WHEN '5' THEN 5  WHEN '05' THEN 5  WHEN 'may' THEN 5  WHEN 'mayo' THEN 5
                WHEN '6' THEN 6  WHEN '06' THEN 6  WHEN 'jun' THEN 6  WHEN 'junio' THEN 6
                WHEN '7' THEN 7  WHEN '07' THEN 7  WHEN 'jul' THEN 7  WHEN 'julio' THEN 7
                WHEN '8' THEN 8  WHEN '08' THEN 8  WHEN 'ago' THEN 8  WHEN 'agosto' THEN 8
                WHEN '9' THEN 9  WHEN '09' THEN 9  WHEN 'sep' THEN 9  WHEN 'sept' THEN 9
                WHEN 'set' THEN 9
                WHEN 'septiembre' THEN 9 WHEN 'setiembre' THEN 9
                WHEN '10' THEN 10 WHEN 'oct' THEN 10 WHEN 'octubre' THEN 10
                WHEN '11' THEN 11 WHEN 'nov' THEN 11 WHEN 'noviembre' THEN 11
                WHEN '12' THEN 12 WHEN 'dic' THEN 12 WHEN 'diciembre' THEN 12
                ELSE NULL
            END;

            IF v_mes IS NULL OR p_anio IS NULL THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Mes no reconocido o año NULL. Usa nombres/abreviaturas en español (ej: enero, feb, set) o 1..12, y año numérico.';
            END IF;

            /* Subconsulta para cumplir ONLY_FULL_GROUP_BY y ordenar L->D */
            SELECT
                ELT(t.wd + 1, 'lunes','martes','miércoles','jueves','viernes','sábado','domingo') AS dia_semana,
                t.total_citas
            FROM (
                SELECT
                WEEKDAY(c.fecha) AS wd,   /* 0=Lun .. 6=Dom */
                COUNT(*)         AS total_citas
                FROM cita c
                WHERE YEAR(c.fecha) = p_anio
                AND MONTH(c.fecha) = v_mes
                GROUP BY WEEKDAY(c.fecha)
            ) AS t
            ORDER BY t.wd;
            END

        ");

        // Procedimiento: citas_por_mes_anio
        DB::unprepared("DROP PROCEDURE IF EXISTS `citas_por_mes_anio`");
        DB::unprepared("
            CREATE PROCEDURE `citas_por_mes_anio` (IN `p_anio` INT, IN `p_mes` INT)
            BEGIN
                SELECT
                    YEAR(fecha)  AS anio,
                    MONTH(fecha) AS mes,
                    nombre_dia_es(fecha) AS dia_semana,
                    COUNT(*) AS NroCitas
                FROM cita
                WHERE (p_anio IS NULL OR YEAR(fecha) = p_anio)
                    AND (p_mes  IS NULL OR MONTH(fecha) = p_mes)
                GROUP BY anio, mes, WEEKDAY(fecha)
                ORDER BY WEEKDAY(fecha);
            END
        ");

        // Procedimiento: ingresos_por_odonto_mes
        DB::unprepared("DROP PROCEDURE IF EXISTS `ingresos_por_odonto_mes`");
        DB::unprepared("
            CREATE PROCEDURE `ingresos_por_odonto_mes` (IN `p_anio` INT, IN `p_mes` INT)
            BEGIN
                SELECT
                    u.idUsuario,
                    SUM(t.precio) AS total,
                    CONCAT(u.nombre,' ',u.paterno,' ',u.materno) AS nombre_completo,
                    YEAR(c.fecha) AS anio,
                    MONTH(c.fecha) AS mes
                FROM cita c
                INNER JOIN tratamiento t ON c.idCita = t.idCita
                INNER JOIN atiende a     ON a.idCita = t.idCita
                INNER JOIN usuario u     ON u.idUsuario = a.idUsuario_Odontologo
                WHERE (p_anio IS NULL OR YEAR(c.fecha) = p_anio)
                    AND (p_mes  IS NULL OR MONTH(c.fecha) = p_mes)
                GROUP BY
                    u.idUsuario, u.nombre, u.paterno, u.materno,
                    YEAR(c.fecha), MONTH(c.fecha)
                ORDER BY total DESC;
            END
        ");

        // Procedimiento: resumen_citas_dias
        DB::unprepared("DROP PROCEDURE IF EXISTS `resumen_citas_dias`");
        DB::unprepared("
            CREATE PROCEDURE `resumen_citas_dias` (IN `p_anio` INT, IN `p_mes` INT, IN `p_idUsuario` INT)
            BEGIN
                SELECT
                    t.idUsuario,
                    t.estado,
                    t.anio,
                    t.mes,
                    ELT(t.wd + 1,
                        'lunes','martes','miércoles','jueves','viernes','sábado','domingo') AS dia,
                    t.Nro
                FROM (
                    SELECT
                        u.idUsuario,
                        c.estado,
                        YEAR(c.fecha)  AS anio,
                        MONTH(c.fecha) AS mes,
                        WEEKDAY(c.fecha) AS wd,
                        COUNT(*) AS Nro
                    FROM cita c
                    JOIN atiende a ON a.idCita = c.idCita
                    JOIN usuario u ON u.idUsuario = a.idUsuario_Odontologo
                    WHERE (p_anio IS NULL OR YEAR(c.fecha) = p_anio)
                        AND (p_mes  IS NULL OR MONTH(c.fecha) = p_mes)
                        AND (p_idUsuario IS NULL OR u.idUsuario = p_idUsuario)
                    GROUP BY
                        u.idUsuario, c.estado, YEAR(c.fecha), MONTH(c.fecha), WEEKDAY(c.fecha)
                ) AS t
                ORDER BY
                    t.idUsuario, t.estado, t.anio, t.mes, t.wd;
            END
        ");

        // Procedimiento: resumen_citas_por_odonto
        DB::unprepared("DROP PROCEDURE IF EXISTS `resumen_citas_por_odonto`");
        DB::unprepared("
            CREATE PROCEDURE `resumen_citas_por_odonto` (IN `p_anio` INT, IN `p_mes` INT)
            BEGIN
                SELECT
                    u.idUsuario,
                    CONCAT_WS(' ', u.nombre, u.paterno, u.materno) AS nombre_completo,
                    c.estado,
                    YEAR(c.fecha)  AS anio,
                    MONTH(c.fecha) AS mes,
                    COUNT(c.idCita) AS Nro
                FROM cita c
                JOIN hace h    ON h.idCita = c.idCita
                JOIN usuario u ON u.idUsuario = h.idUsuario_Odontologo
                WHERE (p_anio IS NULL OR YEAR(c.fecha) = p_anio)
                    AND (p_mes  IS NULL OR MONTH(c.fecha) = p_mes)
                GROUP BY
                    u.idUsuario, u.nombre, u.paterno, u.materno,
                    c.estado, YEAR(c.fecha), MONTH(c.fecha)
                ORDER BY
                    h.idUsuario_Odontologo, nombre_completo, c.estado, anio, mes;
            END
        ");

        // Procedimiento: sp_ganancia_citas_por_odontologo
        DB::unprepared("DROP PROCEDURE IF EXISTS `sp_ganancia_citas_por_odontologo`");
        DB::unprepared("
            CREATE PROCEDURE `sp_ganancia_citas_por_odontologo` (IN `p_anio` INT, IN `p_mes` INT)
            BEGIN
                IF p_mes IS NOT NULL AND (p_mes < 1 OR p_mes > 12) THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'p_mes debe estar entre 1..12';
                END IF;

                SELECT
                    u.idUsuario,
                    CONCAT_WS(' ', u.paterno, u.materno, u.nombre) AS nombre_completo,
                    SUM(c.pagado) AS Total_Ganancia_Citas
                FROM cita c
                INNER JOIN hace h  ON h.idCita = c.idCita
                INNER JOIN usuario u ON u.idUsuario = h.idUsuario_Odontologo
                WHERE (p_anio IS NULL OR YEAR(c.fecha) = p_anio)
                    AND (p_mes  IS NULL OR MONTH(c.fecha) = p_mes)
                GROUP BY u.idUsuario, nombre_completo
                ORDER BY Total_Ganancia_Citas DESC;
            END
        ");

        // Procedimiento: sp_ganancia_por_tratamiento
        DB::unprepared("DROP PROCEDURE IF EXISTS `sp_ganancia_por_tratamiento`");
        DB::unprepared("
            CREATE PROCEDURE `sp_ganancia_por_tratamiento` (IN `p_anio` INT, IN `p_mes` INT)
            BEGIN
                IF p_mes IS NOT NULL AND (p_mes < 1 OR p_mes > 12) THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'p_mes debe estar entre 1..12';
                END IF;

                SELECT
                    t.nombre,
                    SUM(t.precio) AS total_ganancia_tratamiento
                FROM cita c
                INNER JOIN tratamiento t ON t.idCita = c.idCita
                WHERE (p_anio IS NULL OR YEAR(c.fecha) = p_anio)
                    AND (p_mes  IS NULL OR MONTH(c.fecha) = p_mes)
                GROUP BY t.nombre
                ORDER BY total_ganancia_tratamiento DESC, t.nombre;
            END
        ");

        // Procedimiento: sp_ganancia_tratamientos_por_odontologo
        DB::unprepared("DROP PROCEDURE IF EXISTS `sp_ganancia_tratamientos_por_odontologo`");
        DB::unprepared("
            CREATE PROCEDURE `sp_ganancia_tratamientos_por_odontologo` (IN `p_anio` INT, IN `p_mes` INT)
            BEGIN
                IF p_mes IS NOT NULL AND (p_mes < 1 OR p_mes > 12) THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'p_mes debe estar entre 1..12';
                END IF;

                SELECT
                    u.idUsuario,
                    CONCAT_WS(' ', u.paterno, u.materno, u.nombre) AS nombre_completo,
                    SUM(t.precio) AS total_ganancia_tratamiento
                FROM cita c
                INNER JOIN tratamiento t ON t.idCita = c.idCita
                INNER JOIN hace h        ON h.idCita = c.idCita
                INNER JOIN usuario u     ON u.idUsuario = h.idUsuario_Odontologo
                WHERE (p_anio IS NULL OR YEAR(c.fecha) = p_anio)
                    AND (p_mes  IS NULL OR MONTH(c.fecha) = p_mes)
                GROUP BY u.idUsuario, nombre_completo
                ORDER BY total_ganancia_tratamiento DESC;
            END
        ");

        // Procedimiento: sp_reporte_citas_por_estado_odontologo
        DB::unprepared("DROP PROCEDURE IF EXISTS `sp_reporte_citas_por_estado_odontologo`");
        DB::unprepared("
            CREATE PROCEDURE `sp_reporte_citas_por_estado_odontologo` (IN `p_anio` INT, IN `p_mes` INT)
            BEGIN
                IF p_mes IS NOT NULL AND (p_mes < 1 OR p_mes > 12) THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'p_mes debe estar entre 1..12';
                END IF;

                SELECT
                    u.idUsuario,
                    CONCAT_WS(' ', u.paterno, u.materno, u.nombre) AS nombre_completo,
                    c.estado,
                    COUNT(*) AS Nro_Citas
                FROM cita c
                INNER JOIN hace h  ON h.idCita = c.idCita
                INNER JOIN usuario u ON u.idUsuario = h.idUsuario_Odontologo
                WHERE (p_anio IS NULL OR YEAR(c.fecha) = p_anio)
                    AND (p_mes  IS NULL OR MONTH(c.fecha) = p_mes)
                GROUP BY u.idUsuario, nombre_completo, c.estado
                ORDER BY u.idUsuario, c.estado;
            END
        ");

        // Procedimiento: vaciar_bd
        DB::unprepared("DROP PROCEDURE IF EXISTS `vaciar_bd`");
        DB::unprepared("
            CREATE PROCEDURE `vaciar_bd` (IN `dbname` VARCHAR(64))
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE t VARCHAR(64);
                DECLARE cur CURSOR FOR
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = dbname AND table_type = 'BASE TABLE';
                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                SET FOREIGN_KEY_CHECKS = 0;
                OPEN cur;
                read_loop: LOOP
                    FETCH cur INTO t;
                    IF done THEN LEAVE read_loop; END IF;
                    SET @s = CONCAT('DELETE FROM `', dbname, '`.`', t, '`');
                    PREPARE stmt FROM @s;
                    EXECUTE stmt;
                    DEALLOCATE PREPARE stmt;
                END LOOP;
                CLOSE cur;
                SET FOREIGN_KEY_CHECKS = 1;
            END
        ");
        DB::unprepared("DROP PROCEDURE IF EXISTS `obtener_ingresos_y_pendientes`");
        DB::unprepared("
        CREATE PROCEDURE obtener_ingresos_y_pendientes(
            IN p_anio INT,
            IN p_mes INT
        )
        BEGIN
            SELECT 
                SUM(pagado) AS ingresos,
                SUM(costo - pagado) AS pendiente
            FROM cita
            WHERE (p_anio IS NULL OR YEAR(fecha) = p_anio)
            AND (p_mes IS NULL OR MONTH(fecha) = p_mes);
        END
        ");

        DB::unprepared("DROP PROCEDURE IF EXISTS `obtener_total_citas`");
        DB::unprepared("
        CREATE PROCEDURE obtener_total_citas(
            IN p_anio INT,
            IN p_mes INT
        )
        BEGIN
            SELECT COUNT(*) AS total_citas
            FROM cita
            WHERE (p_anio IS NULL OR YEAR(fecha) = p_anio)
            AND (p_mes IS NULL OR MONTH(fecha) = p_mes);
        END
        ");

        DB::unprepared("DROP PROCEDURE IF EXISTS `obtener_odontologos_activos`");
        DB::unprepared("
        CREATE PROCEDURE obtener_odontologos_activos()
        BEGIN
            SELECT COUNT(*) AS odontologos_activos
            FROM usuario u
            INNER JOIN odontologo o ON o.idUsuario_Odontologo = u.idUsuario;
        END
        ");

        DB::unprepared("DROP PROCEDURE IF EXISTS `obtener_citas_por_estado`");
        DB::unprepared("
        CREATE PROCEDURE obtener_citas_por_estado(
            IN p_anio INT,
            IN p_mes INT
        )
        BEGIN
            SELECT estado, COUNT(*) AS total
            FROM cita
            WHERE (p_anio IS NULL OR YEAR(fecha) = p_anio)
            AND (p_mes IS NULL OR MONTH(fecha) = p_mes)
            GROUP BY estado;
        END
        ");

        DB::unprepared("DROP PROCEDURE IF EXISTS `obtener_suma_pagado`");
        DB::unprepared("
        CREATE PROCEDURE obtener_suma_pagado(
            IN p_anio INT,
            IN p_mes INT
        )
        BEGIN
            SELECT SUM(pagado) AS total_pagado
            FROM cita
            WHERE (p_anio IS NULL OR YEAR(fecha) = p_anio)
            AND (p_mes IS NULL OR MONTH(fecha) = p_mes);
        END
        ");


        $this->command->info('✅ Procedimientos y funciones creados exitosamente!');
        
        // ==================== MENSAJES FINALES ====================
        $this->command->info('');
        $this->command->info('✅ Base de datos poblada exitosamente!');
        $this->command->info('');
    }
    
}