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
        Schema::create('plan', function (Blueprint $table) {
            $table->id('idPlan');
            $table->text('observacion')->nullable();
            $table->text('medicamentos')->nullable();
            $table->integer('duracionTotal')->nullable();
            $table->integer('duracionEstimada')->nullable();

            $table->unsignedBigInteger('idPaciente');
            $table->unsignedBigInteger('idOdontograma');

            $table->foreign('idPaciente')->references('idUsuario_Paciente')->on('paciente')->onDelete('cascade');
            $table->foreign('idOdontograma')->references('idOdontograma')->on('odontograma')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan');
    }
};
