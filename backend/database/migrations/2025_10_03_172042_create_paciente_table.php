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
            $table->unsignedBigInteger('idusuario')->primary();
            $table->foreign('idusuario')->references('idusuario')->on('usuario')->onDelete('cascade');
            
            $table->string('codigoSeguro')->nullable(); 
            $table->string('lugarNacimiento')->nullable();
            $table->string('domicilio')->nullable();
            $table->date('fechaIngreso');
            // $table->time('horaIngreso'); Es correcto?
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
