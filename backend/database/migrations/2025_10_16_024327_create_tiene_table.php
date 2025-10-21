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
        Schema::create('tiene', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('idEspecialidad');
        $table->unsignedBigInteger('idUsuario_Odontologo');

        $table->foreign('idEspecialidad')->references('idEspecialidad')->on('especialidad')->onDelete('cascade');
        $table->foreign('idUsuario_Odontologo')->references('idUsuario_Odontologo')->on('odontologo')->onDelete('cascade');

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiene');
    }
};
