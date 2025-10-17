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
        Schema::create('asiste', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idSesion');
            $table->unsignedBigInteger('idPaciente');
            $table->unsignedBigInteger('idOdontologo');
            $table->date('fecha')->nullable();

            $table->foreign('idSesion')->references('idSesion')->on('sesion')->onDelete('cascade');
            $table->foreign('idPaciente')->references('idUsuario_Paciente')->on('paciente')->onDelete('cascade');
            $table->foreign('idOdontologo')->references('idUsuario_Odontologo')->on('odontologo')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asiste');
    }
};
