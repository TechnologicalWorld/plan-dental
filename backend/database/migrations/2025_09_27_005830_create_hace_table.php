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
            $table->string('idPaciente')->primary();
            $table->string('idCita')->primary();
            $table->string('idAsistente');
            $table->string('idOdontologo');
            $table->date('fecha');
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
