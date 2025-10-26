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
        Schema::create('detalle_dental', function (Blueprint $table) {
            $table->unsignedBigInteger('idAccion');
            $table->unsignedBigInteger('idPiezaDental');
            $table->text('descripcion')->nullable();
            $table->string('cuadrante', 50);
            $table->date('fecha');


            $table->foreign('idAccion')->references('idAccion')->on('accion')->onDelete('cascade');
            $table->foreign('idPiezaDental')->references('idPieza')->on('pieza_dental')->onDelete('cascade');
            
            $table->primary(['idAccion', 'idPiezaDental']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_dental');
    }
};
