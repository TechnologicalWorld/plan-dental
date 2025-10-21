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
            $table->unsignedBigInteger('idUsuario_Paciente');
            $table->unsignedBigInteger('idCita');
            $table->unsignedBigInteger('idUsuario_Asistente')->nullable();
            $table->unsignedBigInteger('idUsuario_Odontologo');
            $table->date('fecha')->nullable();

            $table->foreign('idUsuario_Paciente')->references('idUsuario_Paciente')->on('paciente')->onDelete('cascade');
            $table->foreign('idCita')->references('idCita')->on('cita')->onDelete('cascade');
            $table->foreign('idUsuario_Asistente')->references('idUsuario_Asistente')->on('asistente')->onDelete('cascade');
            $table->foreign('idUsuario_Odontologo')->references('idUsuario_Odontologo')->on('odontologo')->onDelete('cascade');

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
