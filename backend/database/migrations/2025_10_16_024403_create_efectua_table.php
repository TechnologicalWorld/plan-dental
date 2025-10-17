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
        Schema::create('efectua', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idOdontograma');
            $table->unsignedBigInteger('idOdontologo');
            $table->unsignedBigInteger('idPaciente');
            $table->date('fecha')->nullable();

            $table->foreign('idOdontograma')->references('idOdontograma')->on('odontograma')->onDelete('cascade');
            $table->foreign('idOdontologo')->references('idUsuario_Odontologo')->on('odontologo')->onDelete('cascade');
            $table->foreign('idPaciente')->references('idUsuario_Paciente')->on('paciente')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('efectua');
    }
};
