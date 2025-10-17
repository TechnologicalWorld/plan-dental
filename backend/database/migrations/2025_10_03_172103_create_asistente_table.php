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
        Schema::create('asistente', function (Blueprint $table) {
            $table->unsignedBigInteger('idUsuario_Asistente')->primary();
            $table->foreign('idUsuario_Asistente')->references('idUsuario')->on('usuario')->onDelete('cascade');

            $table->string('turno', 50)->nullable();
            $table->date('fechaContratacion')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistente');
    }
};
