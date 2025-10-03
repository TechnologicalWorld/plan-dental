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
        Schema::create('usuario', function (Blueprint $table) {
            $table->string('ci')->primary();
            $table->string('nombre');
            $table->string('paterno');
            $table->string('materno')->nullable();
            $table->date('fechaNacimiento');
            $table->enum('genero',['M','F']);
            $table->string('telefono');
            $table->string('contrasena');
            $table->string('correo')->unique();
            $table->string('direccion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
