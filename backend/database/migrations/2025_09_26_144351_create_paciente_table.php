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
        Schema::create('paciente', function (Blueprint $table) {
            $table->string("ci")->primary();
            $table->foreign("ci")->references("ci")->on("usuario")->onDelete('cascade');
            $table->string('codigoSeguro');
            $table->string('lugarNacimiento');
            $table->string('domicilio');
            $table->date('fechaIngreso');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paciente');
    }
};
