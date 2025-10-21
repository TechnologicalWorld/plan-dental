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
        Schema::create('historia_clinica', function (Blueprint $table) {
            $table->id('idHistoriaClinica');
            $table->text('antecedentesPatologicos')->nullable();
            $table->text('motivoConsulta')->nullable();
            $table->text('signosVitales')->nullable();
            $table->text('descripcionSignosSintomasDentales')->nullable();
            $table->text('examenClinicoBucoDental')->nullable();
            $table->text('observaciones')->nullable();
            $table->text('enfermedadActual')->nullable();

            $table->unsignedBigInteger('idUsuario_Paciente');
            $table->unsignedBigInteger('idUsuario_Odontologo');

            $table->foreign('idUsuario_Paciente')->references('idUsuario_Paciente')->on('paciente')->onDelete('cascade');
            $table->foreign('idUsuario_Odontologo')->references('idUsuario_Odontologo')->on('odontologo')->onDelete('cascade');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historia_clinica');
    }
};
