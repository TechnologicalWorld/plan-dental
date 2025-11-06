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
        Schema::create('pieza_dental', function (Blueprint $table) {
            $table->id('idPieza');
            $table->string('posicion', 20)->nullable();
            $table->string('nombre', 50)->nullable();
            $table->string('tipo', 50)->nullable();
            $table->string('estado', 50)->nullable();
            
            $table->unsignedBigInteger("idOdontograma");
            $table->foreign("idOdontograma")->references("idOdontograma")->on("odontograma")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pieza_dental');
    }
};
