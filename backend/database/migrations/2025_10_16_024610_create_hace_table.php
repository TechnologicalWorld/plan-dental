<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hace', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idPaciente');
            $table->unsignedBigInteger('idCita');
            $table->unsignedBigInteger('idAsistente')->nullable();
            $table->unsignedBigInteger('idOdontologo');
            $table->date('fecha')->nullable();

            $table->foreign('idPaciente')->references('idUsuario_Paciente')->on('paciente')->onDelete('cascade');
            $table->foreign('idCita')->references('idCita')->on('cita')->onDelete('cascade');
            $table->foreign('idAsistente')->references('idUsuario_Asistente')->on('asistente')->onDelete('cascade');
            $table->foreign('idOdontologo')->references('idUsuario_Odontologo')->on('odontologo')->onDelete('cascade');

            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hace');
    }
};
