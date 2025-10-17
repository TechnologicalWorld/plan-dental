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
        Schema::create('evolucion', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idTratamiento');
            $table->unsignedBigInteger('idPieza');
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
            $table->string('diagnosticoCIE', 50)->nullable();
            $table->text('procedimientoIndicacion')->nullable();

            $table->foreign('idTratamiento')->references('idTratamiento')->on('tratamiento')->onDelete('cascade');
            $table->foreign('idPieza')->references('idPieza')->on('pieza_dental')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evolucion');
    }
};
