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
            $table->unsignedBigInteger('idOdontograma');
            $table->unsignedBigInteger('idUsuario_Odontologo');
            $table->unsignedBigInteger('idUsuario_Paciente');
            $table->date('fecha');

            $table->foreign('idOdontograma')->references('idOdontograma')->on('odontograma')->onDelete('cascade');
            $table->foreign('idUsuario_Odontologo')->references('idUsuario_Odontologo')->on('odontologo')->onDelete('cascade');
            $table->foreign('idUsuario_Paciente')->references('idUsuario_Paciente')->on('paciente')->onDelete('cascade');
            
            $table->primary(['idOdontograma', 'idUsuario_Odontologo', 'idUsuario_Paciente']);
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
